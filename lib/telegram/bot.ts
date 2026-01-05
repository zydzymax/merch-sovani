/**
 * Telegram Bot Integration
 * Sends notifications to customers about their orders
 */

import { logger } from '@/lib/utils/logger'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHANNEL_LINK = process.env.TELEGRAM_CHANNEL_LINK || 'https://t.me/+NFNJFoql6xplNzRi'
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

interface SendMessageOptions {
  chatId: string | number
  text: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disableWebPagePreview?: boolean
  replyMarkup?: object
}

/**
 * Send a message via Telegram Bot API
 */
export async function sendTelegramMessage(options: SendMessageOptions): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    logger.warn('Telegram bot token not configured')
    return false
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: options.chatId,
        text: options.text,
        parse_mode: options.parseMode || 'HTML',
        disable_web_page_preview: options.disableWebPagePreview ?? true,
        reply_markup: options.replyMarkup,
      }),
    })

    const data = await response.json()

    if (!data.ok) {
      logger.error('Telegram send message failed', { error: data.description })
      return false
    }

    logger.info('Telegram message sent', { chatId: options.chatId })
    return true
  } catch (error) {
    logger.error('Telegram API error', error)
    return false
  }
}

/**
 * Send order confirmation with promo codes (lottery tickets)
 * Supports multiple codes for keychain bundles
 */
export async function sendOrderPromoCodesMessage(
  chatId: string | number,
  customerName: string,
  orderNumber: string,
  promoCodes: string[]
): Promise<boolean> {
  const codesCount = promoCodes.length

  const codesText = promoCodes.map((code) =>
    `<code>${code}</code>`
  ).join('\n')

  const message = `
🎉 <b>Спасибо за покупку, ${customerName}!</b>

📦 Заказ: <code>${orderNumber}</code>

🎫 <b>${codesCount === 1 ? 'Твой номер' : `Твои ${codesCount} номеров`} для розыгрыша:</b>
${codesText}

⭐ <b>${codesCount === 1 ? 'Это твой билет' : `Это ${codesCount} билетов`} в розыгрыш!</b>
Каждый код — шанс выиграть iPhone.

👉 <a href="${TELEGRAM_CHANNEL_LINK}">Подписывайся на канал</a> — там объявим победителя!

Удачи! 🍀
`.trim()

  return sendTelegramMessage({
    chatId,
    text: message,
    parseMode: 'HTML',
    replyMarkup: {
      inline_keyboard: [
        [{ text: '📢 Подписаться на канал', url: TELEGRAM_CHANNEL_LINK }]
      ]
    }
  })
}

/**
 * Legacy: Send order confirmation with single tracking number
 */
export async function sendOrderTrackingMessage(
  chatId: string | number,
  customerName: string,
  orderNumber: string,
  trackingNumber: string
): Promise<boolean> {
  // Use the new multi-code function with a single code
  return sendOrderPromoCodesMessage(chatId, customerName, orderNumber, [trackingNumber])
}

/**
 * Send welcome message when user starts the bot
 */
export async function sendWelcomeMessage(chatId: string | number): Promise<boolean> {
  const message = `
👋 <b>Привет!</b>

Я бот магазина GETNWIN.

Здесь ты получишь:
• Уведомления о статусе доставки
• Результаты розыгрыша iPhone

🎁 Чем больше покупок — тем больше шансов выиграть!

👉 <a href="${TELEGRAM_CHANNEL_LINK}">Подпишись на наш канал</a>
`.trim()

  return sendTelegramMessage({
    chatId,
    text: message,
    parseMode: 'HTML',
    replyMarkup: {
      inline_keyboard: [
        [{ text: '🛍 Перейти в магазин', url: 'https://getnwin.ru' }],
        [{ text: '📢 Подписаться на канал', url: TELEGRAM_CHANNEL_LINK }]
      ]
    }
  })
}

/**
 * Send welcome message with promo codes when user links order
 */
export async function sendWelcomeWithCodesMessage(
  chatId: string | number,
  customerName: string,
  orderNumber: string,
  promoCodes: string[]
): Promise<boolean> {
  const codesCount = promoCodes.length

  const codesText = promoCodes.map((code) =>
    `<code>${code}</code>`
  ).join('\n')

  const message = `
👋 <b>Привет, ${customerName}!</b>

Заказ <code>${orderNumber}</code> привязан.

🎫 <b>${codesCount === 1 ? 'Твой номер' : `Твои ${codesCount} номеров`} для розыгрыша:</b>
${codesText}

Я буду присылать уведомления о доставке и результатах розыгрыша.

👉 <a href="${TELEGRAM_CHANNEL_LINK}">Подпишись на канал</a> — там объявим победителя!

Удачи! 🍀
`.trim()

  return sendTelegramMessage({
    chatId,
    text: message,
    parseMode: 'HTML',
    replyMarkup: {
      inline_keyboard: [
        [{ text: '📢 Подписаться на канал', url: TELEGRAM_CHANNEL_LINK }]
      ]
    }
  })
}

/**
 * Send refund notification - lottery tickets cancelled
 */
export async function sendRefundNotification(
  chatId: string | number,
  orderNumber: string,
  trackingNumber: string
): Promise<boolean> {
  const message = `
⚠️ <b>Возврат оформлен</b>

Заказ <code>${orderNumber}</code> возвращён.

❌ Все коды участия для этого заказа аннулированы и не участвуют в розыгрыше.

Хочешь вернуть шанс? Сделай новую покупку!
👉 <a href="https://getnwin.ru">getnwin.ru</a>
`.trim()

  return sendTelegramMessage({
    chatId,
    text: message,
    parseMode: 'HTML',
    replyMarkup: {
      inline_keyboard: [
        [{ text: '🛍 Перейти в магазин', url: 'https://getnwin.ru' }]
      ]
    }
  })
}

/**
 * Send shipping status update
 */
export async function sendShippingUpdate(
  chatId: string | number,
  orderNumber: string,
  status: 'shipped' | 'delivered'
): Promise<boolean> {
  const statusText = status === 'shipped'
    ? '🚚 Твой заказ в пути!'
    : '✅ Заказ доставлен!'

  const message = `
${statusText}

📦 Заказ: <code>${orderNumber}</code>

${status === 'delivered' ? '🎫 Не забудь — твои коды участвуют в розыгрыше!' : 'Следи за доставкой в приложении СДЭК'}
`.trim()

  return sendTelegramMessage({
    chatId,
    text: message,
    parseMode: 'HTML',
  })
}

/**
 * Get bot info to verify token
 */
export async function getBotInfo(): Promise<{ ok: boolean; username?: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    return { ok: false }
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`)
    const data = await response.json()

    if (data.ok) {
      return { ok: true, username: data.result.username }
    }
    return { ok: false }
  } catch {
    return { ok: false }
  }
}
