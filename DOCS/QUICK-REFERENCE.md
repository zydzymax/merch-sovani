# Quick Reference - Быстрая шпаргалка

## 🚀 Быстрый старт

```bash
npm install && make setup && npm run dev
```

## 📍 Основные URL

| Страница | URL | Описание |
|----------|-----|----------|
| Главная | `/` | Лендинг с промо |
| Каталог | `/catalog` | Товары |
| Товар | `/product/[slug]` | PDP |
| Корзина | `/cart` | Корзина |
| Оформление | `/checkout` | Чекаут |
| Акция | `/promo` | Правила акции |
| Розыгрыши | `/draws` | Список розыгрышей |
| Личный кабинет | `/account/dashboard` | Заказы, коды |
| Админ-панель | `/admin` | CRUD (role=ADMIN) |
| Вход | `/login` | Логин |
| Регистрация | `/register` | Signup |

## 🔑 Тестовые учетные записи

```
Админ:
Email: admin@fashion.local
Password: Admin123!@#

Покупатель:
Email: customer@test.local
Password: Customer123!
```

## 💾 База данных

### Подключение

```bash
# Development
postgresql://fashion_user:fashion_pass@localhost:5434/fashion_shop

# Production
См. .env
```

### Команды

```bash
npx prisma studio              # GUI
npx prisma db push             # Push схемы (dev)
npx prisma migrate dev         # Создать миграцию
npx prisma migrate deploy      # Применить (prod)
npx prisma db seed             # Seed данные
```

## 📊 Основные модели

| Модель | Описание | Ключевые поля |
|--------|----------|---------------|
| User | Пользователи | email, password, role |
| Product | Товары | name, price, category |
| Variant | Варианты товара | sku, productId |
| Inventory | Остатки | quantity, reserved |
| Order | Заказы | **participatesInPromo, hasReturnRight, entryCode** |
| Entry | Коды участия | uniqueCode, weight, source |
| Draw | Розыгрыши | status, metadata (Provably Fair) |
| Prize | Призы | name, value |
| Ticket | Билеты | qrPayload, status |
| ReferralLink | Реф-ссылки | code, isActive |

## ⚡ Критическая логика акции

### При создании заказа

```typescript
if (checkboxPromo) {
  order.participatesInPromo = true
  order.hasReturnRight = true  // пока TRUE
  order.entryCode = null       // пока NULL
}
```

### После оплаты (webhook)

```typescript
if (order.participatesInPromo) {
  order.entryCode = await generateUniqueEntryCode()  // MH3YES56-EPPY-4
  order.hasReturnRight = false  // ← ВОЗВРАТ ЗАПРЕЩЕН!

  await prisma.entry.create({
    uniqueCode: order.entryCode,
    userId: order.userId,
    orderId: order.id,
    weight: 1
  })
}
```

## 🎫 Формат Entry Code

```
TTTTTTTT-RRRR-C

T = Timestamp (8 chars base36)
R = Random (4 chars base36)
C = Checksum (1 char)

Пример: MH3YES56-EPPY-4
```

## 🎲 Provably Fair

### Провести розыгрыш

```typescript
import { conductDraw } from '@/lib/utils/drawRandomizer'

const result = await conductDraw(
  drawId,
  1,  // количество победителей
  'PUBLIC-SEED-2025-10-23'  // client seed (опционально)
)
```

### Проверить результаты

```typescript
import { verifyDrawResult } from '@/lib/utils/drawRandomizer'

const isValid = verifyDrawResult(result, entries)
// true = честно, false = подлог
```

## 📡 Основные API

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/api/auth/register` | POST | Регистрация |
| `/api/auth/login` | POST | Вход |
| `/api/products` | GET | Список товаров |
| `/api/cart/add` | POST | Добавить в корзину |
| `/api/checkout` | POST | Создать заказ |
| `/api/payment/create` | POST | Создать платеж |
| `/api/payment/callback/mock` | POST | Mock webhook |
| `/api/draws` | GET | Розыгрыши |
| `/api/draws/[id]/results` | GET | Результаты |
| `/api/tickets/purchase` | POST | Купить билет |
| `/api/admin/draw/conduct` | POST | Провести розыгрыш |

## 🛠️ Полезные команды

```bash
# Dev
npm run dev                    # Запуск dev сервера
npm run build                  # Production билд
npm run start                  # Production сервер

