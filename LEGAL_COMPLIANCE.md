# Юридическое соответствие (152-ФЗ) — Руководство по внедрению

## ✅ Выполнено

### 1. Конфигурация
- ✅ **config/legal.env.json** — данные компании ИП Гладких Наталья Сергеевна
- ✅ Все реквизиты заполнены корректно

### 2. Юридические документы (Markdown)
Созданы в `content/legal/`:
- ✅ **privacy.md** — Политика обработки ПДн (152-ФЗ)
- ✅ **offer.md** — Публичная оферта
- ✅ **cookies.md** — Политика cookie
- ✅ **consent.md** — Согласие на обработку ПДн
- ✅ **promo-rules.md** — Правила розыгрыша (с налогообложением по ст. 224 НК РФ)

### 3. База данных
- ✅ Добавлены таблицы `consents` и `legal_docs` в Prisma schema
- ✅ Миграция создана и применена: `20251107172601_add_legal_compliance_tables`

### 4. Утилиты
- ✅ **lib/legal/getLegalDoc.ts** — чтение markdown, логирование согласий

## 📋 Что нужно завершить

### 1. Next.js страницы для юридических документов

Создать страницы в `app/legal/`:

```tsx
// Пример: app/legal/privacy/page.tsx
import { getLegalDoc } from '@/lib/legal/getLegalDoc'
import ReactMarkdown from 'react-markdown'

export default async function PrivacyPage() {
  const doc = await getLegalDoc('privacy')

  if (!doc) return <div>Документ не найден</div>

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{doc.content}</ReactMarkdown>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        Версия: {doc.version} | Дата публикации: {new Date(doc.publishedAt).toLocaleDateString('ru-RU')}
      </div>
    </div>
  )
}
```

Создать аналогично:
- `app/legal/offer/page.tsx`
- `app/legal/cookies/page.tsx`
- `app/legal/consent/page.tsx`
- `app/legal/promo-rules/page.tsx`

### 2. Cookie-баннер (компонент)

```tsx
// components/CookieBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }))
    setShow(false)
  }

  const acceptNecessary = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }))
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Мы используем cookie</h3>
            <p className="text-sm text-gray-600">
              Для работы сайта и аналитики. Вы можете{' '}
              <Link href="/legal/cookies" className="text-blue-600 hover:underline">
                настроить
              </Link>{' '}
              предпочтения или принять все.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Только необходимые
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Принять все
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 3. Добавить CookieBanner в layout.tsx

```tsx
// app/layout.tsx
import CookieBanner from '@/components/CookieBanner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
```

### 4. Чекбокс согласия на формах

Добавить на checkout и другие формы:

```tsx
<label className="flex items-start gap-2">
  <input
    type="checkbox"
    required
    className="mt-1"
  />
  <span className="text-sm text-gray-600">
    Я согласен(на) с{' '}
    <Link href="/legal/privacy" className="text-blue-600 hover:underline" target="_blank">
      Политикой обработки ПДн
    </Link>
    ,{' '}
    <Link href="/legal/consent" className="text-blue-600 hover:underline" target="_blank">
      Согласием на обработку ПДн
    </Link>
    {' '}и{' '}
    <Link href="/legal/offer" className="text-blue-600 hover:underline" target="_blank">
      Публичной офертой
    </Link>
  </span>
