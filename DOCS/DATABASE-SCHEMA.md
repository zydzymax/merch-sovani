# Database Schema Documentation

## Обзор

Fashion Shop использует PostgreSQL с Prisma ORM. Схема состоит из 20+ таблиц, охватывающих e-commerce, розыгрыши, билеты и реферальную программу.

## Основные модели

### 👤 Users (Пользователи)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  name      String?
  phone     String?
  role      UserRole @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  addresses      Address[]
  orders         Order[]
  entries        Entry[]
  referralLinks  ReferralLink[]
  sessions       Session[]
}

enum UserRole {
  CUSTOMER
  ADMIN
}
```

**Ключевые поля:**
- `role` - CUSTOMER (по умолчанию) или ADMIN
- `deletedAt` - soft delete (null = активен)
- `password` - bcrypt хеш (10 раундов)

---

### 🛍️ Products (Товары)

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  price       Int      // в копейках
  category    String
  subcategory String?
  tags        String[] // ["новинка", "хит", "скидка"]
  images      String[] // URLs
  featured    Boolean  @default(false)
  active      Boolean  @default(true)
  sortOrder   Int      @default(0)
  metadata    Json?    // доп данные (состав, уход)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  variants Variant[]
}
```

**Категории товаров:**
- `clothing` - Одежда
- `supplements` - БАДы
- `accessories` - Аксессуары

**Важно:**
- Цена в **копейках** (2990 руб = 299000)
- `slug` - уникальный URL (автогенерация из name)
- `active` - видимость на сайте

---

### 📦 Variants (Варианты товара)

```prisma
model Variant {
  id        String   @id @default(cuid())
  productId String
  name      String   // "S", "M", "L", "XL" или цвет
  sku       String   @unique
  price     Int?     // переопределение цены (если отличается)
  active    Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  inventory Inventory?
  orderItems OrderItem[]
  cartItems CartItem[]
}
```

**SKU формат:** `PRODUCT-VARIANT` (например, `HOODIE-M`)

**Связи:**
- 1 товар → N вариантов
- 1 вариант → 1 запись в Inventory

---

### 📊 Inventory (Остатки)

```prisma
model Inventory {
  variantId String   @id
  quantity  Int      @default(0)
  reserved  Int      @default(0)  // зарезервировано в заказах
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  variant Variant @relation(fields: [variantId], references: [id], onDelete: Cascade)
}
```

**Логика:**
- `quantity` - общее количество
- `reserved` - забронировано в неоплаченных заказах
- **Доступно для продажи**: `quantity - reserved`

**При создании заказа:**
```typescript
inventory.reserved += item.quantity
```

**При оплате:**
```typescript
inventory.quantity -= item.quantity
inventory.reserved -= item.quantity
```

---

### 🛒 Orders (Заказы)

```prisma
model Order {
  id                  String      @id @default(cuid())
  orderNumber         String      @unique  // ORD-20251023-XXXX
  userId              String
  sessionId           String?     // для гостевых заказов
  email               String
  phone               String
  status              OrderStatus @default(PENDING)

  // Адрес доставки
  addressId           String?
  shippingMethod      String      @default("russian_post")
  shippingCost        Int         @default(0)
  shippingFullName    String?
  shippingAddress     String?
  shippingCity        String?
  shippingRegion      String?
  shippingPostalCode  String?
  shippingCountry     String      @default("RU")

  // Суммы (в копейках)
  subtotal            Int
  total               Int

  // ❗ КРИТИЧЕСКИЕ ПОЛЯ ДЛЯ АКЦИИ
  participatesInPromo Boolean     @default(false)
  hasReturnRight      Boolean     @default(true)
  entryCode           String?     @unique

  notes               String?     @db.Text
  metadata            Json?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  deletedAt           DateTime?

  user      User?       @relation(...)
  address   Address?    @relation(...)
  items     OrderItem[]
  payments  Payment[]
  shipments Shipment[]
  entries   Entry[]
}

enum OrderStatus {
  PENDING      // создан, ждет оплаты
  PAID         // оплачен
  PROCESSING   // в обработке
  SHIPPED      // отправлен
  DELIVERED    // доставлен
  CANCELLED    // отменен
}
```

**КРИТИЧЕСКАЯ ЛОГИКА АКЦИИ:**

