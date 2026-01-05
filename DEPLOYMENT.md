# 🚀 Инструкции по деплою SoVAni на VPS

## Оглавление
1. [Локальная разработка](#локальная-разработка)
2. [Production деплой (pm2 + nginx)](#production-деплой)
3. [Настройка ЮKassa](#настройка-юkassa)
4. [Настройка Email](#настройка-email)
5. [Мониторинг и логи](#мониторинг-и-логи)

---

## Локальная разработка

### Быстрый старт

\`\`\`bash
cd /root/fashion-shop
make setup     # install + docker + db + seed
make dev       # запуск на http://localhost:3000
\`\`\`

**Учетные записи:**
- Админ: `admin@fashion.local` / `Admin123!@#`
- Покупатель: `customer@test.local` / `Customer123!`

---

## Production деплой

### 1. Подготовка сервера

\`\`\`bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt-get install -y nginx certbot python3-certbot-nginx
\`\`\`

### 2. Клонирование проекта

\`\`\`bash
cd /root
git clone <your-repo-url> fashion-shop
cd fashion-shop
npm install
\`\`\`

### 3. Настройка .env

\`\`\`bash
cp .env.sample .env
nano .env
\`\`\`

**Обязательные изменения:**
\`\`\`env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.ru

# Сильные секреты (сгенерируйте новые!)
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# ЮKassa (получите в личном кабинете)
PAYMENT_PROVIDER=yukassa
YUKASSA_SHOP_ID=your-shop-id
YUKASSA_SECRET_KEY=your-secret-key

# Email (SMTP или Resend)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.ru
SMTP_PASS=your-smtp-password
SMTP_FROM="SoVAni <noreply@yourdomain.ru>"

# Yandex.Metrika
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
\`\`\`

### 4. БД и сборка

\`\`\`bash
# Запустить Docker контейнеры (если еще не запущены)
make docker-up

# Применить схему и засеять
make db-push
make db-seed

# Собрать production build
make build
\`\`\`

### 5. PM2

\`\`\`bash
# Скопировать конфиг
cp ecosystem.config.sample.js ecosystem.config.js

# Запустить
pm2 start ecosystem.config.js

# Сохранить список процессов
pm2 save

# Автозапуск при перезагрузке
pm2 startup
# Выполните команду, которую покажет pm2
\`\`\`

**Проверка:**
\`\`\`bash
pm2 status
pm2 logs fashion-shop
curl http://localhost:3000  # должен ответить HTML
\`\`\`

### 6. Nginx

\`\`\`bash
# Скопировать конфиг
sudo cp nginx.conf.sample /etc/nginx/sites-available/fashion-shop
sudo nano /etc/nginx/sites-available/fashion-shop
\`\`\`

**Замените:**
- \`yourdomain.ru\` → ваш домен
- Закомментируйте SSL-строки (пока нет сертификата)

\`\`\`bash
# Включить сайт
sudo ln -s /etc/nginx/sites-available/fashion-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

**Проверка:**
\`\`\`bash
curl http://yourdomain.ru
\`\`\`

### 7. SSL (Let's Encrypt)

\`\`\`bash
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru
\`\`\`

Certbot автоматически:
- Получит сертификат
- Обновит nginx.conf
- Настроит редирект HTTP → HTTPS

**Авто-обновление сертификата:**
\`\`\`bash
sudo crontab -e
# Добавить:
0 3 * * * certbot renew --quiet
\`\`\`

**Проверка:**
\`\`\`bash
curl https://yourdomain.ru
\`\`\`

---

## Настройка ЮKassa

### 1. Регистрация

1. Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru)
2. Пройдите модерацию магазина
3. В личном кабинете:
   - Создайте магазин
   - Получите `shopId` и `secretKey`

### 2. Настройка в .env

\`\`\`env
PAYMENT_PROVIDER=yukassa
YUKASSA_SHOP_ID=123456
YUKASSA_SECRET_KEY=live_xxx...
\`\`\`

### 3. Webhook URL

В личном кабинете ЮKassa укажите:

**URL уведомлений:**
\`\`\`
https://yourdomain.ru/api/payment/callback/yukassa
\`\`\`

### 4. Реализация (TODO)

Создайте файл \`app/api/payment/callback/yukassa/route.ts\`:
\`\`\`typescript
// Пример структуры (полная реализация требует интеграции с SDK)
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // 1. Проверить подпись (HMAC-SHA256)
  // 2. Найти Payment по transactionId
  // 3. Обновить статус
  // 4. Если succeeded → вызвать handleSuccessfulPayment()

  return NextResponse.json({ success: true })
}
\`\`\`

**Документация:** https://yookassa.ru/developers/using-api/webhooks

---

## Настройка Email

### Вариант 1: SMTP (Yandex Mail)

1. Создайте почтовый ящик на Яндекс.Почте
2. Включите "Пароль приложения" в настройках
3. В .env:

\`\`\`env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.ru
SMTP_PASS=your-app-password
SMTP_FROM="SoVAni <noreply@yourdomain.ru>"
\`\`\`

### Вариант 2: Resend

1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Получите API ключ
3. Настройте домен (DNS records)
4. В .env:

\`\`\`env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxx...
SMTP_FROM="SoVAni <noreply@yourdomain.ru>"
\`\`\`

### Тестирование

\`\`\`bash
# Создайте тестовый скрипт
node -e "
const { sendEmail } = require('./lib/email/send');
sendEmail({
  to: 'your@email.com',
  subject: 'Test',
  html: '<p>Hello from SoVAni!</p>'
});
"
\`\`\`

---

## Мониторинг и логи

### PM2

\`\`\`bash
pm2 status                    # Статус процессов
pm2 logs fashion-shop         # Логи (realtime)
pm2 logs fashion-shop --lines 100  # Последние 100 строк
pm2 monit                     # Мониторинг (CPU, RAM)
pm2 restart fashion-shop      # Рестарт
pm2 stop fashion-shop         # Остановка
\`\`\`

### Docker

\`\`\`bash
docker ps                         # Статус контейнеров
docker logs fashion-shop-db       # Логи PostgreSQL
docker logs fashion-shop-redis    # Логи Redis
docker stats                      # CPU/RAM usage
\`\`\`

### Nginx

\`\`\`bash
sudo tail -f /var/log/nginx/fashion-shop-access.log
sudo tail -f /var/log/nginx/fashion-shop-error.log
sudo systemctl status nginx
sudo nginx -t  # Проверка конфига
\`\`\`

### База данных

\`\`\`bash
# Подключение к PostgreSQL
docker exec -it fashion-shop-db psql -U fashion_user -d fashion_db

# Бэкап
docker exec fashion-shop-db pg_dump -U fashion_user fashion_db > backup.sql

# Восстановление
docker exec -i fashion-shop-db psql -U fashion_user -d fashion_db < backup.sql
\`\`\`

### Prisma Studio (production)

\`\`\`bash
# Временно открыть доступ
npm run db:studio
# Откроется на http://localhost:5555
# ⚠️ Не оставляйте открытым! Используйте SSH tunnel:
ssh -L 5555:localhost:5555 root@your-vps-ip
\`\`\`

---

## Обновление кода

\`\`\`bash
cd /root/fashion-shop
git pull origin main
npm install
make build
pm2 restart fashion-shop
\`\`\`

**С миграциями БД:**
\`\`\`bash
npx prisma migrate deploy  # Применить миграции
pm2 restart fashion-shop
\`\`\`

---

## Очистка кэша и пересборка

\`\`\`bash
make clean          # Очистка .next и кэшей
rm -rf node_modules
npm install
make build
pm2 restart fashion-shop
\`\`\`

---

## Безопасность

### Checklist

- ✅ Сильные `JWT_SECRET` и `SESSION_SECRET`
- ✅ HTTPS (SSL сертификат)
- ✅ Firewall (только 80, 443, 22)
- ✅ Регулярные обновления ОС (\`sudo apt update && sudo apt upgrade\`)
- ✅ Бэкапы БД (ежедневно)
- ✅ `.env` не в git (\`.gitignore\`)
- ✅ pm2 logrotate (\`pm2 install pm2-logrotate\`)
- ✅ Rate limiting (TODO: добавить middleware)

### Firewall (UFW)

\`\`\`bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
sudo ufw status
\`\`\`

---

## Troubleshooting

### Проблема: 502 Bad Gateway

**Причины:**
- pm2 процесс не запущен
- Неверный порт в nginx.conf

**Решение:**
\`\`\`bash
pm2 status
pm2 logs fashion-shop  # Ищите ошибки
pm2 restart fashion-shop
\`\`\`

### Проблема: БД недоступна

**Причины:**
- Docker контейнер остановлен
- Неверный DATABASE_URL

**Решение:**
\`\`\`bash
docker ps  # Проверьте fashion-shop-db
docker start fashion-shop-db
# Проверьте .env DATABASE_URL
\`\`\`

### Проблема: ЮKassa callback не приходит

**Причины:**
- Неверный webhook URL
- HTTPS не настроен
- Endpoint не реализован

**Решение:**
1. Проверьте URL в личном кабинете ЮKassa
2. Убедитесь, что \`https://yourdomain.ru/api/payment/callback/yukassa\` доступен
3. Проверьте логи: \`pm2 logs | grep payment\`

---

## Контакты для поддержки

- GitHub Issues: (ваш репозиторий)
- Email: support@yourdomain.ru

---

**Успешного деплоя! 🚀**
