import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'
import { logger } from '@/lib/utils/logger'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/security/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      request.ip ||
                      'unknown'

    // Rate limit: 3 contact form submissions per hour per IP
    const rateLimit = checkRateLimit(ipAddress, {
      maxRequests: 3,
      windowSeconds: 60 * 60,
    })

    const headers = getRateLimitHeaders(rateLimit)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Слишком много попыток. Попробуйте позже.' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const { name, phone, message } = body

    // Validate input
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Заполните все поля' },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS
    const sanitizeHtml = (str: string) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')

    const safeName = sanitizeHtml(name)
    const safePhone = sanitizeHtml(phone)
    const safeMessage = sanitizeHtml(message)

    // Send email to flight_ooo@mail.ru
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #ff8534;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 8px 8px;
    }
    .field {
      margin-bottom: 15px;
    }
    .field strong {
      display: block;
      margin-bottom: 5px;
      color: #555;
    }
    .message-box {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #ff8534;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📩 Новый вопрос с сайта SoVAni</h2>
    </div>
    <div class="content">
      <div class="field">
        <strong>Имя:</strong>
        ${safeName}
      </div>
      <div class="field">
        <strong>Телефон:</strong>
        <a href="tel:${safePhone}">${safePhone}</a>
      </div>
      <div class="field">
        <strong>Вопрос:</strong>
        <div class="message-box">
          ${safeMessage.replace(/\n/g, '<br>')}
        </div>
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999; margin: 0;">
        Отправлено с формы "Остались вопросы?" на сайте www.sovani.info
      </p>
    </div>
  </div>
</body>
</html>
`

    const text = `
Новый вопрос с сайта SoVAni

Имя: ${safeName}
Телефон: ${safePhone}

Вопрос:
${safeMessage}

---
Отправлено с формы "Остались вопросы?" на сайте www.sovani.info
`

    const sent = await emailService.sendEmail({
      to: 'flight_ooo@mail.ru',
      subject: `📩 Новый вопрос от ${name}`,
      html,
      text,
    })

    if (!sent) {
      logger.error('Failed to send contact form email', { name, phone })
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение. Попробуйте позже или напишите напрямую на flight_ooo@mail.ru' },
        { status: 500 }
      )
    }

    logger.info('Contact form email sent', { name, phone })

    return NextResponse.json({
      success: true,
      message: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    }, { headers })
  } catch (error) {
    logger.error('Contact form error', error)
    return NextResponse.json(
      { error: 'Произошла ошибка. Попробуйте позже.' },
      { status: 500 }
    )
  }
}
