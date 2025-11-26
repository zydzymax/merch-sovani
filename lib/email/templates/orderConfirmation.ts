import type { OrderConfirmationEmailData } from '../types'

export function renderOrderConfirmationEmail(data: OrderConfirmationEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #2a2a2a;">
        <div style="font-weight: 600; color: #ffffff;">${item.name}</div>
        <div style="font-size: 14px; color: #999; margin-top: 4px;">${item.variant}</div>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #2a2a2a; text-align: center; color: #cccccc;">
        ${item.quantity}
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #2a2a2a; text-align: right; color: #ffffff; font-weight: 600;">
        ${item.price.toLocaleString('ru-RU')} ₽
      </td>
    </tr>
  `
    )
    .join('')

  const fiscalReceiptHtml = data.fiscalReceipt
    ? `
    <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin: 30px 0;">
      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff;">📄 Фискальный чек</h3>
      <div style="font-size: 14px; color: #cccccc;">
        <div style="margin: 8px 0;">
          <strong>Номер чека:</strong> ${data.fiscalReceipt.receiptNumber}
        </div>
        <div style="margin: 8px 0;">
          <strong>Фискальный признак:</strong> ${data.fiscalReceipt.fiscalSign}
        </div>
        <div style="margin: 8px 0;">
          <strong>Дата:</strong> ${data.fiscalReceipt.date}
        </div>
      </div>
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #666;">
        Чек отправлен в налоговую службу в соответствии с ФЗ-54
      </p>
    </div>
  `
    : `
    <div style="background: rgba(255, 133, 52, 0.1); border: 1px solid rgba(255, 133, 52, 0.3); border-radius: 12px; padding: 20px; margin: 30px 0;">
      <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #ff8534;">📄 Фискальный чек</h3>
      <p style="margin: 0; font-size: 14px; color: #cccccc;">
        Фискальный чек будет отправлен на этот email в течение 24 часов после обработки платежа.
      </p>
    </div>
  `

  const promoEntryHtml = data.participatesInPromo && data.entryCode
    ? `
    <div style="background: linear-gradient(135deg, #ff8534 0%, #ff6b35 100%); border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center;">
      <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #ffffff;">🎉 Вы участвуете в розыгрыше!</h2>
      <p style="margin: 0 0 20px 0; font-size: 16px; color: rgba(255,255,255,0.9);">
        Ваш код участия в еженедельном розыгрыше призов:
      </p>
      <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px; margin: 0 auto; display: inline-block;">
        <div style="font-size: 32px; font-weight: 700; color: #ffffff; font-family: 'Courier New', monospace; letter-spacing: 3px;">
          ${data.entryCode}
        </div>
      </div>
      <p style="margin: 20px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">
        Сохраните этот код — он понадобится при розыгрыше!
      </p>
      <p style="margin: 15px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 600;">
        ⚠️ Важно: Товар не подлежит возврату, так как вы участвуете в акции
      </p>
    </div>
  `
    : ''

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Заказ ${data.orderNumber} подтвержден</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0a0a0a;
      color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1px;
      color: #ffffff;
    }
    .content {
      background: #1a1a1a;
      border-radius: 16px;
      padding: 40px;
      border: 1px solid #2a2a2a;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: #ffffff;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px 0;
      color: #cccccc;
    }
    table {
      width: 100%;
      margin: 20px 0;
      border-collapse: collapse;
    }
    .totals {
      margin: 30px 0;
      border-top: 2px solid #2a2a2a;
      padding-top: 20px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      font-size: 16px;
    }
    .totals-row.total {
      font-size: 20px;
      font-weight: 700;
      color: #ff8534;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #2a2a2a;
    }
    .info-box {
      background: #141414;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box h3 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #ffffff;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #2a2a2a;
      color: #666666;
      font-size: 14px;
    }
    .footer a {
      color: #ff8534;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SoVAni</div>
    </div>

    <div class="content">
      <h1>✅ Заказ подтвержден!</h1>
      <p style="font-size: 14px; color: #999;">Номер заказа: <strong style="color: #ff8534;">${data.orderNumber}</strong></p>

      <p>Здравствуйте, ${data.name}!</p>
      <p>Благодарим за покупку в <strong>SoVAni</strong>. Ваш заказ успешно оплачен и передан в обработку.</p>

      ${promoEntryHtml}

      <div class="info-box">
        <h3>📦 Состав заказа</h3>
        <table>
          <thead>
            <tr>
              <th style="text-align: left; padding-bottom: 10px; color: #999; font-weight: 600; font-size: 14px;">Товар</th>
              <th style="text-align: center; padding-bottom: 10px; color: #999; font-weight: 600; font-size: 14px;">Кол-во</th>
              <th style="text-align: right; padding-bottom: 10px; color: #999; font-weight: 600; font-size: 14px;">Цена</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span style="color: #999;">Сумма заказа:</span>
            <span style="color: #ffffff; font-weight: 600;">${data.subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div class="totals-row">
            <span style="color: #999;">Доставка:</span>
            <span style="color: #ffffff; font-weight: 600;">
              ${data.shippingCost === 0 ? 'Бесплатно' : `${data.shippingCost.toLocaleString('ru-RU')} ₽`}
            </span>
          </div>
          <div class="totals-row total">
            <span>Итого:</span>
            <span>${data.total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      <div class="info-box">
        <h3>🚚 Адрес доставки</h3>
        <div style="font-size: 14px; color: #cccccc; line-height: 1.6;">
          <strong style="color: #ffffff;">${data.shippingAddress.fullName}</strong><br>
          ${data.shippingAddress.address}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.region}<br>
          ${data.shippingAddress.postalCode}
        </div>
      </div>

      ${fiscalReceiptHtml}

      <div style="background: rgba(255, 133, 52, 0.1); border: 1px solid rgba(255, 133, 52, 0.3); border-radius: 12px; padding: 20px; margin: 30px 0;">
        <p style="margin: 0; font-size: 14px; color: #cccccc;">
          <strong style="color: #ff8534;">Что дальше?</strong><br><br>
          1. Мы упакуем ваш заказ в течение 1-2 рабочих дней<br>
          2. Отправим трек-номер на этот email<br>
          3. Доставка Почтой России занимает 5-14 дней<br>
          4. Вы получите уведомление о прибытии посылки
        </p>
      </div>

      <p style="font-size: 14px; color: #999;">
        По всем вопросам пишите нам на <a href="mailto:support@mzakriev.ru" style="color: #ff8534; text-decoration: none;">support@mzakriev.ru</a>
      </p>
    </div>

    <div class="footer">
      <p>
        <a href="${process.env.NEXT_PUBLIC_URL || 'https://mzakriev.ru'}/account">Мой аккаунт</a> •
        <a href="${process.env.NEXT_PUBLIC_URL || 'https://mzakriev.ru'}/docs/offer">Публичная оферта</a> •
        <a href="${process.env.NEXT_PUBLIC_URL || 'https://mzakriev.ru'}/docs/privacy">Политика конфиденциальности</a>
      </p>
      <p style="margin-top: 15px;">
        Это письмо было отправлено на <strong>${data.email}</strong><br>
        © 2025 SoVAni. Все права защищены.
      </p>
    </div>
  </div>
</body>
</html>
`
}

