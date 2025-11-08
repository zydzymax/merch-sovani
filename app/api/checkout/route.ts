export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'

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
    } = body

    // Validate required fields
    if (!email || !phone || !fullName || !region || !city || !address || !postalCode) {
      return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 })
    }

    // Get session and cart
    const session = await getOrCreateSession()
    const cartItems = session.cart || []

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })
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
          items: {
            create: cartItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase: item.variant.price,
            })),
          },
        },
      })

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
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Ошибка оформления заказа' }, { status: 500 })
  }
}
