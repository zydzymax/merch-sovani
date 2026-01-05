# Provably Fair Randomizer - Честная система розыгрышей

## Что такое Provably Fair?

**Provably Fair** - это криптографический метод, который позволяет любому человеку проверить честность розыгрыша. Система широко используется в онлайн-казино (CSGORoll, Stake.com), крипто-лотереях и NFT-розыгрышах.

## Почему это важно?

❌ **Проблема**: Обычные розыгрыши непрозрачны - никто не может проверить, был ли победитель выбран честно или "подставлен".

✅ **Решение**: Provably Fair использует криптографию для доказательства честности. Результаты можно воспроизвести и проверить математически.

## Как это работает?

### 1. ДО РОЗЫГРЫША (Подготовка)

```
📋 ПУБЛИКУЕТСЯ:
- Список всех участников и их кодов
- Client Seed (публичный, может задать любой желающий)
- SHA-256 хеш Server Seed (НО НЕ САМ Server Seed!)

🔒 СЕКРЕТНО:
- Server Seed (будет опубликован ПОСЛЕ розыгрыша)
```

### 2. ПРОВЕДЕНИЕ РОЗЫГРЫША

```typescript
// Алгоритм выбора победителя:
const hash = SHA-256(serverSeed + ":" + clientSeed + ":" + nonce)
const randomNumber = parseInt(hash.substring(0, 8), 16)
const winner = randomNumber % totalParticipants
```

**Важно**: Server Seed пока секретный! Это гарантирует, что организатор не может подобрать его задним числом.

### 3. ПОСЛЕ РОЗЫГРЫША (Публикация)

```
📢 ПУБЛИКУЕТСЯ:
- Победитель
- Server Seed (раскрывается)
- Все данные для верификации

✓ ПРОВЕРКА:
1. Проверяем SHA-256(serverSeed) == serverSeedHash (опубликованному ДО розыгрыша)
2. Повторяем алгоритм с теми же seeds
3. Сравниваем результат - победитель должен совпадать
```

## Пример использования

### Проведение розыгрыша

```typescript
import { conductDraw } from '@/lib/utils/drawRandomizer'

// Проводим розыгрыш с публичным client seed
const clientSeed = 'PUBLIC-SEED-2025-10-23' // Может задать любой желающий
const result = await conductDraw(drawId, 1, clientSeed)

// Публикуем результаты
console.log('🏆 Победитель:', result.winners[0])
console.log('🔐 Server Seed:', result.serverSeed)
console.log('🔐 Server Seed Hash:', result.serverSeedHash)
console.log('🔐 Client Seed:', result.clientSeed)
```

### Проверка честности

```typescript
import { verifyDrawResult } from '@/lib/utils/drawRandomizer'

// Любой человек может проверить результаты
const isValid = verifyDrawResult(result, entries)

if (isValid) {
  console.log('✅ Розыгрыш честный!')
} else {
  console.log('❌ Обнаружен подлог!')
}
```

## Формат результата

```typescript
{
  "drawId": "abc123",
  "drawName": "Еженедельный розыгрыш #1",
  "totalEntries": 20,
  "winners": [
    {
      "entryId": "entry_id",
      "uniqueCode": "TEST-CODE-0014",
      "userId": "user_id",
      "userName": "Участник 15",
      "userEmail": "participant15@test.com",
      "prize": {
        "name": "iPhone 17 Pro Max",
        "value": 15000000
      }
    }
  ],
  "timestamp": "2025-10-23T22:00:14.674Z",

  // PROVABLY FAIR ДАННЫЕ:
  "algorithm": "SHA256-PROVABLY-FAIR",
  "serverSeed": "3e70edf678e60fdef9dea18d853975553dfb766eeffc6977c068d292aa681e26",
  "serverSeedHash": "7f162fc7257300df122fb0787964cb6569c0174cd13d1bfde3bc104c922fd98a",
  "clientSeed": "PUBLIC-SEED-2025-10-23",
  "nonce": 1
}
```

## API Endpoints

### Проведение розыгрыша (Admin)

```bash
POST /api/admin/draw/conduct
Content-Type: application/json

{
  "drawId": "abc123",
  "numberOfWinners": 1,
  "clientSeed": "PUBLIC-SEED-2025-10-23"  // опционально
}
```

### Получение результатов (Public)

```bash
GET /api/draws/{drawId}/results

# Возвращает полные результаты включая provably fair данные
```

## Тестирование

Запустите тест для демонстрации работы:

```bash
npx tsx scripts/test-provably-fair-randomizer.ts
```

Тест демонстрирует:
1. ✅ Создание розыгрыша с 20 участниками
2. ✅ Выбор победителя используя provably fair
3. ✅ Верификацию результатов
4. ✅ Воспроизводимость розыгрыша

## Преимущества

| Традиционный розыгрыш | Provably Fair |
|----------------------|---------------|
| ❌ Непрозрачный | ✅ Полностью прозрачный |
| ❌ Невозможно проверить | ✅ Можно проверить математически |
| ❌ Требует доверия | ✅ Не требует доверия (trustless) |
| ❌ Возможен подлог | ✅ Подлог невозможен |

## Технические детали

### Алгоритм хеширования

- **SHA-256** - криптографически стойкий алгоритм
- Детерминированный (один вход = один выход)
- Необратимый (невозможно восстановить вход из выхода)

### Параметры

- **Server Seed**: 256-бит случайное число (64 символа hex)
- **Client Seed**: Произвольная строка (можно задать публично)
- **Nonce**: Счетчик для генерации множества чисел из одних seeds

### Безопасность

1. Server Seed **НЕ МОЖЕТ** быть изменен после публикации хеша
2. Client Seed можно задать **ДО** розыгрыша
3. Все участники видны **ДО** розыгрыша
4. Результаты **ВОСПРОИЗВОДИМЫ** любым человеком

## Примеры использования в индустрии

- **CSGORoll** - крупнейший сайт CS:GO-рулетки
- **Stake.com** - криптовалютное казино
- **Shuffle.com** - NFT marketplace розыгрыши
- **Многие Ethereum лотереи**

## FAQ

### Можно ли "подкрутить" результаты?

**НЕТ**. После публикации хеша Server Seed, организатор не может его изменить. Любая попытка будет обнаружена при проверке.

### Что если организатор сгенерирует миллион seeds и выберет нужный?

Невозможно, потому что:
1. Client Seed публичный - организатор не контролирует его
2. Список участников фиксирован до розыгрыша
3. Изменение любого параметра изменит результат непредсказуемо

### Как участники могут проверить результаты?

1. Скопировать опубликованные данные (seeds, участники)
2. Запустить верификацию:
   ```typescript
   verifyDrawResult(result, entries)
   ```
3. Или проверить вручную:
   ```javascript
   const hash = sha256(serverSeed + ':' + clientSeed + ':' + nonce)
   const winner = parseInt(hash.substring(0, 8), 16) % totalParticipants
   ```

## Лицензия

MIT

---

**Создано для Fashion Shop** 🎁
Честные розыгрыши с математически доказуемой справедливостью
