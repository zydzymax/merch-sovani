# Fashion Shop — MVP интернет-магазина с акцией "1 покупка = 1 шанс"

Полнофункциональный MVP интернет-магазина одежды, БАДов и e-билетов с системой розыгрышей и рефералкой.

## 🎯 Основные возможности

### Для покупателей
- ✅ **Каталог товаров** с фильтрами (категория, размер, цвет, цена)
- ✅ **Карточки товаров** с вариантами, таблицей размеров, кросс-/апселлом
- ✅ **Корзина и чекаут** (гостевой + авторизованный)
- ✅ **Акция "1 покупка = 1 шанс"**:
  - Опциональный чекбокс в чекауте (по умолчанию ВЫКЛ)
  - После оплаты — персональный код участия
  - Заказ с кодом **становится невозвратным** (надлежащего качества)
- ✅ **E-билеты** с QR-кодами (3 тира привилегий)
- ✅ **Система розыгрышей** (Draw, Entry, Prize)
- ✅ **Реферальная программа** (генерация ссылок, начисление Entry)
- ✅ **Личный кабинет** (заказы, билеты, коды участия, реф-ссылка)

### Для администраторов
- ✅ **Админ-панель** (/admin):
  - CRUD товаров, вариантов, остатков
  - Просмотр заказов, статусов
  - Управление призами, розыгрышами
  - Ручная отмена entryCode (восстановление права на возврат)
  - Просмотр рефералов
  - Настройки (Setting)

### Технические фичи
- ✅ **Платежи**: ЮKassa (Яндекс.Касса) + Mock-провайдер
- ✅ **Email**: SMTP/Resend с шаблонами (заказ, билет, код участия)
- ✅ **Аналитика**: Яндекс.Метрика + server-to-server события
- ✅ **БД**: PostgreSQL + Prisma ORM
- ✅ **Кэш**: Redis (счетчики, очереди)
- ✅ **Деплой**: pm2 + nginx (reverse proxy)

---

## 📦 Технологический стек

- **Framework**: Next.js 14 (App Router, TypeScript, SSR/ISR)
- **UI**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache/Queue**: Redis 7
- **Auth**: JWT (jose) + bcryptjs
- **Payment**: ЮKassa API + Mock
- **Email**: nodemailer/Resend
- **QR**: qrcode
- **Analytics**: Яндекс.Метрика
- **Deploy**: Docker Compose, pm2, nginx

---

## 🚀 Локальный запуск (разработка)

### 1. Клонирование и установка зависимостей

