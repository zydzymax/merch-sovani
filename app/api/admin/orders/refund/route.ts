import { logger } from '@/lib/utils/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { annulEntriesForOrder } from '@/lib/antifraud/annulEntries'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { sendRefundNotification } from '@/lib/telegram/bot'

/**
 * Admin API: Refund an order and annul lottery entries
 * POST /api/admin/orders/refund
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const { error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const { orderId, reason } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        entries: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Prevent refunding an order that's already refunded
    if (order.status === 'REFUNDED') {
      return NextResponse.json({ error: 'Order already refunded' }, { status: 400 })
    }

    // Process refund in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'REFUNDED',
          participatesInPromo: false, // Remove from lottery
          notes: reason ? `Refund reason: ${reason}` : order.notes,
        },
      })

      // Update payment status
      await tx.payment.updateMany({
        where: { orderId },
        data: { status: 'REFUNDED' },
      })

      // Restore inventory
      for (const item of order.items) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: {
            quantity: { increment: item.quantity },
          },
        })
      }

      // ANTIFRAUD: Annul all lottery entries for this order
      const entriesAnnulled = await annulEntriesForOrder(orderId, 'refund')

      return {
        order: await tx.order.findUnique({ where: { id: orderId } }),
        entriesAnnulled,
      }
    })

    // Send Telegram notification if chat ID exists
    if (order.telegramChatId) {
      try {
        const trackingNumber = order.cdekTrackingNumber || 
                              order.cdekOrderUuid || 
                              order.orderNumber
        await sendRefundNotification(
          order.telegramChatId,
          order.orderNumber,
          trackingNumber
        )
        logger.info(`Telegram refund notification sent for order ${order.orderNumber}`)
      } catch (telegramError) {
        logger.error('Failed to send Telegram refund notification', telegramError)
        // Don't fail the refund if notification fails
      }
    }

    logger.info(`✅ Order ${order.orderNumber} refunded successfully`)
    logger.info(`   Entries annulled: ${result.entriesAnnulled}`)

    return NextResponse.json({
      success: true,
      message: `Order refunded. ${result.entriesAnnulled} lottery entries annulled.`,
      data: result,
    })
  } catch (error) {
    logger.error('Refund error:', error)
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}

/**
 * GET: Check if order can be refunded
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const { error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        entries: {
          where: { isActive: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const canRefund = order.status !== 'REFUNDED' && order.status !== 'CANCELLED'
    const hasActiveEntries = order.entries.length > 0

    return NextResponse.json({
      canRefund,
      hasActiveEntries,
      status: order.status,
      hasReturnRight: order.hasReturnRight,
      participatesInPromo: order.participatesInPromo,
      entriesCount: order.entries.length,
    })
  } catch (error) {
    logger.error('Check refund error:', error)
    return NextResponse.json({ error: 'Failed to check refund status' }, { status: 500 })
  }
}
