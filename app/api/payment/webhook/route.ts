export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { isYooKassaIP } from '@/lib/payments/yookassa'
import { logger } from '@/lib/utils/logger'
import { createCDEKShipment } from '@/lib/delivery/shipment'
import { sendRefundNotification } from '@/lib/telegram/bot'
import { sendOrderConfirmationEmail } from '@/lib/email'

interface YooKassaWebhookEvent {
  type: 'notification'
  event: 'payment.succeeded' | 'payment.canceled' | 'payment.waiting_for_capture' | 'refund.succeeded'
  object: {
    id: string
    status: string
    amount: {
      value: string
      currency: string
    }
    metadata?: {
      order_id?: string
    }
    payment_id?: string // For refunds
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for verification
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const clientIP = forwardedFor?.split(',')[0]?.trim() || realIP || ''

    // Verify request is from YooKassa
    if (!isYooKassaIP(clientIP)) {
      logger.warn('YooKassa webhook: Invalid IP', { ip: clientIP })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const event: YooKassaWebhookEvent = await request.json()

    logger.info('YooKassa webhook received', {
      event: event.event,
      paymentId: event.object.id,
      status: event.object.status
    })

    switch (event.event) {
      case 'payment.succeeded': {
        // Find payment by YooKassa transaction ID
        const payment = await prisma.payment.findUnique({
          where: { transactionId: event.object.id },
          include: {
            order: {
              include: {
                items: {
                  include: {
                    variant: {
                      include: {
                        product: true
                      }
                    }
                  }
                }
              }
            }
          }
        })

        if (!payment) {
          logger.warn('YooKassa webhook: Payment not found', { transactionId: event.object.id })
          return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
        }

        // Update payment and order status
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCEEDED',
              metadata: {
                ...(payment.metadata as object || {}),
                yookassa_status: event.object.status,
                completed_at: new Date().toISOString()
              }
            }
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAID' }
          })
        ])

        logger.info('Payment succeeded', {
          paymentId: payment.id,
          orderId: payment.orderId,
          orderNumber: payment.order.orderNumber
        })

        // Send order confirmation email
        try {
          const order = payment.order
          const orderMetadata = order.metadata as { allEntryCodes?: string[] } | null
          const allEntryCodes = orderMetadata?.allEntryCodes || (order.entryCode ? [order.entryCode] : [])

          const emailData = {
            orderNumber: order.orderNumber,
            name: order.shippingFullName || 'Покупатель',
            email: order.email,
            total: order.total / 100,
            subtotal: order.subtotal / 100,
            shippingCost: order.shippingCost / 100,
            items: order.items.map((item) => ({
              name: item.variant.product.name,
              variant: item.variant.name || '',
              quantity: item.quantity,
              price: item.priceAtPurchase / 100,
            })),
            shippingAddress: {
              fullName: order.shippingFullName || 'Покупатель',
              address: order.shippingAddress || '',
              city: order.shippingCity || '',
              region: order.shippingRegion || '',
              postalCode: order.shippingPostalCode || '',
            },
            participatesInPromo: order.participatesInPromo,
            entryCode: order.entryCode || undefined,
            allEntryCodes: allEntryCodes.length > 0 ? allEntryCodes : undefined,
          }

          await sendOrderConfirmationEmail(emailData)
          logger.info('Order confirmation email sent', { orderNumber: order.orderNumber })
        } catch (emailError) {
          logger.error('Failed to send order confirmation email', emailError)
          // Don't fail the webhook if email fails
        }

        // Create CDEK shipment if delivery method is CDEK
        if (payment.order.shippingMethod === 'cdek') {
          try {
            await createCDEKShipment(payment.order.id)
            logger.info('CDEK shipment created', { orderId: payment.order.id })
          } catch (cdekError) {
            logger.error('CDEK shipment creation failed', { orderId: payment.order.id, error: cdekError })
            // Don't fail the webhook, order is still valid
          }
        }
        break
      }

      case 'payment.canceled': {
        const payment = await prisma.payment.findUnique({
          where: { transactionId: event.object.id }
        })

        if (payment) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: 'FAILED',
                metadata: {
                  ...(payment.metadata as object || {}),
                  yookassa_status: event.object.status,
                  canceled_at: new Date().toISOString()
                }
              }
            }),
            prisma.order.update({
              where: { id: payment.orderId },
              data: { status: 'CANCELLED' }
            })
          ])

          logger.info('Payment canceled', { paymentId: payment.id })
        }
        break
      }

      case 'refund.succeeded': {
        const paymentId = event.object.payment_id
        if (paymentId) {
          const payment = await prisma.payment.findUnique({
            where: { transactionId: paymentId },
            include: { order: true }
          })

          if (payment) {
            // Update payment status
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: 'REFUNDED',
                metadata: {
                  ...(payment.metadata as object || {}),
                  refund_id: event.object.id,
                  refund_amount: event.object.amount.value,
                  refunded_at: new Date().toISOString()
                }
              }
            })

            // Update order status and remove from promo
            await prisma.order.update({
              where: { id: payment.orderId },
              data: {
                status: 'CANCELLED',
                participatesInPromo: false, // Remove from lottery
              }
            })

            // Delete lottery entry if exists
            if (payment.order.entryCode) {
              await prisma.entry.deleteMany({
                where: { orderId: payment.orderId }
              })
              logger.info('Lottery entry cancelled due to refund', {
                orderNumber: payment.order.orderNumber,
                entryCode: payment.order.entryCode
              })
            }

            // Send Telegram notification if chat ID exists
            if (payment.order.telegramChatId) {
              const trackingNumber = payment.order.cdekTrackingNumber ||
                                    payment.order.cdekOrderUuid ||
                                    payment.order.orderNumber
              await sendRefundNotification(
                payment.order.telegramChatId,
                payment.order.orderNumber,
                trackingNumber
              )
            }

            logger.info('Refund succeeded', {
              paymentId: payment.id,
              refundId: event.object.id,
              orderNumber: payment.order.orderNumber
            })
          }
        }
        break
      }

      default:
        logger.info('YooKassa webhook: Unhandled event', { event: event.event })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('YooKassa webhook error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