export function renderOrderConfirmationEmailText(data: OrderConfirmationEmailData): string {
  const itemsList = data.items.map((item) => `- ${item.name} (${item.variant}) x ${item.quantity} = ${item.price.toLocaleString('ru-RU')} ₽`).join('\n')

  const promoText = data.participatesInPromo && data.entryCode
    ? `

🎉 ВЫ УЧАСТВУЕТЕ В РОЗЫГРЫШЕ!

Ваш код участия: ${data.entryCode}

Сохраните этот код — он понадобится при розыгрыше!

⚠️ Важно: Товар не подлежит возврату, так как вы участвуете в акции.

`
    : ''

  return `
Заказ ${data.orderNumber} подтвержден!

Здравствуйте, ${data.name}!

Благодарим за покупку в SoVAni. Ваш заказ успешно оплачен и передан в обработку.
${promoText}
СОСТАВ ЗАКАЗА:
${itemsList}

Сумма заказа: ${data.subtotal.toLocaleString('ru-RU')} ₽
Доставка: ${data.shippingCost === 0 ? 'Бесплатно' : `${data.shippingCost.toLocaleString('ru-RU')} ₽`}
Итого: ${data.total.toLocaleString('ru-RU')} ₽

АДРЕС ДОСТАВКИ:
${data.shippingAddress.fullName}
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.region}
${data.shippingAddress.postalCode}

ЧТО ДАЛЬШЕ?
1. Мы упакуем ваш заказ в течение 1-2 рабочих дней
2. Отправим трек-номер на этот email
3. Доставка Почтой России занимает 5-14 дней
4. Вы получите уведомление о прибытии посылки

По всем вопросам пишите нам на support@mzakriev.ru

---
Перейти в личный кабинет: ${process.env.NEXT_PUBLIC_URL || 'https://mzakriev.ru'}/account

Это письмо было отправлено на ${data.email}
© 2025 SoVAni. Все права защищены.
`
}
