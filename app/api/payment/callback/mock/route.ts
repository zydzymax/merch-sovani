import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateUniqueEntryCode } from '@/lib/utils/generateUniqueEntryCode'
import { logger } from '@/lib/utils/logger'

/**
 * Mock payment webhook
 * В реальной интеграции это будет YooKassa callback
 */
export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
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

    // IDEMPOTENCY: Check if payment was already processed
    if (status === 'succeeded' && payment.status === 'SUCCEEDED') {
      logger.payment('idempotency_check', {
        paymentId,
        orderNumber: payment.order.orderNumber,
        status: 'already_processed'
      })
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
        idempotent: true
      })
    }

    if (status === 'failed' && payment.status === 'FAILED') {
      logger.payment('idempotency_check', {
        paymentId,
        orderNumber: payment.order.orderNumber,
        status: 'already_failed'
      })
      return NextResponse.json({
        success: true,
        message: 'Payment already failed',
        idempotent: true
      })
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
    logger.error('Payment callback processing failed', error, {
      paymentId: body?.paymentId,
      status: body?.status
    })
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

  // IDEMPOTENCY: Check if order was already processed
  if (order.status === 'PAID') {
    console.log(`ℹ️ Order ${order.orderNumber} already processed (idempotency check in handleSuccessfulPayment)`)
    return
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
      // Генерируем УНИКАЛЬНЫЙ код участия с проверкой коллизий
      // Поддерживает до 50k+ участников без коллизий
      const entryCode = await generateUniqueEntryCode()

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
            timestamp: new Date().toISOString(),
          },
        },
      })

      // EMAIL NOTIFICATION: Entry code for promo participation
      // Implementation required:
      // 1. Set up email service (nodemailer, sendgrid, or AWS SES)
      // 2. Create HTML email template with entry code
      // 3. Add email queue for reliability (e.g., Bull or BullMQ)
      // 4. Implement sendPromoParticipationEmail(order.email, entryCode, order)
      // Example: await emailService.sendPromoEmail({ to: order.email, entryCode, orderNumber })
      console.log(`✅ Entry code generated for order ${order.orderNumber}`)
      console.log(`   Format: TTTTTTTT-RRRR-C (Timestamp-Random-Checksum)`)

      // РЕФЕРАЛЬНАЯ ПРОГРАММА: +1 шанс для ОБОИХ
      // Проверяем есть ли реферальный код в метаданных заказа
      const metadata = order.metadata as { referralCode?: string } | null
      const referralCode = metadata?.referralCode

      if (referralCode && activeDraw && order.userId) {
        const refLink = await tx.referralLink.findUnique({
          where: { code: referralCode, isActive: true }
        })

        if (refLink) {
          // ANTIFRAUD: Check for referral fraud
          const { checkReferralFraud } = await import('@/lib/antifraud/checkReferralFraud')
          const fraudCheck = await checkReferralFraud(
            refLink.ownerId,
            order.userId,
            order.ipAddress || undefined,
            order.deviceFingerprint || undefined
          )

          // Create or update Referral record with fraud check
          await tx.referral.upsert({
            where: {
              referrerId_referredId: {
                referrerId: refLink.ownerId,
                referredId: order.userId,
              },
            },
            create: {
              referrerId: refLink.ownerId,
              referredId: order.userId,
              firstPurchaseCounted: fraudCheck.isValid,
              fraudChecked: true,
              fraudScore: fraudCheck.fraudScore,
              fraudReason: fraudCheck.fraudReasons.join(', ') || null,
              isValid: fraudCheck.isValid,
            },
            update: {
              firstPurchaseCounted: fraudCheck.isValid,
              fraudChecked: true,
              fraudScore: fraudCheck.fraudScore,
              fraudReason: fraudCheck.fraudReasons.join(', ') || null,
              isValid: fraudCheck.isValid,
            },
          })

          if (fraudCheck.isValid) {
            // +1 Entry для друга (покупателя)
            await tx.entry.create({
              data: {
                uniqueCode: await generateUniqueEntryCode(),
                userId: order.userId,
                orderId: order.id,
                drawId: activeDraw.id,
                weight: 1,
                source: 'referral',
                metadata: {
                  referralCode,
                  type: 'friend_purchase',
                  timestamp: new Date().toISOString(),
                },
              },
            })

            // +1 Entry для реферера (владельца ссылки)
            await tx.entry.create({
              data: {
                uniqueCode: await generateUniqueEntryCode(),
                userId: refLink.ownerId,
                drawId: activeDraw.id,
                weight: 1,
                source: 'referral',
                metadata: {
                  referralCode,
                  friendOrderId: order.id,
                  type: 'referrer_bonus',
                  timestamp: new Date().toISOString(),
                },
              },
            })

            // Обновить ReferralHit - отметить конверсию
            await tx.referralHit.updateMany({
              where: {
                referralLinkId: refLink.id,
                convertedOrderId: null
              },
              data: {
                convertedOrderId: order.id,
              }
            })

            console.log(`✅ Referral bonus: +1 entry for friend and +1 entry for referrer`)
          } else {
            console.warn(`⚠️ Referral fraud detected for order ${order.orderNumber}`)
            console.warn(`   Score: ${fraudCheck.fraudScore}/100`)
            console.warn(`   Reasons: ${fraudCheck.fraudReasons.join(', ')}`)
            console.warn(`   No referral bonus given.`)
          }
        }
      }
    } else {
      // Если НЕ участвует в акции — право на возврат сохраняется
      console.log(`ℹ️ Order ${order.orderNumber} does NOT participate in promo. Return right preserved.`)
    }

    // EMAIL NOTIFICATION: Order confirmation
    // Implementation required:
    // 1. Set up email service (nodemailer, sendgrid, or AWS SES)
    // 2. Create HTML email template for order confirmation
    // 3. Include order details, payment info, and delivery tracking
    // 4. Add email queue for reliability
    // 5. Implement sendOrderConfirmationEmail(order.email, order)
    // Example: await emailService.sendOrderConfirmation({ to: order.email, order, items })
  })

  console.log(`✅ Payment processed successfully for order ${order.orderNumber}`)
}
