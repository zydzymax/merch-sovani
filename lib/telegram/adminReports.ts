/**
 * Admin Reports via Telegram
 * Sends daily statistics to admin
 */

import { prisma } from '@/lib/db/prisma'
import { sendTelegramMessage } from './bot'
import { logger } from '@/lib/utils/logger'

const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''

interface DailyStats {
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  pendingOrders: number
  refundedOrders: number
  products: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  ozonClicks: number
}

/**
 * Get statistics for a given time period
 */
export async function getOrderStats(hoursAgo: number = 12): Promise<DailyStats> {
  const startDate = new Date()
  startDate.setHours(startDate.getHours() - hoursAgo)

  // Get orders in the period
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
    },
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

  // Calculate stats
  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.status === 'PAID').length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const refundedOrders = orders.filter(o => o.status === 'REFUNDED').length

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + o.total, 0)

  // Aggregate products
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>()

  for (const order of orders.filter(o => o.status === 'PAID')) {
    for (const item of order.items) {
      const productName = item.variant?.product?.name || 'Unknown'
      const existing = productMap.get(productName) || { name: productName, quantity: 0, revenue: 0 }
      existing.quantity += item.quantity
      existing.revenue += item.priceAtPurchase * item.quantity
      productMap.set(productName, existing)
    }
  }

  const products = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)

  // Get Ozon clicks - disabled until model is created
  const ozonClicks = 0

  return {
    totalOrders,
    totalRevenue,
    paidOrders,
    pendingOrders,
    refundedOrders,
    products,
    ozonClicks,
  }
}

/**
 * Send daily stats report to admin
 */
export async function sendDailyStatsReport(): Promise<void> {
  if (!TELEGRAM_ADMIN_CHAT_ID) {
    logger.warn('TELEGRAM_ADMIN_CHAT_ID not configured, skipping daily report')
    return
  }

  try {
    const stats = await getOrderStats(12)

    const productsList = stats.products
      .slice(0, 5)
      .map((p, i) => `${i + 1}. ${p.name}: ${p.quantity} шт (${(p.revenue / 100).toLocaleString('ru-RU')} ₽)`)
      .join('\n')

    const message = `📊 <b>Статистика за 12 часов</b>

📦 Заказов: ${stats.totalOrders}
✅ Оплачено: ${stats.paidOrders}
⏳ Ожидают оплаты: ${stats.pendingOrders}
↩️ Возвраты: ${stats.refundedOrders}

💰 Выручка: ${(stats.totalRevenue / 100).toLocaleString('ru-RU')} ₽

📈 <b>Топ товаров:</b>
${productsList || 'Нет данных'}

🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`

    await sendTelegramMessage({ chatId: TELEGRAM_ADMIN_CHAT_ID, text: message, parseMode: 'HTML' })
    logger.info('Daily stats report sent successfully')
  } catch (error) {
    logger.error('Failed to send daily stats report', error)
    throw error
  }
}
