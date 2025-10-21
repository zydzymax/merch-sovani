# 🚀 Быстрый старт Fashion Shop

## За 3 шага до запуска

### 1️⃣ Установка и настройка

\`\`\`bash
cd /root/fashion-shop
npm install
cp .env.sample .env
# .env уже настроен для локального запуска
\`\`\`

### 2️⃣ Запуск БД и seed

\`\`\`bash
make docker-up      # Запустить PostgreSQL:5434 и Redis:6381
make db-push        # Применить схему
make db-seed        # Засеять демо-данными
\`\`\`

### 3️⃣ Запуск dev-сервера

\`\`\`bash
make dev
# или
npm run dev
\`\`\`

Откройте **http://localhost:3000** 🎉

---

## 📋 Тестовые учетные записи

**Администратор:**
- Email: `admin@fashion.local`
- Пароль: `Admin123!@#`
- Доступ: `/admin`

**Покупатель:**
- Email: `customer@test.local`
- Пароль: `Customer123!`

---

## ✅ Что проверить

### Сценарий 1: Покупка БЕЗ участия в акции
1. Добавьте товары в корзину
2. Оформите заказ (/checkout)
3. **НЕ ставьте** галочку "Участвовать в акции"
4. Перейдите к оплате → Mock Payment → "Успешная оплата"
5. Результат:
   - ✅ Заказ оплачен
   - ✅ `hasReturnRight = true`
   - ✅ `entryCode = null`
   - ✅ Возврат РАЗРЕШЁН

### Сценарий 2: Покупка С участием в акции
1. Добавьте товары в корзину
2. Оформите заказ (/checkout)
3. **ПОСТАВЬТЕ** галочку "Участвовать в акции"
4. Прочитайте предупреждение о невозврате
5. Перейдите к оплате → Mock Payment → "Успешная оплата"
6. Результат:
   - ✅ Заказ оплачен
   - ✅ `hasReturnRight = false`
   - ✅ `entryCode` сгенерирован (10 символов)
   - ✅ Создан `Entry` в розыгрыше
   - ✅ Возврат ЗАПРЕЩЁН

### Проверка в БД

\`\`\`bash
make db-studio
# или
npx prisma studio
\`\`\`

Откроется **http://localhost:5555**

Проверьте таблицы:
- **Order** → найдите свой заказ, посмотрите `participatesInPromo`, `hasReturnRight`, `entryCode`
- **Entry** → запись с вашим `entryCode`
- **Draw** → активный розыгрыш

---

## 📁 Ключевые файлы

### Бизнес-логика акции
- `app/checkout/page.tsx:87-107` — чекбокс с предупреждением
- `app/api/checkout/route.ts:36` — сохранение `participatesInPromo`
- `app/api/payment/callback/mock/route.ts:64-95` — генерация `entryCode`, установка `hasReturnRight=false`
- `lib/utils/format.ts:34-48` — генерация кода с checksum

### Legal
- `app/legal/offer/page.tsx:68-94` — п. 7 оферты (участие и отказ от возврата)

### Данные
- `prisma/schema.prisma:183-197` — модель Order
- `prisma/seed.ts` — демо-данные

---

## 🔧 Полезные команды

\`\`\`bash
make help          # Все команды
make dev           # Dev-сервер
make build         # Production build
make db-studio     # Prisma Studio
make docker-logs   # Логи контейнеров
make lint          # ESLint
make format        # Prettier
\`\`\`

---

## 🎯 Следующие шаги

1. **Настроить ЮKassa:**
   - Получить `YUKASSA_SHOP_ID` и `YUKASSA_SECRET_KEY`
   - В `.env`: `PAYMENT_PROVIDER=yukassa`
   - Реализовать `/api/payment/callback/yukassa`

2. **Настроить Email:**
   - SMTP или Resend
   - Создать шаблоны (order_paid, promo_participation, ticket)

3. **Добавить страницы:**
   - `/catalog` — каталог с фильтрами
   - `/product/[slug]` — PDP
   - `/account` — ЛК
   - `/admin` — админка
   - `/tickets` — покупка билетов
   - `/draws` — розыгрыши

4. **Деплой на production:**
   - См. README.md раздел "Production деплой"
   - pm2 + nginx + SSL

---

## 🐛 Troubleshooting

**Порты заняты?**
→ Измените в `docker-compose.yml` и `.env`

**Prisma не видит схему?**
→ `npx prisma generate && npm run build`

**Dev-сервер не стартует?**
→ Проверьте логи: `docker-compose logs`

**БД пустая?**
→ `make db-seed`

---

**Готово! Приятной разработки! 💪**