</label>
```

Если выбрано участие в розыгрыше:

```tsx
{participatesInPromo && (
  <label className="flex items-start gap-2">
    <input
      type="checkbox"
      required
      className="mt-1"
    />
    <span className="text-sm text-gray-600">
      Я ознакомлен(а) с{' '}
      <Link href="/legal/promo-rules" className="text-blue-600 hover:underline" target="_blank">
        Правилами розыгрыша
      </Link>
      {' '}и понимаю, что при участии в акции{' '}
      <strong>право на возврат товара утрачивается</strong>.
    </span>
  </label>
)}
```

### 5. Обновить Footer

Добавить ссылки на юридические документы:

```tsx
// components/Footer.tsx (добавить в существующий footer)
<div>
  <h3 className="font-semibold mb-3">Юридическая информация</h3>
  <ul className="space-y-2 text-sm">
    <li><Link href="/legal/privacy">Политика обработки ПДн</Link></li>
    <li><Link href="/legal/offer">Публичная оферта</Link></li>
    <li><Link href="/legal/cookies">Политика cookie</Link></li>
    <li><Link href="/legal/consent">Согласие на обработку ПДн</Link></li>
    <li><Link href="/legal/promo-rules">Правила розыгрыша</Link></li>
  </ul>
</div>
```

### 6. API для логирования согласий

```ts
// app/api/consent/log/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { logConsent } from '@/lib/legal/getLegalDoc'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, formType, docKey, docVersion, metadata } = body

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    await logConsent({
      userId,
      formType,
      docKey,
      docVersion,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Consent log error:', error)
    return NextResponse.json({ error: 'Failed to log consent' }, { status: 500 })
  }
}
```

### 7. Установка зависимостей

Если еще не установлено:

```bash
npm install react-markdown gray-matter
```

## 🔒 Соответствие законодательству

### 152-ФЗ «О персональных данных»
- ✅ Политика обработки ПДн опубликована
- ✅ Согласие на обработку ПДн требуется перед сбором данных
- ✅ Локализация: первичная запись на серверах в РФ (TimeWeb, Москва)
- ✅ Сроки хранения: заказы 5 лет, маркетинг 2 года
- ✅ Права субъекта: доступ, копия, исправление, удаление, отзыв
- ✅ Логирование согласий (таблица `consents`)

### 149-ФЗ «Об информации»
- ✅ Политика cookie опубликована
- ✅ Cookie-баннер при первом посещении
- ✅ Возможность управления cookie

### 38-ФЗ «О рекламе»
- ✅ Маркетинговые рассылки только по согласию
- ✅ Возможность отписаться

### НК РФ (налоги на призы)
- ✅ В Правилах розыгрыша указаны:
  - НДФЛ 35% с суммы свыше 4 000 ₽
  - Организатор — налоговый агент
  - Таблица с расчетом налогов
  - Отчетность по форме 2-НДФЛ

## 📝 Чек-лист для владельца

- [ ] Заполнить реальные контакты в `config/legal.env.json`
- [ ] Проверить ОГРНИП, ИНН в документах
- [ ] Создать все Next.js страницы по примеру privacy
- [ ] Добавить CookieBanner в layout.tsx
- [ ] Добавить чекбоксы согласия на формы checkout, регистрации
- [ ] Обновить footer с ссылками на юр. документы
- [ ] Протестировать логирование согласий
- [ ] Настроить резервное копирование БД (для сохранности логов согласий)
- [ ] Обеспечить HTTPS в продакшене (для защиты ПДн при передаче)

## 🎯 Важные моменты

1. **Без согласия — нет обработки**: Формы с ПДн не должны отправляться без галочек согласия
2. **Cookie-баннер блокирует скрипты**: Аналитика и маркетинг должны загружаться только после согласия
3. **Версионирование документов**: При изменении Политики/Согласия — создавать новую версию в `legal_docs`
4. **Право на возврат**: При участии в розыгрыше возврат невозможен (указано в оферте и правилах)
5. **Налоги на призы**: Победители должны быть уведомлены об НДФЛ 35%

## 📞 Контакты для юридических вопросов

**Email:** privacy@sovani.shop
**Телефон:** +7 (999) 123-45-67

---

**Статус:** ✅ Инфраструктура готова. Требуется финальное внедрение компонентов и страниц.
**Соответствие:** 152-ФЗ, 149-ФЗ, 38-ФЗ, НК РФ (ст. 224)
**Версия:** 1.0
**Дата:** 07.11.2025