# Database
npx prisma studio              # GUI для БД
npx prisma db push             # Push схемы
npx prisma db seed             # Seed данные

# Docker
docker-compose up -d           # Запуск контейнеров
docker-compose logs -f         # Логи
docker-compose down            # Остановка

# PM2 (Production)
pm2 start ecosystem.config.js  # Запуск
pm2 logs fashion-shop          # Логи
pm2 restart fashion-shop       # Рестарт
pm2 stop fashion-shop          # Остановка
```

## 🎨 Tailwind классы

```tsx
// Контейнер
<div className="container mx-auto px-4 py-12">

// Карточка
<div className="bg-white rounded-xl shadow-sm p-6">

// Кнопка Primary
<button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">

// Кнопка Secondary
<button className="border-2 border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50">

// Grid товаров
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Форма
<input className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary">
```

## 🔐 Проверка авторизации

### Server Component

```typescript
import { getUser } from '@/lib/auth/getUser'
import { redirect } from 'next/navigation'

const user = await getUser()
if (!user) redirect('/login')
if (user.role !== 'ADMIN') redirect('/')
```

### API Route

```typescript
const user = await getUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## 📧 Email шаблоны

```typescript
import { sendEmail } from '@/lib/email/send'

// Код участия
await sendEmail({
  to: order.email,
  subject: 'Ваш код участия в акции',
  template: 'promo_participation',
  data: { entryCode, orderNumber }
})

// Билет с QR
await sendEmail({
  to: user.email,
  subject: 'Ваш билет',
  template: 'ticket_issued',
  data: { ticket, qrCode }
})
```

## 🐛 Частые проблемы

| Проблема | Решение |
|----------|---------|
| "Prisma Client not found" | `npx prisma generate && npm run build` |
| "Port 3000 in use" | `lsof -i :3000` → `kill -9 {PID}` |
| "Database connection error" | Проверить `.env` и `docker ps` |
| "npm ERR! missing script" | `rm -rf node_modules && npm install` |
| "502 Bad Gateway" (nginx) | Проверить `pm2 status` |

## 📦 Docker порты

```
PostgreSQL: 5434 → 5432
Redis:      6381 → 6379
Next.js:    3000 (без docker)
```

## 🎯 Переменные окружения

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://localhost:6379"

# Auth
JWT_SECRET="random-secret-here"
SESSION_SECRET="another-secret"

# Payment
PAYMENT_PROVIDER="mock"  # или "yukassa"
YUKASSA_SHOP_ID="..."
YUKASSA_SECRET_KEY="..."

# Email
EMAIL_PROVIDER="mock"  # или "smtp", "resend"

# Analytics
NEXT_PUBLIC_YANDEX_METRIKA_ID="12345678"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## 📁 Структура файлов

```
app/
  api/           # API Routes
  (auth)/        # Login, Register
  account/       # Личный кабинет
  admin/         # Админка
  catalog/       # Каталог
  checkout/      # Чекаут
  draws/         # Розыгрыши
  product/       # PDP

components/
  layout/        # Header, Footer
  product/       # ProductCard, etc
  ui/            # shadcn/ui

lib/
  auth/          # JWT, sessions
  db/            # Prisma client
  email/         # Отправка email
  payments/      # ЮKassa, Mock
  utils/         # format, drawRandomizer

prisma/
  schema.prisma  # DB schema
  seed.ts        # Seed script
  migrations/    # Миграции
```

## 🔗 Полезные ссылки

- [Основной README](../README.md)
- [Database Schema](./DATABASE-SCHEMA.md)
- [API Endpoints](./API-ENDPOINTS.md)
- [Development Guide](./DEVELOPMENT-GUIDE.md)
- [Provably Fair Randomizer](../PROVABLY-FAIR-RANDOMIZER.md)

---

**Версия:** 1.0
**Дата:** 23 октября 2025

**Для быстрого старта:**
```bash
make setup && npm run dev
```

Откройте http://localhost:3000 🚀