1. **При создании заказа:**
   ```typescript
   if (checkboxPromo) {
     order.participatesInPromo = true
     order.hasReturnRight = true  // пока TRUE
     order.entryCode = null       // пока NULL
   }
   ```

2. **После успешной оплаты:**
   ```typescript
   if (order.participatesInPromo) {
     order.entryCode = await generateUniqueEntryCode()
     order.hasReturnRight = false  // ← ВОЗВРАТ ЗАПРЕЩЕН!

     await prisma.entry.create({
       uniqueCode: order.entryCode,
       userId: order.userId,
       orderId: order.id,
       // ...
     })
   }
   ```

3. **Попытка возврата:**
   ```typescript
   if (!order.hasReturnRight) {
     throw new Error('Возврат невозможен для заказов с участием в акции')
   }
   ```

---

### 🎟️ Entry (Коды участия)

```prisma
model Entry {
  id         String   @id @default(cuid())
  uniqueCode String   @unique
  userId     String
  orderId    String?
  drawId     String?
  weight     Int      @default(1)
  source     String?  // "order", "ticket", "referral"
  metadata   Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user  User   @relation(...)
  order Order? @relation(...)
  draw  Draw?  @relation(...)
}
```

**Формат uniqueCode:** `TTTTTTTT-RRRR-C`
- T = timestamp (8 символов base36)
- R = random (4 символа base36)
- C = checksum (1 символ)

**Пример:** `MH3YES56-EPPY-4`

**Источники Entry:**
- `order` - покупка с галочкой "Участвовать в акции"
- `ticket` - покупка билета (weight зависит от тира)
- `referral` - реферальная программа

**Weight (вес шансов):**
- Обычная покупка: 1
- Билет Стандарт: 1
- Билет VIP: 3
- Билет Premium: 5

---

### 🎲 Draw (Розыгрыши)

```prisma
model Draw {
  id          String     @id @default(cuid())
  name        String
  description String?    @db.Text
  status      DrawStatus @default(PENDING)
  startsAt    DateTime
  endsAt      DateTime
  startDate   DateTime?  // дубликат (legacy)
  endDate     DateTime?  // дубликат (legacy)
  seed        String?    // Server Seed (для Provably Fair)
  winnerId    String?    // ID победителя
  metadata    Json?      // Результаты розыгрыша
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  prize   Prize?  @relation(...)
  entries Entry[]
}

enum DrawStatus {
  PENDING    // не начат
  ACTIVE     // идет
  COMPLETED  // завершен
  CANCELLED  // отменен
}
```

**metadata содержит результаты Provably Fair:**
```json
{
  "drawId": "abc123",
  "drawName": "Еженедельный розыгрыш #1",
  "totalEntries": 20,
  "winners": [
    {
      "entryId": "...",
      "uniqueCode": "MH3YES56-EPPY-4",
      "userId": "...",
      "userName": "Иван Иванов",
      "userEmail": "ivan@example.com",
      "weight": 1,
      "prize": {
        "id": "...",
        "name": "iPhone 17 Pro Max",
        "value": 15000000
      }
    }
  ],
  "timestamp": "2025-10-23T22:00:14.674Z",
  "serverSeed": "3e70edf678e60fdef...",
  "serverSeedHash": "7f162fc7257300df...",
  "clientSeed": "PUBLIC-SEED-2025-10-23",
  "nonce": 1,
  "algorithm": "SHA256-PROVABLY-FAIR"
}
```

---

### 🏆 Prize (Призы)

```prisma
model Prize {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text
  image       String?
  value       Int?     // в копейках
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  draws Draw[]
}
```

**Призы по умолчанию (seed):**
1. iPhone 17 Pro Max - 150,000 ₽
2. Apple Watch Series 10 - 50,000 ₽
3. Nintendo Switch - 35,000 ₽
4. Автомобиль - 8,000,000 ₽

---

### 🎫 Ticket (Билеты)

```prisma
model Ticket {
  id          String       @id @default(cuid())
  userId      String
  tierId      String
  orderNumber String?
  qrPayload   String       @unique
  status      TicketStatus @default(ACTIVE)
  usedAt      DateTime?
  metadata    Json?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  user User      @relation(...)
  tier TicketTier @relation(...)
}

enum TicketStatus {
  ACTIVE
  USED
  CANCELLED
}
```

