# Development Guide

Полное руководство по разработке для Fashion Shop.

## Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск базы данных
docker-compose up -d

# 3. Миграции и seed
npx prisma db push
npm run db:seed

# 4. Запуск dev сервера
npm run dev
```

Откройте http://localhost:3000

## Структура проекта

### Ключевые директории

```
app/
├── (auth)/          # Группа маршрутов для авторизации
├── account/         # Личный кабинет
├── admin/           # Админ-панель
├── api/             # API Routes
├── catalog/         # Каталог товаров
├── cart/            # Корзина
├── checkout/        # Оформление заказа
├── draws/           # Розыгрыши
├── product/         # Страницы товаров
└── promo/           # Страница акции
```

### Важные файлы

- `app/layout.tsx` - Root layout (Header, Footer)
- `app/globals.css` - Глобальные стили
- `lib/db/prisma.ts` - Prisma client (singleton)
- `lib/auth/getUser.ts` - Получение текущего пользователя
- `lib/utils/format.ts` - Утилиты форматирования

## Работа с базой данных

### Prisma ORM

**Создание миграции:**
```bash
npx prisma migrate dev --name add_new_field
```

**Push схемы без миграции (dev):**
```bash
npx prisma db push
```

**Применение миграций (production):**
```bash
npx prisma migrate deploy
```

**Prisma Studio (GUI):**
```bash
npx prisma studio
```

### Пример запросов

**Простой SELECT:**
```typescript
import { prisma } from '@/lib/db/prisma'

const products = await prisma.product.findMany({
  where: { active: true },
  orderBy: { createdAt: 'desc' },
  take: 10
})
```

**С relations:**
```typescript
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    items: {
      include: {
        variant: {
          include: {
            product: true
          }
        }
      }
    },
    payments: true,
    entries: true
  }
})
```

**Транзакции:**
```typescript
await prisma.$transaction(async (tx) => {
  // Резервируем товар
  await tx.inventory.update({
    where: { variantId },
    data: { reserved: { increment: quantity } }
  })

  // Создаем заказ
  const order = await tx.order.create({
    data: { ...orderData }
  })

  return order
})
```

## Добавление нового функционала

### 1. Новая страница

**Создать файл:**
```bash
# app/new-page/page.tsx
```

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Новая страница',
  description: 'Описание страницы'
}

export default async function NewPage() {
  // Server Component - можно делать DB запросы напрямую
  const data = await prisma.model.findMany()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Новая страница</h1>
      {/* Контент */}
    </div>
  )
}
```

### 2. Новый API endpoint

**Создать файл:**
```bash
# app/api/new-endpoint/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUser } from '@/lib/auth/getUser'

export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации (опционально)
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ваша логика
    const data = await prisma.model.findMany()

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Валидация
  if (!body.field) {
    return NextResponse.json(
      { error: 'Field required' },
      { status: 400 }
    )
  }

  // Создание
  const created = await prisma.model.create({
    data: body
  })

  return NextResponse.json(created, { status: 201 })
}
```

### 3. Новый компонент

**Client Component:**
```typescript
'use client'

import { useState } from 'react'

interface Props {
  initialValue?: string
}

export default function MyComponent({ initialValue = '' }: Props) {
  const [value, setValue] = useState(initialValue)

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded px-4 py-2"
      />
    </div>
  )
}
```

**Server Component:**
```typescript
import { prisma } from '@/lib/db/prisma'

interface Props {
  productId: string
}

export default async function ProductDetails({ productId }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    return <div>Товар не найден</div>
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.price / 100} ₽</p>
    </div>
  )
}
```

## Работа с формами

### React Hook Form + Zod

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(8, 'Минимум 8 символов')
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      window.location.href = '/account/dashboard'
    } else {
      alert('Ошибка входа')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="border rounded px-4 py-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-4">
        <input
          {...register('password')}
          type="password"
          placeholder="Пароль"
          className="border rounded px-4 py-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-primary text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  )
}
```

## Стилизация

### Tailwind CSS

**Использование классов:**
```tsx
<div className="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-2xl font-bold text-gray-900">Заголовок</h2>
  <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
    Кнопка
  </button>
</div>
```

**Кастомные цвета в tailwind.config.ts:**
```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#9D2A43',
        secondary: '#E9DCCB',
        accent: '#B76E5C',
        dark: '#3A2421',
        light: '#FAF6F1',
      }
    }
  }
}
```

### shadcn/ui компоненты

**Установка компонента:**
```bash
npx shadcn-ui@latest add button
```

**Использование:**
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  Кнопка
</Button>
```

## Аутентификация

### Проверка авторизации (Server Component)

```typescript
import { getUser } from '@/lib/auth/getUser'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Привет, {user.name}!</div>
}
```

### Проверка роли

```typescript
const user = await getUser()

if (!user || user.role !== 'ADMIN') {
  redirect('/login')
}
```

### Client-side проверка

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientProtectedPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.id) {
          router.push('/login')
        } else {
          setUser(data)
        }
      })
  }, [router])

  if (!user) return <div>Загрузка...</div>

  return <div>Привет, {user.name}!</div>
}
```

## Работа с изображениями

### Next.js Image

```tsx
import Image from 'next/image'

<Image
  src="/images/products/hoodie-1.jpg"
  alt="Худи"
  width={500}
  height={500}
  className="rounded-lg"
  priority  // для above-the-fold изображений
/>
```

### Upload изображений (пример)

```typescript
// app/api/upload/route.ts
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json(
      { error: 'No file' },
      { status: 400 }
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const path = `./public/uploads/${filename}`

  await writeFile(path, buffer)

  return NextResponse.json({
    url: `/uploads/${filename}`
  })
}
```

## Тестирование

### Unit тесты (Jest)

```typescript
// __tests__/utils.test.ts
import { generateEntryCode, validateEntryCode } from '@/lib/utils/format'

