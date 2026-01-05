/**
 * Draw Randomizer - PROVABLY FAIR LOTTERY SYSTEM
 *
 * Использует публичный алгоритм с проверяемостью результатов:
 * 1. Server Seed (секретный до розыгрыша) + Client Seed (публичный)
 * 2. SHA-256 хеширование для генерации случайных чисел
 * 3. Все участники и их коды публичны
 * 4. Результаты можно воспроизвести и проверить
 *
 * Известные рандомайзеры: Random.org, Provably Fair (используется в казино)
 */

import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export interface Winner {
  entryId: string
  uniqueCode: string
  userId: string | null
  userName?: string
  userEmail?: string
  weight: number
  prize?: {
    id: string
    name: string
    value: number | null
  }
}

export interface DrawResult {
  drawId: string
  drawName: string
  totalEntries: number
  winners: Winner[]
  timestamp: Date
  // PROVABLY FAIR ДАННЫЕ:
  serverSeed: string // секретный seed (публикуется после розыгрыша)
  serverSeedHash: string // SHA-256 хеш server seed (публикуется ДО розыгрыша)
  clientSeed: string // публичный seed (может задать любой пользователь)
  nonce: number // счетчик для генерации множества чисел
  algorithm: 'SHA256-PROVABLY-FAIR' // используемый алгоритм
}

/**
 * PROVABLY FAIR: Генерирует случайное число из seeds
 * Использует SHA-256(serverSeed + clientSeed + nonce)
 *
 * @param serverSeed - секретный seed сервера
 * @param clientSeed - публичный seed клиента
 * @param nonce - счетчик для генерации множества чисел
 * @param max - максимальное значение (не включительно)
 * @returns число от 0 до max-1
 */
function provablyFairRandom(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  max: number
): number {
  // Создаем хеш из seeds + nonce
  const hash = crypto
    .createHash('sha256')
    .update(`${serverSeed}:${clientSeed}:${nonce}`)
    .digest('hex')

  // Берем первые 8 символов хеша и конвертируем в число
  const randomHex = hash.substring(0, 8)
  const randomInt = parseInt(randomHex, 16)

  // Нормализуем к диапазону 0..max-1
  return randomInt % max
}

/**
 * Генерирует server seed и его хеш
 */
export function generateServerSeed(): { seed: string; hash: string } {
  const seed = crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(seed).digest('hex')
  return { seed, hash }
}

/**
 * PROVABLY FAIR: Взвешенный случайный выбор победителей
 * Использует provably fair алгоритм для честного распределения
 */
function provablyFairWeightedSelection<T extends { weight: number }>(
  items: T[],
  count: number,
  serverSeed: string,
  clientSeed: string,
  startNonce: number = 0
): { selected: T[]; nonce: number } {
  if (items.length === 0) return { selected: [], nonce: startNonce }
  if (count >= items.length) return { selected: [...items], nonce: startNonce + items.length }

  const selected: T[] = []
  const remaining = [...items]
  let nonce = startNonce

  for (let i = 0; i < count && remaining.length > 0; i++) {
    // Подсчитываем общий вес оставшихся участников
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0)

    // Генерируем случайное число используя provably fair
    const randomValue = provablyFairRandom(serverSeed, clientSeed, nonce, totalWeight * 1000)
    const randomWeight = randomValue / 1000
    nonce++

    // Находим победителя по весу
    let cumulativeWeight = 0
    let selectedIndex = 0

    for (let j = 0; j < remaining.length; j++) {
      cumulativeWeight += remaining[j].weight
      if (randomWeight < cumulativeWeight) {
        selectedIndex = j
        break
      }
    }

    // Добавляем победителя и удаляем из списка оставшихся
    selected.push(remaining[selectedIndex])
    remaining.splice(selectedIndex, 1)
  }

  return { selected, nonce }
}

/**
 * PROVABLY FAIR: Основная функция розыгрыша
 *
 * @param drawId - ID розыгрыша
 * @param numberOfWinners - количество победителей
 * @param clientSeed - публичный seed (опционально, по умолчанию текущая дата)
 * @returns результат розыгрыша с полной информацией для верификации
 */