**qrPayload формат:**
```
{ticketId}:{signature}
```

**Signature:**
```typescript
const signature = sha256(ticketId + userId + SECRET_KEY)
```

---

### 🎟️ TicketTier (Тиры билетов)

```prisma
model TicketTier {
  id          String  @id @default(cuid())
  name        String
  description String? @db.Text
  price       Int     // в копейках
  entryWeight Int     @default(1)  // вес шансов в розыгрыше
  benefits    Json?   // список привилегий
  active      Boolean @default(true)
  sortOrder   Int     @default(0)

  tickets Ticket[]
}
```

**Тиры по умолчанию:**
1. **Стандарт** - 1,990 ₽ (weight: 1)
2. **VIP** - 4,990 ₽ (weight: 3)
3. **Premium** - 9,990 ₽ (weight: 5)

**benefits примеры:**
```json
["Ранний вход", "Фотозона", "Welcome drink"]
```

---

### 🔗 ReferralLink (Реферальные ссылки)

```prisma
model ReferralLink {
  id          String   @id @default(cuid())
  ownerId     String
  code        String   @unique  // TEST2025
  isActive    Boolean  @default(true)
  expiresAt   DateTime?
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner User           @relation(...)
  hits  ReferralHit[]
}
```

**Формат URL:**
```
https://fashion-shop.com/ref/TEST2025
```

---

### 📊 ReferralHit (Переходы по реф-ссылкам)

```prisma
model ReferralHit {
  id         String   @id @default(cuid())
  linkId     String
  orderId    String?  // если привело к покупке
  ip         String?
  userAgent  String?  @db.Text
  metadata   Json?
  createdAt  DateTime @default(now())

  link  ReferralLink @relation(...)
  order Order?       @relation(...)
}
```

**Логика:**
1. Переход по `/ref/TEST2025` → создается ReferralHit
2. Cookie сохраняет ref-код на 30 дней
3. При оформлении заказа создается доп. Entry для реферера или покупателя

---

### 💳 Payment (Платежи)

```prisma
model Payment {
  id            String        @id @default(cuid())
  orderId       String
  amount        Int
  currency      String        @default("RUB")
  provider      String        // "mock", "yukassa"
  transactionId String?       @unique
  status        PaymentStatus @default(PENDING)
  metadata      Json?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  order Order @relation(...)
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  CANCELLED
}
```

**Provider = "yukassa":**
- `transactionId` = ЮKassa payment ID
- `metadata` содержит полный ответ ЮKassa

**Provider = "mock":**
- Автоматически переводит в SUCCEEDED через 1 сек

---

## Связи между таблицами

```
User ──┬─── Orders ──┬─── OrderItems ─── Variants ─── Products
       │             │                                   │
       │             └─── Payments                  Inventory
       │
       ├─── Entries ─── Draw ─── Prize
       │
       ├─── Tickets ─── TicketTier
       │
       ├─── ReferralLinks ─── ReferralHits
       │
       └─── Sessions
```

## Индексы и производительность

**Критические индексы:**
```prisma
@@index([email])              // Users
@@index([slug])               // Products
@@index([sku])                // Variants
@@index([uniqueCode])         // Entry
@@index([orderNumber])        // Orders
@@index([status, startsAt])   // Draws
@@index([code])               // ReferralLinks
```

## Миграции

**Создание миграции:**
```bash
npx prisma migrate dev --name add_field_x
```

**Применение в production:**
```bash
npx prisma migrate deploy
```

**Сброс БД (dev):**
```bash
npx prisma migrate reset
```

## Seed данные

При запуске `npx prisma db seed` создаются:
- 1 админ (admin@fashion.local)
- 1 покупатель (customer@test.local)
- 7 товаров с вариантами
- 3 тира билетов
- 4 приза
- 1 активный розыгрыш
- 1 реферальная ссылка (TEST2025)

## Backup и восстановление

**Backup:**
```bash
pg_dump -U fashion_user -d fashion_shop > backup_$(date +%Y%m%d).sql
```

**Восстановление:**
```bash
psql -U fashion_user -d fashion_shop < backup_20251023.sql
```

---

**Автор:** Claude (Anthropic)
**Дата:** 23 октября 2025
