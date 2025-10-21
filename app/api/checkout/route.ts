import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'
import { z } from 'zod'

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  shippingFullName: z.string().min(2),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingRegion: z.string().min(2),
  shippingPostalCode: z.string().min(5),
  participatesInPromo: z.boolean().default(false), // КРИТИЧНО: чекбокс участия в акции
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = checkoutSchema.parse(body)

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId: session.sessionId },
      include: {
        variant: {
          include: {
            product: true,
            inventory: true,
          },
        },
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Check inventory
    for (const item of cartItems) {
      const available = (item.variant.inventory?.quantity || 0) - (item.variant.inventory?.reserved || 0)
      if (item.quantity > available) {
        return NextResponse.json(
          { error: `Not enough stock for ${item.variant.product.name}` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
    const shippingCost = 0 // Почта РФ включена
    const total = subtotal + shippingCost

    // Generate order number
    const orderNumber = `ORDER-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.userId || null,
          sessionId: session.sessionId,
          email: data.email,
          phone: data.phone,
          status: 'PENDING',
          shippingMethod: 'pochta_rf',
          shippingCost,
          shippingFullName: data.shippingFullName,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingRegion: data.shippingRegion,
          shippingPostalCode: data.shippingPostalCode,
          shippingCountry: 'RU',
          subtotal,
          total,
          // КРИТИЧНО: устанавливаем participatesInPromo из чекбокса
          participatesInPromo: data.participatesInPromo,
          // По умолчанию возврат разрешен (до получения entryCode)
          hasReturnRight: true,
          notes: data.notes,
        },
      })

      // Create order items
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.variant.price,
          },
        })

        // Reserve inventory
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: {
            reserved: { increment: item.quantity },
          },
        })
      }

      // Create payment record
      const provider = process.env.PAYMENT_PROVIDER === 'yukassa' ? 'YUKASSA' : 'MOCK'
      const payment = await tx.payment.create({
        data: {
          orderId: newOrder.id,
          provider,
          status: 'PENDING',
          amount: total,
          currency: 'RUB',
        },
      })

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { sessionId: session.sessionId },
      })

      return { order: newOrder, payment }
    })

    // TODO: Initiate payment with provider (YooKassa or Mock)
    // For now, return mock confirmation URL
    const confirmationUrl =
      process.env.PAYMENT_PROVIDER === 'yukassa'
        ? `/payment/yukassa/${order.payment.id}` // TODO: real YooKassa URL
        : `/payment/mock/${order.payment.id}` // Mock payment page

    return NextResponse.json({
      success: true,
      order: {
        id: order.order.id,
        orderNumber: order.order.orderNumber,
      },
      payment: {
        id: order.payment.id,
        confirmationUrl,
      },
    })
  } catch (error) {
    console.error('Checkout error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