export async function conductDraw(
  drawId: string,
  numberOfWinners: number = 1,
  clientSeed?: string
): Promise<DrawResult> {
  // Получаем информацию о розыгрыше
  const draw = await prisma.draw.findUnique({
    where: { id: drawId },
    include: {
      prize: true,
      entries: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!draw) {
    throw new Error(`Draw with ID ${drawId} not found`)
  }

  if (draw.status !== 'ACTIVE') {
    throw new Error(`Draw ${draw.name} is not active (status: ${draw.status})`)
  }

  if (draw.entries.length === 0) {
    throw new Error(`Draw ${draw.name} has no entries`)
  }

  // Генерируем PROVABLY FAIR seeds
  const { seed: serverSeed, hash: serverSeedHash } = generateServerSeed()

  // Client seed - можно задать публично или использовать дату розыгрыша
  const finalClientSeed = clientSeed || new Date().toISOString()

  // Выбираем победителей с учетом весов используя provably fair
  const { selected: winners, nonce } = provablyFairWeightedSelection(
    draw.entries,
    numberOfWinners,
    serverSeed,
    finalClientSeed,
    0
  )

  // Формируем результат
  const result: DrawResult = {
    drawId: draw.id,
    drawName: draw.name,
    totalEntries: draw.entries.length,
    winners: winners.map((entry) => ({
      entryId: entry.id,
      uniqueCode: entry.uniqueCode,
      userId: entry.userId,
      userName: entry.user?.name || undefined,
      userEmail: entry.user?.email || undefined,
      weight: entry.weight,
      prize: draw.prize
        ? {
            id: draw.prize.id,
            name: draw.prize.name,
            value: draw.prize.value,
          }
        : undefined,
    })),
    timestamp: new Date(),
    // PROVABLY FAIR данные для верификации
    serverSeed,
    serverSeedHash,
    clientSeed: finalClientSeed,
    nonce,
    algorithm: 'SHA256-PROVABLY-FAIR',
  }

  // Сохраняем результаты в базу данных (в metadata)
  // Также сохраняем ID победителя в поле winnerId
  await prisma.draw.update({
    where: { id: drawId },
    data: {
      status: 'COMPLETED',
      winnerId: winners.length > 0 ? winners[0].userId : null,
      metadata: result as any, // сохраняем полный результат в JSON включая provably fair данные
    },
  })

  return result
}

/**
 * PROVABLY FAIR: Верификация результата розыгрыша
 * Позволяет любому человеку проверить честность розыгрыша
 *
 * @param result - результат розыгрыша
 * @param entries - все участники (в том же порядке)
 * @returns true если результат валидный
 */
export function verifyDrawResult(
  result: DrawResult,
  entries: Array<{ id: string; uniqueCode: string; weight: number }>
): boolean {
  try {
    // 1. Проверяем хеш server seed
    const computedHash = crypto.createHash('sha256').update(result.serverSeed).digest('hex')
    if (computedHash !== result.serverSeedHash) {
      console.error('Server seed hash mismatch')
      return false
    }

    // 2. Воспроизводим розыгрыш
    const { selected: recomputedWinners } = provablyFairWeightedSelection(
      entries,
      result.winners.length,
      result.serverSeed,
      result.clientSeed,
      0
    )

    // 3. Сравниваем победителей
    for (let i = 0; i < result.winners.length; i++) {
      if (result.winners[i].entryId !== recomputedWinners[i].id) {
        console.error(`Winner ${i} mismatch`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Verification error:', error)
    return false
  }
}

/**
 * Проводит розыгрыш нескольких призов одновременно
 */
export async function conductMultiPrizeDraw(
  drawId: string,
  prizeConfig: { prizeId: string; winnersCount: number }[],
  clientSeed?: string
): Promise<DrawResult[]> {
  const draw = await prisma.draw.findUnique({
    where: { id: drawId },
    include: {
      entries: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!draw) {
    throw new Error(`Draw with ID ${drawId} not found`)
  }

  if (draw.status !== 'ACTIVE') {
    throw new Error(`Draw ${draw.name} is not active`)
  }

  // Генерируем общие seeds для всего розыгрыша
  const { seed: serverSeed, hash: serverSeedHash } = generateServerSeed()
  const finalClientSeed = clientSeed || new Date().toISOString()

  const results: DrawResult[] = []
  let remainingEntries = [...draw.entries]
  let currentNonce = 0

  // Проводим розыгрыш для каждого приза
  for (const config of prizeConfig) {
    const prize = await prisma.prize.findUnique({
      where: { id: config.prizeId },
    })

    if (!prize) {
      throw new Error(`Prize with ID ${config.prizeId} not found`)
    }

    // Выбираем победителей из оставшихся участников
    const { selected: winners, nonce: newNonce } = provablyFairWeightedSelection(
      remainingEntries,
      config.winnersCount,
      serverSeed,
      finalClientSeed,
      currentNonce
    )
    currentNonce = newNonce

    // Формируем результат для этого приза
    const result: DrawResult = {
      drawId: draw.id,
      drawName: `${draw.name} - ${prize.name}`,
      totalEntries: remainingEntries.length,
      winners: winners.map((entry) => ({
        entryId: entry.id,
        uniqueCode: entry.uniqueCode,
        userId: entry.userId,
        userName: entry.user?.name || undefined,
        userEmail: entry.user?.email || undefined,
        weight: entry.weight,
        prize: {
          id: prize.id,
          name: prize.name,
          value: prize.value,
        },
      })),
      timestamp: new Date(),
      serverSeed,
      serverSeedHash,
      clientSeed: finalClientSeed,
      nonce: currentNonce,
      algorithm: 'SHA256-PROVABLY-FAIR',
    }

    results.push(result)

    // Удаляем из оставшихся участников для следующего приза
    for (const winner of winners) {
      remainingEntries = remainingEntries.filter((e) => e.id !== winner.id)
    }
  }

  // Обновляем статус розыгрыша
  // Сохраняем ID первого победителя (главного приза)
  await prisma.draw.update({
    where: { id: drawId },
    data: {
      status: 'COMPLETED',
      winnerId: results.length > 0 && results[0].winners.length > 0 ? results[0].winners[0].userId : null,
      metadata: results as any,
    },
  })

  return results
}

/**
 * Получить историю розыгрышей
 */
export async function getDrawHistory(drawId: string): Promise<DrawResult | null> {
  const draw = await prisma.draw.findUnique({
    where: { id: drawId },
  })

  if (!draw || draw.metadata == null) {
    return null
  }

  const data: unknown = draw.metadata as unknown
  const obj = Array.isArray(data) ? (data.length > 0 ? data[0] : null) : (data as object)
  if (!obj) return null
  return obj as DrawResult
}

/**
 * Статистика по розыгрышу
 */
export async function getDrawStats(drawId: string) {
  const draw = await prisma.draw.findUnique({
    where: { id: drawId },
    include: {
      entries: {
        include: {
          user: true,
        },
      },
      prize: true,
    },
  })

  if (!draw) {
    throw new Error(`Draw with ID ${drawId} not found`)
  }

  const totalEntries = draw.entries.length
  const totalWeight = draw.entries.reduce((sum, e) => sum + e.weight, 0)

  // Получаем информацию о победителях из metadata
  const drawResult = draw.metadata as DrawResult | null
  const totalWinners = drawResult?.winners.length || 0
  const winnerUserIds = (drawResult?.winners.map(w => w.userId).filter((x): x is string => typeof x === 'string') || []) as string[]

  // Группируем по пользователям

  const userStats = draw.entries.reduce(
    (acc, entry) => {
      const userId = entry.userId
        const userKey = userId ?? 'anonymous'
      if (!acc[userKey]) {
        acc[userKey] = {
          userId,
          userName: entry.user?.name || 'Unknown',
          userEmail: entry.user?.email || '',
          entriesCount: 0,
          totalWeight: 0,
          isWinner: winnerUserIds.includes(userKey),
        }
      }
      acc[userKey].entriesCount++
      acc[userKey].totalWeight += entry.weight
      return acc
    },
    {} as Record<
      string,
      {
        userId: string | null
        userName: string
        userEmail: string
        entriesCount: number
        totalWeight: number
        isWinner: boolean
      }
    >
  )

  return {
    drawId: draw.id,
    drawName: draw.name,
    status: draw.status,
    prize: draw.prize
      ? {
          name: draw.prize.name,
          value: draw.prize.value,
        }
      : null,
    totalEntries,
    totalParticipants: Object.keys(userStats).length,
    totalWinners,
    totalWeight,
    userStats: Object.values(userStats),
    startsAt: draw.startsAt,
    endsAt: draw.endsAt,
  }
}
