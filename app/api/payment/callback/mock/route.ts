import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateUniqueEntryCode } from '@/lib/utils/generateUniqueEntryCode'
import { getPromoCodesCountForOrder } from '@/lib/utils/getPromoCodesCount'
import { logger } from '@/lib/utils/logger'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { sendOrderPromoCodesMessage } from '@/lib/telegram/bot'

/**
 * Mock payment webhook
 */
export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    const { paymentId, status } = body

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
    }

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

    if (status === 'succeeded' && payment.status === 'SUCCEEDED') {
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
        idempotent: true
      })
    }

    if (status === 'failed' && payment.status === 'FAILED') {
      return NextResponse.json({
        success: true,
        message: 'Payment already failed',
        idempotent: true
      })
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status === 'succeeded' ? 'SUCCEEDED' : 'FAILED',
        transactionId: `MOCK-${Date.now()}`,
      },
    })

    if (status === 'succeeded') {
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
 * Обработка успешной оплаты
 * 1 брелок = 1 промокод
 * 2 брелока = 3 промокода  
 * 3 брелока = 5 промокодов
 */
async function handleSuccessfulPayment(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status === 'PAID') {
    console.log(`ℹ️ Order ${order.orderNumber} already processed`)
    return
  }

  const promoInfo = await getPromoCodesCountForOrder(orderId)
  console.log(`📦 Order ${order.orderNumber}: ${promoInfo.totalCodes} promo codes to generate`)

  let entryCodes: string[] = []

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    })

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

    if (order.participatesInPromo) {
      for (let i = 0; i < promoInfo.totalCodes; i++) {
        const code = await generateUniqueEntryCode()
        entryCodes.push(code)
      }

      const primaryEntryCode = entryCodes[0]

      await tx.order.update({
        where: { id: orderId },
        data: {
          entryCode: primaryEntryCode,
          hasReturnRight: false,
          metadata: {
            ...(order.metadata as object || {}),
            allEntryCodes: entryCodes,
            promoCodesCount: promoInfo.totalCodes,
            promoProducts: promoInfo.products,
          }
        },
      })

      const activeDraw = await tx.draw.findFirst({
        where: { status: 'ACTIVE' },
      })

      for (let i = 0; i < entryCodes.length; i++) {
        await tx.entry.create({
          data: {
            uniqueCode: entryCodes[i],
            userId: order.userId,
            orderId: order.id,
            drawId: activeDraw?.id || null,
            weight: 1,
            source: 'order',
            metadata: {
              orderNumber: order.orderNumber,
              subtotal: order.subtotal,
              codeIndex: i + 1,
              totalCodes: entryCodes.length,
              timestamp: new Date().toISOString(),
            },
          },
        })
      }

      console.log(`✅ Generated ${entryCodes.length} promo codes for order ${order.orderNumber}`)

      // Referral logic
      const metadata = order.metadata as { referralCode?: string } | null
      const referralCode = metadata?.referralCode

      if (referralCode && activeDraw && order.userId) {
        const refLink = await tx.referralLink.findUnique({
          where: { code: referralCode, isActive: true }
        })

        if (refLink) {
          const { checkReferralFraud } = await import('@/lib/antifraud/checkReferralFraud')
          const fraudCheck = await checkReferralFraud(
            refLink.ownerId,
            order.userId,
            order.ipAddress || undefined,
            order.deviceFingerprint || undefined
          )

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

            await tx.referralHit.updateMany({
              where: {
                referralLinkId: refLink.id,
                convertedOrderId: null
              },
              data: {
                convertedOrderId: order.id,
              }
            })

            console.log(`✅ Referral bonus applied`)
          }
        }
      }
    }
  })

  // Send notifications
  const orderWithItems = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  })

  if (orderWithItems) {
    const orderMetadata = orderWithItems.metadata as { allEntryCodes?: string[] } | null
    const allCodes = orderMetadata?.allEntryCodes || [orderWithItems.entryCode].filter(Boolean) as string[]

    // EMAIL: Send order confirmation
    if (orderWithItems.email) {
      const emailData = {
        orderNumber: orderWithItems.orderNumber,
        name: orderWithItems.shippingFullName || 'Покупатель',
        email: orderWithItems.email,
        total: orderWithItems.total,
        subtotal: orderWithItems.subtotal,
        shippingCost: orderWithItems.shippingCost,
        items: orderWithItems.items.map((item) => ({
          name: item.variant.product.name,
          variant: item.variant.name || 'Стандарт',
          quantity: item.quantity,
          price: item.priceAtPurchase,
        })),
        shippingAddress: {
          fullName: orderWithItems.shippingFullName || '',
          address: orderWithItems.shippingAddress || '',
          city: orderWithItems.shippingCity || '',
          region: orderWithItems.shippingRegion || '',
          postalCode: orderWithItems.shippingPostalCode || '',
        },
        participatesInPromo: orderWithItems.participatesInPromo,
        entryCode: orderWithItems.entryCode || undefined,
        allEntryCodes: allCodes,
        fiscalReceipt: undefined,
      }

      sendOrderConfirmationEmail(emailData).catch((err) => {
        logger.error('Failed to send order confirmation email', err)
      })
    }

    // TELEGRAM: Send promo codes
    if (orderWithItems.telegramChatId && orderWithItems.participatesInPromo && allCodes.length > 0) {
      sendOrderPromoCodesMessage(
        orderWithItems.telegramChatId,
        orderWithItems.shippingFullName || 'Покупатель',
        orderWithItems.orderNumber,
        allCodes
      ).catch((err) => {
        logger.error('Failed to send Telegram promo codes', err)
      })
    }
  }

  logger.info('Payment processed successfully', {
    orderNumber: order.orderNumber,
    orderId: order.id,
    participatesInPromo: order.participatesInPromo,
    promoCodesCount: promoInfo.totalCodes,
  })
}
