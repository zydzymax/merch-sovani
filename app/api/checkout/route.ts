export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'
import { calculateOrderFraudScore } from '@/lib/antifraud/calculateFraudScore'
import { validateEmail } from '@/lib/utils/emailValidation'
import { logger } from '@/lib/utils/logger'
import { createPayment } from '@/lib/payments/yookassa'
import { generateUniqueEntryCode } from '@/lib/utils/generateUniqueEntryCode'

// Promo codes for keychain bundles
const KEYCHAIN_PROMO_MAP: Record<string, number> = {
  '1-brelok': 1,   // 1 keychain (990₽) = 1 code
  '2-breloka': 3,  // 2 keychains (1290₽) = 3 codes
  '3-breloka': 5,  // 3 keychains (1590₽) = 5 codes
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      phone,
      fullName,
      region,
      city,
      address,
      postalCode,
      deviceFingerprint,
      deliveryMethod = 'cdek',
      pvzCode,
    } = body

    // Validate required fields
    if (!email || !phone || !fullName || !region || !city || !address || !postalCode) {
      return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 })
    }

    // Email validation with disposable detection
    const emailValidation = validateEmail(email, { allowDisposable: false })
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    // Russian phone format validation (+7XXXXXXXXXX)
    const phoneRegex = /^\+?7[0-9]{10}$/
    if (!phoneRegex.test(phone.replace(/[\s\-()]/g, ''))) {
      return NextResponse.json({ error: 'Некорректный формат телефона. Используйте формат +7XXXXXXXXXX' }, { status: 400 })
    }

    // Length validations
    if (fullName.length > 200) {
      return NextResponse.json({ error: 'ФИО слишком длинное (макс. 200 символов)' }, { status: 400 })
    }
    if (address.length > 500) {
      return NextResponse.json({ error: 'Адрес слишком длинный (макс. 500 символов)' }, { status: 400 })
    }
    if (postalCode.length > 20) {
      return NextResponse.json({ error: 'Индекс слишком длинный (макс. 20 символов)' }, { status: 400 })
    }

    // SQL injection prevention
    const dangerousChars = /<script|javascript:|onerror=|onclick=/i
    if (dangerousChars.test(fullName) || dangerousChars.test(address)) {
      return NextResponse.json({ error: 'Недопустимые символы в данных' }, { status: 400 })
    }

    // Get session and cart
    const session = await getOrCreateSession()
    const cartItems = session.cart || []

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })
    }

    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      request.ip ||
                      'unknown'

    // Calculate fraud score
    const fraudCheck = await calculateOrderFraudScore({
      userId: session.userId || undefined,
      email,
      phone,
      ipAddress,
      deviceFingerprint: deviceFingerprint || undefined,
      shippingAddress: address,
      shippingPostalCode: postalCode,
    })

    // Block high-risk orders
    if (fraudCheck.fraudScore >= 80) {
      logger.warn('High-risk order blocked', {
        fraudScore: fraudCheck.fraudScore,
        fraudFlags: fraudCheck.fraudFlags,
        email,
        ipAddress
      })
      return NextResponse.json({
        error: 'Заказ не может быть обработан. Пожалуйста, свяжитесь с поддержкой.',
      }, { status: 403 })
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    )
    const shippingCost = 0
    const total = subtotal + shippingCost

    // Calculate promo codes based on keychain products
    let totalPromoCodes = 0
    for (const item of cartItems) {
      const slug = item.variant.product?.slug || ''
      const codesForProduct = KEYCHAIN_PROMO_MAP[slug]
      if (codesForProduct) {
        totalPromoCodes += codesForProduct * item.quantity
      }
    }

    // If order contains keychains, it participates in promo
    const participatesInPromo = totalPromoCodes > 0

    // Generate all promo codes
    const allEntryCodes: string[] = []
    if (participatesInPromo) {
      for (let i = 0; i < totalPromoCodes; i++) {
        const code = await generateUniqueEntryCode()
        allEntryCodes.push(code)
      }
    }

    // Generate order number
    const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.userId,
          email,
          phone,
          status: 'PENDING',
          shippingMethod: 'cdek',
          shippingCost,
          shippingFullName: fullName,
          shippingAddress: address,
          shippingCity: city,
          shippingRegion: region,
          shippingPostalCode: postalCode,
          shippingCountry: 'RU',
          cdekPvzCode: pvzCode || null,
          subtotal,
          total,
          participatesInPromo,
          hasReturnRight: !participatesInPromo, // If promo, no return
          entryCode: allEntryCodes[0] || null, // First code for compatibility
          metadata: allEntryCodes.length > 0 ? { allEntryCodes } : undefined,
          // Antifraud fields
          ipAddress,
          deviceFingerprint,
          fraudScore: fraudCheck.fraudScore,
          fraudFlags: fraudCheck.fraudFlags,
          items: {
            create: cartItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase: item.variant.price,
            })),
          },
        },
      })

      // Create Entry records for lottery
      if (participatesInPromo && allEntryCodes.length > 0) {
        for (const code of allEntryCodes) {
          await tx.entry.create({
            data: {
              uniqueCode: code,
              orderId: newOrder.id,
              userId: session.userId,
              isActive: true,
            },
          })
        }
      }

      if (fraudCheck.isHighRisk) {
        logger.warn('High-risk order created', {
          orderNumber,
          fraudScore: fraudCheck.fraudScore,
          fraudFlags: fraudCheck.fraudFlags,
          email,
          ipAddress
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { sessionId: session.id },
      })

      return newOrder
    })

    logger.info('Order created', {
      orderNumber,
      participatesInPromo,
      promoCodesCount: allEntryCodes.length,
    })

    // Prepare receipt items for YooKassa
    const receiptItems = cartItems.map(item => ({
      description: item.variant.product?.name || item.variant.name || 'Товар',
      quantity: item.quantity,
      amount: item.variant.price * item.quantity,
      vatCode: 1
    }))

    // Create YooKassa payment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getnwin.ru'
    const returnUrl = `${siteUrl}/payment/success?order=${order.orderNumber}`

    const yooPayment = await createPayment({
      amount: total,
      orderId: order.id,
      description: `Заказ ${order.orderNumber}`,
      returnUrl,
      items: receiptItems,
      customerEmail: email,
      customerPhone: phone
    })

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'YUKASSA',
        status: 'PENDING',
        amount: total,
        currency: 'RUB',
        transactionId: yooPayment.id,
        confirmationUrl: yooPayment.confirmation?.confirmation_url,
        metadata: {
          yookassa_status: yooPayment.status,
          created_at: yooPayment.created_at
        }
      },
    })

    const paymentUrl = yooPayment.confirmation?.confirmation_url || returnUrl

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentUrl,
    })
  } catch (error) {
    logger.error('Checkout failed', error)
    return NextResponse.json({ error: 'Ошибка оформления заказа' }, { status: 500 })
  }
}
