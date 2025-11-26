export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'
import { calculateOrderFraudScore } from '@/lib/antifraud/calculateFraudScore'
import { validateEmail } from '@/lib/utils/emailValidation'
import { logger } from '@/lib/utils/logger'

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
      participatesInPromo = false,
      deviceFingerprint, // Client should send this
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

    // SQL injection prevention - basic sanitization
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

    // Block high-risk orders (fraud score >= 80)
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
    const shippingCost = 0 // Бесплатная доставка
    const total = subtotal + shippingCost

    // Generate order number
    const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.userId,
          email,
          phone,
          status: 'PENDING',
          shippingMethod: 'pochta_rf',
          shippingCost,
          shippingFullName: fullName,
          shippingAddress: address,
          shippingCity: city,
          shippingRegion: region,
          shippingPostalCode: postalCode,
          shippingCountry: 'RU',
          subtotal,
          total,
          participatesInPromo,
          hasReturnRight: !participatesInPromo, // If participates, no return
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

      // Log suspicious orders
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

    // Create mock payment
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'MOCK',
        status: 'PENDING',
        amount: total,
        currency: 'RUB',
      },
    })

    // Return payment URL
    const paymentUrl = `/payment/mock/${payment.id}`

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
