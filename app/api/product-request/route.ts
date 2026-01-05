import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, customerName, customerPhone, size } = body

    if (!productName || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    console.log('📦 Заявка на товар:', { productId, productName, customerName, customerPhone, size, timestamp: new Date().toISOString() })

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      const message = `📦 *Заявка на товар*\n\n🛍 ${productName}\n📏 Размер: ${size || '-'}\n\n👤 ${customerName}\n📱 ${customerPhone}`
      
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramChatId, text: message, parse_mode: 'Markdown' }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
