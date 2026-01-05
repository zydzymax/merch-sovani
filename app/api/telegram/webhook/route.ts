export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'
import { sendWelcomeMessage, sendWelcomeWithCodesMessage } from '@/lib/telegram/bot'

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
    }
    chat: {
      id: number
      type: 'private' | 'group' | 'supergroup' | 'channel'
    }
    date: number
    text?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    logger.info('Telegram webhook received', { updateId: update.update_id })

    if (!update.message?.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const firstName = update.message.from.first_name

    // Handle /start command
    if (text.startsWith('/start')) {
      const parts = text.split(' ')

      if (parts.length > 1) {
        // Deep link with order number: /start ORDER-xxxxx
        const orderNumber = parts[1]

        // Find order and update with chat ID
        const order = await prisma.order.findFirst({
          where: { orderNumber },
        })

        if (order) {
          // Save Telegram chat ID to order
          await prisma.order.update({
            where: { id: order.id },
            data: {
              telegramChatId: chatId.toString(),
            }
          })

          // Get ALL promo codes from order metadata
          const orderMetadata = order.metadata as { allEntryCodes?: string[] } | null
          const allCodes = orderMetadata?.allEntryCodes || (order.entryCode ? [order.entryCode] : [])

          // Send welcome message with all promo codes
          if (order.participatesInPromo && allCodes.length > 0) {
            await sendWelcomeWithCodesMessage(
              chatId,
              firstName,
              order.orderNumber,
              allCodes
            )
          } else {
            // No promo codes - send simple welcome
            await sendWelcomeMessage(chatId)
          }

          logger.info('Telegram linked to order', {
            orderNumber,
            chatId,
            codesCount: allCodes.length
          })
        } else {
          // Order not found, send welcome
          await sendWelcomeMessage(chatId)
        }
      } else {
        // Just /start without order number
        await sendWelcomeMessage(chatId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error('Telegram webhook error', error)
    return NextResponse.json({ ok: true }) // Always return 200 to Telegram
  }
}