describe('Entry Code Generation', () => {
  it('should generate valid code', () => {
    const code = generateEntryCode()
    expect(validateEntryCode(code)).toBe(true)
  })

  it('should have correct format', () => {
    const code = generateEntryCode()
    expect(code).toMatch(/^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]$/)
  })
})
```

**Запуск:**
```bash
npm run test
```

### E2E тесты (Playwright - опционально)

```typescript
// e2e/purchase-flow.spec.ts
import { test, expect } from '@playwright/test'

test('purchase with promo participation', async ({ page }) => {
  // 1. Открыть главную
  await page.goto('http://localhost:3000')

  // 2. Перейти в каталог
  await page.click('text=Каталог')

  // 3. Добавить товар в корзину
  await page.click('button:has-text("Добавить в корзину"):first')

  // 4. Перейти в корзину
  await page.click('text=Корзина')

  // 5. Оформить заказ
  await page.click('text=Оформить заказ')

  // 6. Заполнить форму
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="phone"]', '+79991234567')
  await page.fill('[name="shippingAddress"]', 'ул. Тестовая, 1')

  // 7. Поставить галочку "Участвовать в акции"
  await page.check('[name="participatesInPromo"]')

  // 8. Подтвердить
  await page.click('button:has-text("Оформить заказ")')

  // 9. Оплатить (mock)
  await page.click('button:has-text("Оплатить")')

  // 10. Проверить успех
  await expect(page.locator('text=Оплата прошла успешно')).toBeVisible()
  await expect(page.locator('text=Код участия')).toBeVisible()
})
```

## Debugging

### Логирование

```typescript
// Development
console.log('Debug:', data)

// Production (используйте Winston/Pino)
import { logger } from '@/lib/logger'

logger.info('Order created', { orderId })
logger.error('Payment failed', { error })
```

### Prisma Logging

```typescript
// lib/db/prisma.ts
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error']
})
```

### VS Code Debug

**`.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

## Performance

### Оптимизация запросов

**Плохо (N+1 problem):**
```typescript
const products = await prisma.product.findMany()

for (const product of products) {
  const inventory = await prisma.inventory.findUnique({
    where: { variantId: product.variants[0].id }
  })
}
```

**Хорошо:**
```typescript
const products = await prisma.product.findMany({
  include: {
    variants: {
      include: {
        inventory: true
      }
    }
  }
})
```

### Кеширование (Redis)

```typescript
import { redis } from '@/lib/redis/client'

export async function getCachedProducts() {
  // Проверить кеш
  const cached = await redis.get('products:featured')
  if (cached) {
    return JSON.parse(cached)
  }

  // Если нет - запросить из БД
  const products = await prisma.product.findMany({
    where: { featured: true }
  })

  // Сохранить в кеш на 1 час
  await redis.set('products:featured', JSON.stringify(products), 'EX', 3600)

  return products
}
```

### Next.js кеширование

```typescript
// Revalidate каждые 60 секунд
export const revalidate = 60

export default async function Page() {
  const data = await getData()
  return <div>{/* ... */}</div>
}
```

## Git workflow

### Ветки

```
main           - production
develop        - основная ветка разработки
feature/*      - новые фичи
bugfix/*       - исправления багов
hotfix/*       - срочные исправления для production
```

### Коммиты

```bash
git add .
git commit -m "feat: add entry code generation"
git push origin feature/entry-codes
```

**Формат коммитов:**
- `feat:` - новая фича
- `fix:` - исправление бага
- `docs:` - документация
- `style:` - форматирование
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - обновление зависимостей, конфигов

## Деплой

### Production checklist

```bash
# 1. Проверить .env
cat .env | grep NODE_ENV
# NODE_ENV=production ✓

# 2. Билд
npm run build

# 3. Миграции
npx prisma migrate deploy

# 4. Запуск с pm2
pm2 start ecosystem.config.js
pm2 save
pm2 status

# 5. Nginx
sudo nginx -t
sudo systemctl reload nginx

# 6. SSL
sudo certbot renew --dry-run
```

### Мониторинг

```bash
# Логи pm2
pm2 logs fashion-shop

# Логи nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Статус БД
docker ps | grep postgres
docker logs fashion-shop-db
```

## Полезные команды

```bash
# Prisma
npx prisma studio             # GUI для БД
npx prisma format             # Форматирование schema.prisma
npx prisma generate           # Генерация Prisma Client

# Next.js
npm run dev                   # Dev сервер
npm run build                 # Production билд
npm run start                 # Production сервер
npm run lint                  # ESLint

# Docker
docker-compose up -d          # Запуск контейнеров
docker-compose down           # Остановка
docker-compose logs -f        # Логи
docker-compose ps             # Статус

# Git
git status                    # Статус
git log --oneline -10         # Последние 10 коммитов
git diff                      # Изменения
```

## Troubleshooting

### "Prisma Client not found"

```bash
npx prisma generate
npm run build
```

### "Port 3000 already in use"

```bash
# Найти процесс
lsof -i :3000

# Убить
kill -9 {PID}
```

### "Database connection error"

```bash
# Проверить контейнер
docker ps

# Проверить .env
cat .env | grep DATABASE_URL

# Рестарт контейнера
docker-compose restart postgres
```

### "npm ERR! missing script: dev"

```bash
# Переустановить зависимости
rm -rf node_modules package-lock.json
npm install
```

## Ресурсы

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

---

**Версия:** 1.0
**Дата обновления:** 23 октября 2025
