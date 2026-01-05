import type { RegistrationEmailData } from '../types'

export function renderRegistrationEmail(data: RegistrationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Добро пожаловать в SoVAni!</title>
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
      text-decoration: none;
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
      margin: 0 0 20px 0;
      color: #ffffff;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px 0;
      color: #cccccc;
    }
    .highlight-box {
      background: rgba(255, 133, 52, 0.1);
      border: 1px solid rgba(255, 133, 52, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    .referral-code {
      font-size: 24px;
      font-weight: 700;
      color: #ff8534;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .referral-link {
      display: inline-block;
      background: #ff8534;
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
      transition: background 0.2s;
    }
    .referral-link:hover {
      background: #ff9d5c;
    }
    .features {
      margin: 30px 0;
    }
    .feature {
      display: flex;
      align-items: start;
      margin: 15px 0;
    }
    .feature-icon {
      width: 24px;
      height: 24px;
      margin-right: 15px;
      flex-shrink: 0;
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
      <h1>🎉 Добро пожаловать, ${data.name}!</h1>

      <p>Спасибо за регистрацию в <strong>SoVAni</strong> — магазине стильной одежды и аксессуаров с розыгрышем iPhone!</p>

      ${data.password ? `
      <div class="highlight-box" style="background: rgba(52, 211, 153, 0.1); border-color: rgba(52, 211, 153, 0.3);">
        <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">Ваши данные для входа:</p>
        <p style="color: #cccccc; margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
        <p style="color: #cccccc; margin: 5px 0;"><strong>Пароль:</strong> <span style="font-family: 'Courier New', monospace; color: #34d399;">${data.password}</span></p>
        <p style="margin: 15px 0 0 0; font-size: 14px; color: #999;">Сохраните эти данные в безопасном месте</p>
      </div>
      ` : ''}

      <div class="features">
        <div class="feature">
          <div class="feature-icon">🎁</div>
          <div>
            <strong>Главный приз — iPhone</strong><br>
            <span style="color: #999;">Разыгрываем iPhone среди всех участников акции</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">👥</div>
          <div>
            <strong>Приглашайте друзей</strong><br>
            <span style="color: #999;">Получайте дополнительные шансы на победу</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">✨</div>
          <div>
            <strong>Участие при покупке</strong><br>
            <span style="color: #999;">Каждая покупка даёт вам шанс выиграть</span>
          </div>
        </div>
      </div>

      <div class="highlight-box">
        <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">Ваш реферальный код:</p>
        <div class="referral-code">${data.referralCode}</div>
        <p style="margin: 15px 0 0 0; font-size: 14px;">Поделитесь этим кодом с друзьями!</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.referralLink}" class="referral-link">
          📱 Поделиться реферальной ссылкой
        </a>
      </div>

      <p style="font-size: 14px; color: #999; margin-top: 30px;">
        <strong>Как это работает:</strong><br>
        1. Сделайте покупку и согласитесь участвовать в розыгрыше<br>
        2. Получите код участия после оплаты<br>
        3. Приглашайте друзей — получайте +1 шанс за каждую их покупку<br>
        4. Выиграйте iPhone в главном розыгрыше!
      </p>
    </div>

    <div class="footer">
      <p>
        <a href="${process.env.NEXT_PUBLIC_URL || 'https://mzakriev.ru'}">Перейти на сайт</a> •
        <a href="${process.env.NEXT_PUBLIC_URL}/docs/rules">Правила акции</a> •
        <a href="${process.env.NEXT_PUBLIC_URL}/docs/privacy">Политика конфиденциальности</a>
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

export function renderRegistrationEmailText(data: RegistrationEmailData): string {
  return `
Добро пожаловать в SoVAni, ${data.name}!

Спасибо за регистрацию в нашем магазине стильной одежды и аксессуаров с розыгрышем iPhone!

${data.password ? `
Ваши данные для входа:
Email: ${data.email}
Пароль: ${data.password}

Сохраните эти данные в безопасном месте!
` : ''}

Ваш реферальный код: ${data.referralCode}

Поделитесь этим кодом с друзьями и получайте дополнительные шансы на победу в розыгрышах!

Реферальная ссылка: ${data.referralLink}

Как это работает:
1. Сделайте покупку и согласитесь участвовать в розыгрыше
2. Получите код участия после оплаты
3. Приглашайте друзей — получайте +1 шанс за каждую их покупку
4. Выиграйте iPhone в главном розыгрыше!

Перейти на сайт: ${process.env.NEXT_PUBLIC_URL || 'https://mzakriev.ru'}

---
Это письмо было отправлено на ${data.email}
© 2025 SoVAni. Все права защищены.
`
}