\`\`\`bash
cd /root/fashion-shop
npm install
\`\`\`

### 2. Настройка окружения

Скопируйте `.env.sample` в `.env` и заполните:

\`\`\`bash
cp .env.sample .env
\`\`\`

Основные переменные:
- \`DATABASE_URL\` — строка подключения к PostgreSQL
- \`REDIS_URL\` — строка подключения к Redis
- \`JWT_SECRET\`, \`SESSION_SECRET\` — секреты для auth
- \`PAYMENT_PROVIDER\` — \`mock\` или \`yukassa\`
- \`EMAIL_PROVIDER\` — \`mock\`, \`smtp\` или \`resend\`
- \`NEXT_PUBLIC_YANDEX_METRIKA_ID\` — ID метрики
- \`ADMIN_EMAIL\`, \`ADMIN_PASSWORD\` — кредсы админа

### 3. Запуск Docker-контейнеров

\`\`\`bash
make docker-up
# или
docker-compose up -d
\`\`\`

Проверка:
\`\`\`bash
docker ps
\`\`\`

Вы должны увидеть:
- \`fashion-shop-db\` (PostgreSQL, порт 5434)
- \`fashion-shop-redis\` (Redis, порт 6381)

### 4. Миграции и seed

\`\`\`bash
make db-push      # Применить схему (для dev)
make db-seed      # Засеять демо-данными
\`\`\`

Или вручную:
\`\`\`bash
npx prisma db push
npm run db:seed
\`\`\`

**Что создаёт seed:**
- Админ: \`admin@fashion.local\` / \`Admin123!@#\`
- Тестовый покупатель: \`customer@test.local\` / \`Customer123!\`
- 6 товаров (футболка, лонгслив, худи, штаны, 2 БАД)
- 3 тира билетов (Стандарт, VIP, Premium)
- 4 приза (iPhone, сертификат, AirPods, набор одежды)
- 1 активный розыгрыш
- 1 реф-ссылка (\`TEST2025\`)
- Настройки (Setting)

### 5. Запуск dev-сервера

\`\`\`bash
make dev
# или
npm run dev
\`\`\`

Откройте [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Production деплой (pm2 + nginx)

### 1. Подготовка сервера

Установите зависимости:
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo apt-get install -y nginx certbot python3-certbot-nginx
\`\`\`

### 2. Настройка окружения

Скопируйте проект на сервер:
\`\`\`bash
git clone https://github.com/your-repo/fashion-shop.git /root/fashion-shop
cd /root/fashion-shop
npm install
cp .env.sample .env
# Заполните .env production-значениями
\`\`\`

Обязательно измените:
- \`NODE_ENV=production\`
- \`PAYMENT_PROVIDER=yukassa\` (+ заполните YUKASSA_SHOP_ID, YUKASSA_SECRET_KEY)
- \`EMAIL_PROVIDER=smtp\` или \`resend\` (+ кредсы)
- Сильные \`JWT_SECRET\` и \`SESSION_SECRET\`
- \`NEXT_PUBLIC_APP_URL=https://yourdomain.ru\`

### 3. Сборка проекта

\`\`\`bash
make build
# или
npm run build
\`\`\`

### 4. Запуск с pm2

Скопируйте конфиг pm2:
\`\`\`bash
cp ecosystem.config.sample.js ecosystem.config.js
# Отредактируйте пути при необходимости
\`\`\`

Запустите:
\`\`\`bash
make deploy
# или
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # следуйте инструкциям для автозапуска
\`\`\`

Проверка:
\`\`\`bash
pm2 status
pm2 logs fashion-shop
\`\`\`

### 5. Настройка nginx

Скопируйте конфиг nginx:
\`\`\`bash
sudo cp nginx.conf.sample /etc/nginx/sites-available/fashion-shop
\`\`\`

Отредактируйте файл:
\`\`\`bash
sudo nano /etc/nginx/sites-available/fashion-shop
\`\`\`

Замените:
- \`yourdomain.ru\` → ваш домен
- Укажите пути к SSL-сертификатам (см. шаг 6)

Включите сайт:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/fashion-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### 6. SSL-сертификат (Let's Encrypt)

\`\`\`bash
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru
\`\`\`

Certbot автоматически обновит конфиг nginx с путями к сертификатам.

### 7. Проверка

Откройте \`https://yourdomain.ru\` в браузере.

---

## 🛠️ Makefile команды

\`\`\`bash
make help            # Справка по командам
make install         # Установка зависимостей
make dev             # Запуск dev-сервера
make build           # Сборка production
make start           # Запуск production (Node)
make deploy          # Деплой в pm2
make db-migrate      # Миграции (dev)
make db-push         # Push схемы (dev, без миграций)
make db-seed         # Засеять БД
make db-studio       # Открыть Prisma Studio
make docker-up       # Запустить контейнеры
make docker-down     # Остановить контейнеры
make docker-logs     # Логи контейнеров
make lint            # ESLint
make format          # Prettier
make test            # Тесты
make clean           # Очистка кэша
make setup           # Полная установка (install + docker + db + seed)
\`\`\`

---

## 📁 Структура проекта

\`\`\`
fashion-shop/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Группа auth (login, register)
│   ├── account/             # Личный кабинет
│   ├── admin/               # Админ-панель
│   ├── api/                 # API Routes
│   ├── catalog/             # Каталог товаров
│   ├── cart/                # Корзина
│   ├── checkout/            # Чекаут
│   ├── draws/               # Розыгрыши
│   ├── legal/               # CMS-страницы (оферта, правила)
│   ├── product/             # PDP
│   ├── promo/               # Страница акции
│   ├── ref/                 # Реферальные ссылки
│   ├── tickets/             # Покупка билетов
│   ├── globals.css          # Глобальные стили
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Главная страница
│
├── components/
│   ├── admin/               # Компоненты админки
│   ├── cart/                # Компоненты корзины
│   ├── checkout/            # Компоненты чекаута
│   ├── layout/              # Header, Footer, Nav
│   ├── product/             # Карточки товаров, галереи
│   └── ui/                  # shadcn/ui компоненты
│
├── lib/
│   ├── auth/                # Сессии, JWT
│   ├── db/                  # Prisma client
│   ├── email/               # Email-сервис, шаблоны
│   ├── payments/            # YooKassa, Mock provider
│   ├── qr/                  # Генерация QR
│   ├── redis/               # Redis client
│   └── utils/               # Утилиты (форматирование, cn)
│
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   ├── seed.ts              # Seed script
│   └── migrations/          # Миграции
│
├── public/                  # Статика
├── .env.sample              # Пример .env
├── docker-compose.yml       # Docker (postgres, redis)
├── ecosystem.config.sample.js  # PM2 config
├── nginx.conf.sample        # Nginx config
├── Makefile                 # Команды
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md                # Этот файл
\`\`\`

---

## 🔑 Ключевые бизнес-логики

### Акция "1 покупка = 1 шанс"

**Флоу:**
1. Пользователь добавляет товары в корзину
2. В чекауте видит чекбокс:
   > "Хочу участвовать в акции и получить персональный код участия. Понимаю, что после получения кода возврат товара надлежащего качества невозможен."
3. Чекбокс **по умолчанию ВЫКЛЮЧЕН**
4. Если пользователь ставит галочку:
   - \`Order.participatesInPromo = true\`
   - После успешной оплаты:
     - Генерируется \`entryCode\` (уникальный код, base36 с checksum)
     - Создаётся \`Entry\` (запись участия в розыгрыше)
     - \`Order.hasReturnRight = false\` ← **возврат запрещён**
     - Отправляется email с кодом
5. Если галочка НЕ стояла:
   - \`Order.hasReturnRight = true\` ← возврат возможен
   - Entry не создаётся

**Файлы:**
- `app/checkout/page.tsx` — UI чекбокса
- `app/api/checkout/route.ts` — создание заказа, проверка чекбокса
- `app/api/payment/callback/[provider]/route.ts` — обработка webhook, генерация entryCode при успешной оплате
- `lib/utils/format.ts` — функции `generateEntryCode()`, `validateEntryCode()`

### Билеты и QR

**Флоу:**
1. \`POST /api/tickets/purchase\` → создание \`Ticket\`
2. Генерация \`qrPayload\` (ticketId + signature)
3. QR-код (PNG) через библиотеку \`qrcode\`
4. Email с вложением QR
5. На ивенте: сканирование QR → \`POST /api/tickets/validate\` → проверка подписи, статус

**Вес шансов (entryWeight):**
- Стандарт: 1 шанс
- VIP: 3 шанса
- Premium: 5 шансов

**Файлы:**
- `app/api/tickets/purchase/route.ts`
- `app/api/tickets/validate/route.ts`
- `lib/qr/generate.ts`
- `lib/email/templates/ticket.ts`

### Реферальная программа

**Флоу:**
1. Пользователь генерирует \`ReferralLink\` в ЛК
2. Делится ссылкой: \`/ref/[code]\`
3. Переход фиксируется как \`ReferralHit\` (IP, UserAgent)
4. Кука/сессия сохраняет ref-код
5. При оформлении заказа: если ref-код активен → создаётся доп. \`Entry\` для покупателя (или реферера — в зависимости от \`Setting\`)

**Файлы:**
- `app/ref/[code]/route.ts`
- `app/account/referrals/page.tsx`
- `lib/db/referrals.ts`

### Возвраты

**Логика:**
- Если \`Order.hasReturnRight === false\` → \`403 Forbidden\`
- Иначе — стандартная логика возврата (статус, возврат денег)

**API:**
\`POST /api/returns/create\` — проверяет \`hasReturnRight\`

---

## 🧪 Тестирование

### Ручная проверка

1. **Заказ без участия:**
   - Оформите заказ БЕЗ галочки
   - Оплатите (Mock)
   - Проверьте: \`hasReturnRight = true\`, \`entryCode = null\`
   - Попробуйте создать возврат → должен пройти

2. **Заказ с участием:**
   - Оформите заказ С галочкой
   - Оплатите
   - Проверьте: \`hasReturnRight = false\`, \`entryCode\` присутствует
   - Email с кодом пришёл
   - В ЛК видно код участия
   - Попробуйте создать возврат → 403 ошибка

3. **Покупка билета:**
   - \`POST /api/tickets/purchase\` (любой тир)
   - Email с QR получен
   - \`POST /api/tickets/validate\` с qrPayload → статус \`valid\`

4. **Реферальная ссылка:**
   - Зайдите по \`/ref/TEST2025\`
   - Оформите заказ
   - Проверьте: создан \`ReferralHit\`, добавлен \`Entry\`

5. **Админка:**
   - Войдите: \`admin@fashion.local\` / \`Admin123!@#\`
   - \`/admin\` — CRUD товаров, просмотр заказов
   - Найдите заказ с \`entryCode\`, попробуйте аннулировать код → \`hasReturnRight\` восстановится

### Unit-тесты

\`\`\`bash
npm run test
\`\`\`

Тесты покрывают:
- Генерацию \`entryCode\`
- Валидацию \`entryCode\`
- Логику \`hasReturnRight\`
- QR-подпись

**Файл:** \`__tests__/utils.test.ts\`

---

## 🎨 Дизайн и палитра

**Теплая fashion-палитра:**
- **Primary**: #9D2A43 (бордовый)
- **Secondary**: #E9DCCB (бежевый)
- **Accent**: #B76E5C (терракотовый)
- **Dark**: #3A2421 (темно-коричневый)
- **Light**: #FAF6F1 (светло-бежевый)

**Шрифты:**
- Заголовки: Playfair Display (serif)
- Текст: Inter (sans-serif)

**UI kit:** shadcn/ui (TailwindCSS)

---

## 📧 Email-шаблоны

1. **order_paid.html** — подтверждение заказа
2. **promo_participation.html** — код участия в акции
3. **ticket_issued.html** — билет с QR

**Путь:** \`lib/email/templates/\`

Шаблоны используют:
- \`nodemailer\` (SMTP)
- \`resend\` (API)
- Mock (dev)

Переключение через \`EMAIL_PROVIDER\` в .env.

---

## 📜 Legal-страницы

- \`/legal/offer\` — **Публичная оферта** (полный текст из ТЗ)
- \`/legal/privacy\` — Политика конфиденциальности
- \`/legal/promo-rules\` — Правила акции
- \`/legal/returns\` — Возвраты и обмен
- \`/legal/supplements\` — Информация о БАДах

Контент хранится в \`app/legal/[page]/page.tsx\` или загружается из БД (\`Setting\`).

---

## 🔐 Безопасность

- **JWT токены**: подписываются секретом \`JWT_SECRET\`
- **Пароли**: хешируются через bcryptjs (10 раундов)
- **CSRF**: Next.js Server Actions автоматически защищены
- **SQL Injection**: Prisma ORM параметризует запросы
- **XSS**: React экранирует вывод
- **HTTPS**: обязательно в production (nginx + certbot)
- **Env-переменные**: не коммитятся (.gitignore)

---

## 🚨 Troubleshooting

### Порты заняты (PostgreSQL/Redis)

Если на VPS уже работают другие сервисы на портах 5432/6379:
1. Измените порты в \`docker-compose.yml\`:
   \`\`\`yaml
   ports:
     - '5434:5432'  # для postgres
     - '6381:6379'  # для redis
   \`\`\`
2. Обновите \`DATABASE_URL\` и \`REDIS_URL\` в \`.env\`

### Prisma не видит изменения схемы

\`\`\`bash
npx prisma generate
npm run build
\`\`\`

### pm2 не стартует

\`\`\`bash
pm2 logs fashion-shop  # проверьте ошибки
pm2 delete fashion-shop
make deploy
\`\`\`

### nginx 502 Bad Gateway

- Проверьте, запущен ли pm2: \`pm2 status\`
- Проверьте порт в \`ecosystem.config.js\` (должен быть 3000)
- Проверьте \`upstream\` в nginx.conf (127.0.0.1:3000)

### ЮKassa callback не приходит

1. Убедитесь, что в личном кабинете ЮKassa указан правильный webhook URL:
   \`https://yourdomain.ru/api/payment/callback/yukassa\`
2. Проверьте логи: \`pm2 logs fashion-shop | grep payment\`

---

## 📚 Полезные ссылки

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [ЮKassa API](https://yookassa.ru/developers/api)
- [Яндекс.Метрика](https://metrika.yandex.ru)
- [pm2 Docs](https://pm2.keymetrics.io/docs)
- [nginx Docs](https://nginx.org/ru/docs/)

---

## 📝 Лицензия

Проприетарный проект. Все права защищены.

---

**Разработано с ❤️ для Fashion Shop**

\`\`\`bash
# Быстрый старт (один скрипт)
make setup && make dev
\`\`\`

Откройте [http://localhost:3000](http://localhost:3000) и начните продавать! 🚀
