import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateEntryCode } from '@/lib/utils/format'

/**
 * Mock payment webhook
 * В реальной интеграции это будет YooKassa callback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status } = body

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
    }

    // Find payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status === 'succeeded' ? 'SUCCEEDED' : 'FAILED',
        transactionId: `MOCK-${Date.now()}`,
      },
    })

    if (status === 'succeeded') {
      // КРИТИЧЕСКАЯ ЛОГИКА: Обработка успешной оплаты
      await handleSuccessfulPayment(payment.orderId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * КРИТИЧЕСКАЯ ФУНКЦИЯ: Обработка успешной оплаты
 * Генерация entryCode, установка hasReturnRight=false, создание Entry
 */
async function handleSuccessfulPayment(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
    },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
      },
    })

    // Release inventory reservation and decrease quantity
    const orderItems = await tx.orderItem.findMany({
      where: { orderId },
    })

    for (const item of orderItems) {
      await tx.inventory.update({
        where: { variantId: item.variantId },
        data: {
          quantity: { decrement: item.quantity },
          reserved: { decrement: item.quantity },
        },
      })
    }

    // КРИТИЧНО: Если пользователь выбрал участие в акции
    if (order.participatesInPromo) {
      // Генерируем уникальный код участия
      const entryCode = generateEntryCode()

      // Обновляем заказ: добавляем entryCode, убираем право на возврат
      await tx.order.update({
        where: { id: orderId },
        data: {
          entryCode,
          hasReturnRight: false, // ← ВОЗВРАТ НЕВОЗМОЖЕН!
        },
      })

      // Создаем запись участия в розыгрыше
      const activeDraw = await tx.draw.findFirst({
        where: { status: 'ACTIVE' },
      })

      await tx.entry.create({
        data: {
          uniqueCode: entryCode,
          userId: order.userId,
          orderId: order.id,
          drawId: activeDraw?.id || null,
          weight: 1, // базовый вес для заказа
          source: 'order',
          metadata: {
            orderNumber: order.orderNumber,
            subtotal: order.subtotal,
          },
        },
      })

      // TODO: Отправить email с кодом участия
      // await sendPromoParticipationEmail(order.email, entryCode)
      console.log(`✅ Entry code generated for order ${order.orderNumber}: ${entryCode}`)
    } else {
      // Если НЕ участвует в акции — право на возврат сохраняется
      console.log(`ℹ️ Order ${order.orderNumber} does NOT participate in promo. Return right preserved.`)
    }

    // TODO: Отправить email подтверждения заказа
    // await sendOrderConfirmationEmail(order.email, order)
  })

  console.log(`✅ Payment processed successfully for order ${order.orderNumber}`)
}
