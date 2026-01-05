#!/usr/bin/env npx ts-node
/**
 * Send daily stats to admin via Telegram
 * Run via cron: 0 9,21 * * * cd /root/fashion-shop && npx ts-node scripts/sendDailyStats.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

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

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !chatId) {
    console.error('Telegram not configured')
    return false
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    const data = await response.json()
    if (!data.ok) {
      console.error('Telegram error:', data.description)
      return false
    }
    return true
  } catch (error) {
    console.error('Telegram API error:', error)
    return false
  }
}

async function getOrderStats(hoursAgo: number = 12): Promise<DailyStats> {
  const startDate = new Date()
  startDate.setHours(startDate.getHours() - hoursAgo)

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

  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.status === 'PAID').length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const refundedOrders = orders.filter(o => o.status === 'REFUNDED').length

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + o.total, 0)

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

  const ozonClicks = 0 // TODO: implement when model exists

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

function formatStatsMessage(stats: DailyStats, periodName: string): string {
  const revenueRub = (stats.totalRevenue / 100).toLocaleString('ru-RU')

  let productsText = ''
  if (stats.products.length > 0) {
    productsText = stats.products
      .map(p => `  • ${p.name}: ${p.quantity} шт (${(p.revenue / 100).toLocaleString('ru-RU')} ₽)`)
      .join('\n')
  } else {
    productsText = '  Нет оплаченных заказов'
  }

  const now = new Date()
  const timeStr = now.toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
📊 <b>Статистика ${periodName}</b>
🕐 ${timeStr} (MSK)

<b>Заказы:</b>
  📦 Всего: ${stats.totalOrders}
  ✅ Оплачено: ${stats.paidOrders}
  ⏳ Ожидают: ${stats.pendingOrders}
  ↩️ Возвраты: ${stats.refundedOrders}

<b>Выручка:</b> ${revenueRub} ₽

<b>Товары:</b>
${productsText}

<b>Ozon клики:</b> ${stats.ozonClicks}
`.trim()
}

async function main() {
  console.log('Fetching order statistics...')

  if (!TELEGRAM_ADMIN_CHAT_ID) {
    console.error('TELEGRAM_ADMIN_CHAT_ID not set in environment')
    process.exit(1)
  }

  try {
    const stats = await getOrderStats(12)
    const message = formatStatsMessage(stats, 'за 12 часов')

    console.log('Sending to Telegram...')
    const success = await sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, message)

    if (success) {
      console.log('Stats sent successfully!')
    } else {
      console.error('Failed to send stats')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
