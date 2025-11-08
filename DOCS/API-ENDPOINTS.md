# API Endpoints Documentation

Полная документация всех API endpoint'ов Fashion Shop.

## Базовый URL

```
Development: http://localhost:3000
Production:  https://yourdomain.ru
```

## Аутентификация

Все защищенные endpoint'ы требуют JWT токен в cookie `fashion_token` или header `Authorization: Bearer {token}`.

---

## 🔐 Authentication

### POST /api/auth/register

Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Иван Иванов",
  "phone": "+79991234567"
}
```

**Response 201:**
```json
{
  "success": true,
  "user": {
    "id": "cm...",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGc..."
}
```

**Errors:**
- 400: Email уже зарегистрирован
- 400: Невалидные данные

---

### POST /api/auth/login

Вход в систему.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "user": {
    "id": "cm...",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGc..."
}
```

**Errors:**
- 401: Неверный email или пароль
- 404: Пользователь не найден

---

### POST /api/auth/logout

Выход из системы.

**Response 200:**
```json
{
  "success": true
}
```

---

### GET /api/auth/me

Получить информацию о текущем пользователе.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "cm...",
  "email": "user@example.com",
  "name": "Иван Иванов",
  "phone": "+79991234567",
  "role": "CUSTOMER"
}
```

**Errors:**
- 401: Не авторизован

---

## 🛍️ Products

### GET /api/products

Получить список товаров.

**Query params:**
```
?category=clothing           // фильтр по категории
&search=худи                 // поиск
&minPrice=1000              // от (в копейках)
&maxPrice=500000            // до (в копейках)
&page=1                     // страница
&limit=12                   // товаров на страницу
&featured=true              // только featured
```

**Response 200:**
```json
{
  "products": [
    {
      "id": "cm...",
      "name": "Худи оверсайз",
      "slug": "hudi-oversize",
      "price": 399000,
      "category": "clothing",
      "images": ["/images/products/hoodie-1.jpg"],
      "featured": true,
      "variants": [
        {
          "id": "cm...",
          "name": "S",
          "sku": "HOODIE-S",
          "inventory": {
            "quantity": 10,
            "reserved": 2
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 7,
    "totalPages": 1
  }
}
```

---

### GET /api/products/[slug]

Получить товар по slug.

**Response 200:**
```json
{
  "id": "cm...",
  "name": "Худи оверсайз",
  "slug": "hudi-oversize",
  "description": "Стильное худи...",
  "price": 399000,
  "category": "clothing",
  "images": ["/images/products/hoodie-1.jpg"],
  "tags": ["новинка", "хит"],
  "variants": [
    {
      "id": "cm...",
      "name": "S",
      "sku": "HOODIE-S",
      "inventory": {
        "quantity": 10,
        "reserved": 2
      }
    }
  ],
  "metadata": {
    "composition": "100% хлопок",
    "care": "Машинная стирка 30°C"
  }
}
```

**Errors:**
- 404: Товар не найден

---

## 🛒 Cart

### GET /api/cart

Получить корзину (сессионная для гостей, привязана к user для авторизованных).

**Response 200:**
```json
{
  "items": [
    {
      "id": "cm...",
      "variantId": "cm...",
      "quantity": 2,
      "variant": {
        "id": "cm...",
        "name": "M",
        "sku": "HOODIE-M",
        "price": 399000,
        "product": {
          "name": "Худи оверсайз",
          "images": ["/images/products/hoodie-1.jpg"]
        }
      }
    }
  ],
  "subtotal": 798000
}
```

---

### POST /api/cart/add

Добавить товар в корзину.

**Request:**
```json
{
  "variantId": "cm...",
  "quantity": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "cart": {
    "items": [...],
    "subtotal": 399000
  }
}
```

**Errors:**
- 400: Недостаточно товара на складе
- 404: Вариант не найден

---

### POST /api/cart/remove

Удалить товар из корзины.

**Request:**
```json
{
  "itemId": "cm..."
}
```

**Response 200:**
```json
{
  "success": true,
  "cart": {
    "items": [],
    "subtotal": 0
  }
}
```

---

### POST /api/cart/update

Обновить количество.

**Request:**
```json
{
  "itemId": "cm...",
  "quantity": 3
}
```

**Response 200:**
```json
{
  "success": true,
  "cart": {
    "items": [...],
    "subtotal": 1197000
  }
}
```

---

### DELETE /api/cart/clear

Очистить корзину.

**Response 200:**
```json
{
  "success": true
}
```

---

## 📦 Checkout & Orders

### POST /api/checkout

Создать заказ.

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "+79991234567",
  "shippingFullName": "Иван Иванов",
  "shippingAddress": "ул. Пушкина, д. 10, кв. 5",
  "shippingCity": "Москва",
  "shippingRegion": "Московская область",
  "shippingPostalCode": "123456",
  "participatesInPromo": true,  // ❗ КРИТИЧЕСКИЙ ПАРАМЕТР
  "notes": "Позвоните перед доставкой"
}
```

**Response 201:**
```json
{
  "success": true,
  "order": {
    "id": "cm...",
    "orderNumber": "ORD-20251023-A1B2",
    "status": "PENDING",
    "total": 399000,
    "participatesInPromo": true,
    "hasReturnRight": true,  // пока TRUE (станет FALSE после оплаты)
    "entryCode": null        // пока NULL (заполнится после оплаты)
  },
  "payment": {
    "id": "cm...",
    "provider": "mock",
    "redirectUrl": "/payment/mock?payment=cm..."
  }
}
```

**Логика participatesInPromo:**
- `true` → после оплаты генерируется entryCode, hasReturnRight = false
- `false` → hasReturnRight = true, entryCode = null

**Errors:**
- 400: Корзина пуста
- 400: Недостаточно товара на складе

---

### GET /api/orders

Получить заказы текущего пользователя.

**Headers:** `Authorization: Bearer {token}`

**Query params:**
```
?status=PAID
&page=1
&limit=10
```

**Response 200:**
```json
{
  "orders": [
    {
      "id": "cm...",
      "orderNumber": "ORD-20251023-A1B2",
      "status": "PAID",
      "total": 399000,
      "participatesInPromo": true,
      "hasReturnRight": false,
      "entryCode": "MH3YES56-EPPY-4",
      "items": [
        {
          "variant": {
            "name": "M",
            "product": {
              "name": "Худи оверсайз"
            }
          },
          "quantity": 1,
          "priceAtPurchase": 399000
        }
      ],
      "createdAt": "2025-10-23T12:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

### GET /api/orders/[id]

Получить заказ по ID.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "cm...",
  "orderNumber": "ORD-20251023-A1B2",
  "status": "PAID",
  "subtotal": 399000,
  "total": 399000,
  "participatesInPromo": true,
  "hasReturnRight": false,
  "entryCode": "MH3YES56-EPPY-4",
  "shippingAddress": "ул. Пушкина, д. 10, кв. 5",
  "shippingCity": "Москва",
  "items": [...],
  "payments": [
    {
      "status": "SUCCEEDED",
      "amount": 399000
    }
  ],
  "createdAt": "2025-10-23T12:00:00Z"
}
```

**Errors:**
- 403: Не ваш заказ
- 404: Заказ не найден

---

## 💳 Payments

### POST /api/payment/create

Создать платеж (автоматически вызывается из /api/checkout).

**Request:**
```json
{
  "orderId": "cm...",
  "amount": 399000,
  "provider": "yukassa"  // или "mock"
}
```

**Response 200:**
```json
{
  "payment": {
    "id": "cm...",
    "status": "PENDING"
  },
  "redirectUrl": "https://yookassa.ru/checkout/..."
}
```

---

### POST /api/payment/callback/mock

Mock webhook (эмуляция успешной оплаты).

**Request:**
```json
{
  "paymentId": "cm...",
  "status": "succeeded"
}
```

**Response 200:**
```json
{
  "success": true
}
```

**КРИТИЧЕСКАЯ ЛОГИКА внутри webhook:**
```typescript
if (order.participatesInPromo) {
  // 1. Генерируем уникальный код
  const entryCode = await generateUniqueEntryCode()

  // 2. Обновляем заказ
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      entryCode,
      hasReturnRight: false  // ← ВОЗВРАТ ЗАПРЕЩЕН!
    }
  })

  // 3. Создаем Entry
  await prisma.entry.create({
    data: {
      uniqueCode: entryCode,
      userId: order.userId,
      orderId: order.id,
      weight: 1,
      source: 'order'
    }
  })

  // 4. Email с кодом
  await sendPromoParticipationEmail(order.email, entryCode)
}
```

---

### POST /api/payment/callback/yukassa

ЮKassa webhook.

**Headers:**
```
Content-Type: application/json
Authorization: Basic {base64(shopId:secretKey)}
```

**Request body:** [YooKassa notification format](https://yookassa.ru/developers/api#notification)

---

## 🎲 Draws (Розыгрыши)

### GET /api/draws

Получить список розыгрышей.

**Query params:**
```
?status=ACTIVE
&page=1
&limit=10
```

**Response 200:**
```json
{
  "draws": [
    {
      "id": "cm...",
      "name": "Еженедельный розыгрыш #1",
      "description": "Разыгрываем iPhone!",
      "status": "ACTIVE",
      "startsAt": "2025-10-20T00:00:00Z",
      "endsAt": "2025-10-27T23:59:59Z",
      "prize": {
        "name": "iPhone 17 Pro Max",
        "value": 15000000,
        "image": "/images/prizes/iphone.jpg"
      },
      "entriesCount": 42
    }
  ]
}
```

---

### GET /api/draws/[id]

Получить розыгрыш по ID.

**Response 200:**
```json
{
  "id": "cm...",
  "name": "Еженедельный розыгрыш #1",
  "status": "ACTIVE",
  "startsAt": "2025-10-20T00:00:00Z",
  "endsAt": "2025-10-27T23:59:59Z",
  "prize": {
    "name": "iPhone 17 Pro Max",
    "value": 15000000
  },
  "entriesCount": 42,
  "myEntriesCount": 2  // если авторизован
}
```

---

### GET /api/draws/[id]/results

Получить результаты завершенного розыгрыша.

**Response 200:**
```json
{
  "drawId": "cm...",
  "drawName": "Еженедельный розыгрыш #1",
  "totalEntries": 42,
  "winners": [
    {
      "uniqueCode": "MH3YES56-EPPY-4",
      "userName": "Иван И.",
      "prize": {
        "name": "iPhone 17 Pro Max",
        "value": 15000000
      }
    }
  ],
  "timestamp": "2025-10-27T20:00:00Z",

  // ❗ PROVABLY FAIR ДАННЫЕ
  "algorithm": "SHA256-PROVABLY-FAIR",
  "serverSeed": "3e70edf678e60fdef9dea18d853975553dfb766eeffc6977c068d292aa681e26",
  "serverSeedHash": "7f162fc7257300df122fb0787964cb6569c0174cd13d1bfde3bc104c922fd98a",
  "clientSeed": "PUBLIC-SEED-2025-10-23",
  "nonce": 1
}
```

**Примечание:** Любой желающий может проверить честность розыгрыша, воспроизведя алгоритм с теми же seeds.

---

### GET /api/draws/[id]/stats

Получить статистику розыгрыша.

**Response 200:**
```json
{
  "drawId": "cm...",
  "drawName": "Еженедельный розыгрыш #1",
  "status": "COMPLETED",
  "totalEntries": 42,
  "totalParticipants": 28,
  "totalWinners": 1,
  "totalWeight": 58,
  "userStats": [
    {
      "userId": "cm...",
      "userName": "Иван И.",
      "entriesCount": 3,
      "totalWeight": 7,
      "isWinner": true
    }
  ]
}
```

---

## 🎫 Tickets (Билеты)

### GET /api/tickets/tiers

Получить доступные тиры билетов.

**Response 200:**
```json
{
  "tiers": [
    {
      "id": "cm...",
      "name": "Стандарт",
      "description": "Базовый доступ",
      "price": 199000,
      "entryWeight": 1,
      "benefits": ["Вход на ивент", "Welcome drink"]
    },
    {
      "id": "cm...",
      "name": "VIP",
      "description": "Расширенный доступ",
      "price": 499000,
      "entryWeight": 3,
      "benefits": ["Вход на ивент", "Ранний вход", "Фотозона"]
    },
    {
      "id": "cm...",
      "name": "Premium",
      "description": "Премиум доступ",
      "price": 999000,
      "entryWeight": 5,
      "benefits": ["Все VIP", "Meet & Greet", "Сувенир"]
    }
  ]
}
```

---

### POST /api/tickets/purchase

Купить билет.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "tierId": "cm...",
  "quantity": 1
}
```

**Response 201:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": "cm...",
      "qrPayload": "{ticketId}:{signature}",
      "tier": {
        "name": "VIP",
        "entryWeight": 3
      }
    }
  ],
  "entries": [
    {
      "uniqueCode": "MH3YGF12-X7Z9-A",
      "weight": 3
    }
  ]
}
```

**Логика:**
- Создается Ticket с QR
- Создается Entry с weight = tier.entryWeight
- Отправляется email с QR-кодом

---

### POST /api/tickets/validate

Валидация билета (для сканера на входе).

**Request:**
```json
{
  "qrPayload": "{ticketId}:{signature}"
}
```

**Response 200:**
```json
{
  "valid": true,
  "ticket": {
    "id": "cm...",
    "status": "ACTIVE",
    "tier": {
      "name": "VIP"
    },
    "user": {
      "name": "Иван Иванов"
    }
  }
}
```

**Errors:**
- 400: Неверная подпись
- 404: Билет не найден
- 403: Билет уже использован

---

### POST /api/tickets/[id]/use

Отметить билет как использованный.

**Response 200:**
```json
{
  "success": true,
  "ticket": {
    "id": "cm...",
    "status": "USED",
    "usedAt": "2025-10-23T18:00:00Z"
  }
}
```

---

## 🔗 Referrals (Рефералка)

### POST /api/referrals/create

Создать реферальную ссылку.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "code": "IVAN2025",         // опционально (автогенерация)
  "expiresAt": "2025-12-31"   // опционально
}
```

**Response 201:**
```json
{
  "success": true,
  "referralLink": {
    "id": "cm...",
    "code": "IVAN2025",
    "url": "https://fashion-shop.com/ref/IVAN2025",
    "isActive": true
  }
}
```

---

### GET /api/referrals/my

Получить свои реф-ссылки и статистику.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "referralLinks": [
    {
      "id": "cm...",
      "code": "IVAN2025",
      "url": "https://fashion-shop.com/ref/IVAN2025",
      "hitsCount": 42,
      "ordersCount": 5,
      "isActive": true,
      "createdAt": "2025-10-01T00:00:00Z"
    }
  ]
}
```

---

### GET /ref/[code]

Переход по реферальной ссылке (редирект на главную с сохранением ref-кода в cookie).

**Response:** Redirect 302 → /

**Cookie:** `ref_code=IVAN2025; Max-Age=2592000` (30 дней)

---

## 🛡️ Admin (требуется role=ADMIN)

### POST /api/admin/draw/conduct

Провести розыгрыш (Provably Fair).

**Headers:** `Authorization: Bearer {token}` (role=ADMIN)

**Request:**
```json
{
  "drawId": "cm...",
  "numberOfWinners": 1,
  "clientSeed": "PUBLIC-SEED-2025-10-23"  // опционально
}
```

**Response 200:**
```json
{
  "success": true,
  "result": {
    "drawId": "cm...",
    "winners": [
      {
        "uniqueCode": "MH3YES56-EPPY-4",
        "userName": "Иван И.",
        "userEmail": "ivan@example.com",
        "prize": {
          "name": "iPhone 17 Pro Max"
        }
      }
    ],
    "serverSeed": "3e70edf678...",
    "serverSeedHash": "7f162fc7257...",
    "clientSeed": "PUBLIC-SEED-2025-10-23",
    "algorithm": "SHA256-PROVABLY-FAIR"
  }
}
```

**Errors:**
- 403: Требуется роль ADMIN
- 400: Розыгрыш уже завершен
- 404: Розыгрыш не найден

---

### GET /api/admin/orders

Получить все заказы (с фильтрами).

**Headers:** `Authorization: Bearer {token}` (role=ADMIN)

**Query params:**
```
?status=PAID
&participatesInPromo=true
&page=1
&limit=50
```

---

### POST /api/admin/orders/[id]/cancel-entry

Аннулировать entryCode (восстановить право на возврат).

**Headers:** `Authorization: Bearer {token}` (role=ADMIN)

**Response 200:**
```json
{
  "success": true,
  "order": {
    "id": "cm...",
    "entryCode": null,
    "hasReturnRight": true
  }
}
```

---

## 📊 Analytics

### POST /api/analytics/track

Отправить событие в Яндекс.Метрику (server-to-server).

**Request:**
```json
{
  "event": "purchase",
  "params": {
    "orderId": "cm...",
    "value": 399000
  }
}
```

**Response 200:**
```json
{
  "success": true
}
```

---

## ⚙️ Settings

### GET /api/settings

Получить публичные настройки сайта.

**Response 200:**
```json
{
  "siteName": "Fashion Shop",
  "siteDescription": "Модная одежда и БАДы",
  "promoActive": true,
  "contactEmail": "info@fashion-shop.com",
  "contactPhone": "+7 (999) 123-45-67"
}
```

---

## Коды ошибок

- **200** OK
- **201** Created
- **400** Bad Request
- **401** Unauthorized
- **403** Forbidden
- **404** Not Found
- **500** Internal Server Error

---

**Версия API:** 1.0
**Дата обновления:** 23 октября 2025
