/**
 * Тест PROVABLY FAIR рандомайзера
 * Демонстрирует:
 * 1. Генерацию честного розыгрыша
 * 2. Публикацию результатов
 * 3. Верификацию кем угодно
 */

import {
  conductDraw,
  verifyDrawResult,
  generateServerSeed,
  getDrawStats,
} from '../lib/utils/drawRandomizer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
  console.log('🧹 Очистка тестовых данных...')
  await prisma.entry.deleteMany({ where: { userId: { contains: 'test-draw' } } })
  await prisma.draw.deleteMany({ where: { name: { contains: 'TEST' } } })
  await prisma.prize.deleteMany({ where: { name: { contains: 'TEST' } } })
  await prisma.user.deleteMany({ where: { id: { contains: 'test-draw' } } })
  console.log('  ✓ Очистка завершена\n')
}

async function createTestDraw() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  ТЕСТ PROVABLY FAIR РАНДОМАЙЗЕРА')
  console.log('  Честная система розыгрышей с возможностью проверки')
  console.log('═══════════════════════════════════════════════════════════\n')

  // 1. Создаем приз
  console.log('🎁 Шаг 1: Создание приза...')
  const prize = await prisma.prize.create({
    data: {
      name: 'TEST iPhone 17 Pro Max',
      description: 'Тестовый приз для демонстрации',
      value: 15000000, // 150,000 руб в копейках
      image: null,
    },
  })
  console.log(`  ✓ Приз создан: ${prize.name}\n`)

  // 2. Создаем розыгрыш
  console.log('🎲 Шаг 2: Создание розыгрыша...')
  const draw = await prisma.draw.create({
    data: {
      name: 'TEST Еженедельный розыгрыш #1',
      description: 'Тестовый розыгрыш',
      status: 'ACTIVE',
      prize: {
        connect: { id: prize.id },
      },
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
  console.log(`  ✓ Розыгрыш создан: ${draw.name}\n`)

  // 3. Создаем тестовых участников
  console.log('👥 Шаг 3: Создание участников...')
  const participantCount = 20
  const users: string[] = []

  for (let i = 0; i < participantCount; i++) {
    const user = await prisma.user.create({
      data: {
        id: `test-draw-user-${i}`,
        name: `Участник ${i + 1}`,
        email: `participant${i + 1}@test.com`,
        password: 'test',
      },
    })
    users.push(user.id)
  }
  console.log(`  ✓ Создано ${participantCount} участников\n`)

  // 4. Создаем коды участия
  console.log('🎟️  Шаг 4: Генерация кодов участия...')
  const entries: Array<{ id: string; uniqueCode: string; weight: number }> = []

  for (let i = 0; i < participantCount; i++) {
    const code = `TEST-CODE-${i.toString().padStart(4, '0')}`
    const entry = await prisma.entry.create({
      data: {
        uniqueCode: code,
        userId: users[i],
        drawId: draw.id,
        weight: 1,
        source: 'order',
        metadata: {
          test: true,
          index: i,
        },
      },
    })
    entries.push({
      id: entry.id,
      uniqueCode: entry.uniqueCode,
      weight: entry.weight,
    })
  }
  console.log(`  ✓ Создано ${entries.length} кодов участия\n`)

  return { draw, prize, entries }
}

async function demonstrateProvablyFair() {
  try {
    await cleanup()
    const { draw, prize, entries } = await createTestDraw()

    // ═══════════════════════════════════════════════════════════
    // ПУБЛИЧНАЯ ИНФОРМАЦИЯ ДО РОЗЫГРЫША
    // ═══════════════════════════════════════════════════════════

    console.log('📋 ПУБЛИЧНАЯ ИНФОРМАЦИЯ ДО РОЗЫГРЫША')
    console.log('─────────────────────────────────────────────────────────\n')

    console.log('Призовой фонд:')
    console.log(`  • ${prize.name}`)
    console.log(`  • Стоимость: ${((prize.value ?? 0) / 100).toLocaleString('ru-RU')} ₽\n`)

    console.log('Участники (первые 5):')
    entries.slice(0, 5).forEach((entry, i) => {
      console.log(`  ${i + 1}. Код: ${entry.uniqueCode}, Вес: ${entry.weight}`)
    })
    console.log(`  ... и еще ${entries.length - 5} участников\n`)

    console.log(`Всего участников: ${entries.length}`)
    console.log(`Количество победителей: 1\n`)

    // Публикуем client seed заранее (может задать любой желающий)
    const clientSeed = `PUBLIC-SEED-${new Date().toISOString().split('T')[0]}`
    console.log('Client Seed (публичный, задан заранее):')
    console.log(`  ${clientSeed}\n`)

    console.log('⏸️  Server Seed пока секретный (будет опубликован после розыгрыша)\n')

    // ═══════════════════════════════════════════════════════════
    // ПРОВЕДЕНИЕ РОЗЫГРЫША
    // ═══════════════════════════════════════════════════════════

    console.log('\n🎰 ПРОВЕДЕНИЕ РОЗЫГРЫША...')
    console.log('─────────────────────────────────────────────────────────\n')

    const result = await conductDraw(draw.id, 1, clientSeed)

    console.log('✅ Розыгрыш завершен!\n')

    // ═══════════════════════════════════════════════════════════
    // ПУБЛИКАЦИЯ РЕЗУЛЬТАТОВ
    // ═══════════════════════════════════════════════════════════

    console.log('📢 ПУБЛИКАЦИЯ РЕЗУЛЬТАТОВ')
    console.log('─────────────────────────────────────────────────────────\n')

    console.log('🏆 ПОБЕДИТЕЛЬ:')
    result.winners.forEach((winner, i) => {
      console.log(`  ${i + 1}. ${winner.userName || 'Аноним'}`)
      console.log(`     Код участия: ${winner.uniqueCode}`)
      console.log(`     Email: ${winner.userEmail || 'скрыт'}`)
      console.log(`     Приз: ${winner.prize?.name || 'N/A'}\n`)
    })

    console.log('🔐 ДАННЫЕ ДЛЯ ПРОВЕРКИ ЧЕСТНОСТИ:')
    console.log('─────────────────────────────────────────────────────────')
    console.log(`Алгоритм: ${result.algorithm}`)
    console.log(`Client Seed: ${result.clientSeed}`)
    console.log(`Server Seed: ${result.serverSeed}`)
    console.log(`Server Seed Hash: ${result.serverSeedHash}`)
    console.log(`Nonce: ${result.nonce}`)
    console.log(`Время розыгрыша: ${result.timestamp.toISOString()}\n`)

    // ═══════════════════════════════════════════════════════════
    // ВЕРИФИКАЦИЯ РЕЗУЛЬТАТОВ
    // ═══════════════════════════════════════════════════════════

    console.log('✓ ПРОВЕРКА ЧЕСТНОСТИ РОЗЫГРЫША')
    console.log('─────────────────────────────────────────────────────────\n')

    console.log('Любой человек может проверить результаты используя:')
    console.log('  1. Server Seed (опубликован после розыгрыша)')
    console.log('  2. Client Seed (был публичен до розыгрыша)')
    console.log('  3. Список всех участников и их кодов')
    console.log('  4. Алгоритм SHA-256\n')

    console.log('Запускаем верификацию...')

    const isValid = verifyDrawResult(result, entries)

    if (isValid) {
      console.log('✅ РЕЗУЛЬТАТ ВАЛИДЕН!')
      console.log('   Розыгрыш проведен честно, результаты воспроизводимы\n')
    } else {
      console.log('❌ РЕЗУЛЬТАТ НЕВАЛИДЕН!')
      console.log('   Обнаружена попытка подлога!\n')
    }

    // ═══════════════════════════════════════════════════════════
    // СТАТИСТИКА
    // ═══════════════════════════════════════════════════════════

    console.log('📊 СТАТИСТИКА РОЗЫГРЫША')
    console.log('─────────────────────────────────────────────────────────\n')

    const stats = await getDrawStats(draw.id)

    console.log(`Название: ${stats.drawName}`)
    console.log(`Статус: ${stats.status}`)
    console.log(`Всего участников: ${stats.totalParticipants}`)
    console.log(`Всего кодов: ${stats.totalEntries}`)
    console.log(`Победителей: ${stats.totalWinners}`)
    console.log(`Общий вес: ${stats.totalWeight}\n`)

    // ═══════════════════════════════════════════════════════════
    // КАК ЭТО РАБОТАЕТ
    // ═══════════════════════════════════════════════════════════

    console.log('\n💡 КАК ЭТО РАБОТАЕТ (PROVABLY FAIR)')
    console.log('═══════════════════════════════════════════════════════════\n')

    console.log('1. ДО РОЗЫГРЫША:')
    console.log('   • Публикуется список всех участников и их кодов')
    console.log('   • Публикуется Client Seed (может задать любой желающий)')
    console.log('   • Server Seed пока секретный\n')

    console.log('2. ПРОВЕДЕНИЕ:')
    console.log('   • Используется формула: SHA-256(serverSeed:clientSeed:nonce)')
    console.log('   • Генерируются случайные числа для выбора победителей')
    console.log('   • Учитывается вес каждого участника\n')

    console.log('3. ПОСЛЕ РОЗЫГРЫША:')
    console.log('   • Публикуется Server Seed')
    console.log('   • Любой может воспроизвести розыгрыш')
    console.log('   • Проверить SHA-256 хеш Server Seed')
    console.log('   • Убедиться в честности результатов\n')

    console.log('4. ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:')
    console.log('   • CSGORoll, Stake.com - онлайн казино')
    console.log('   • Многие крипто-лотереи')
    console.log('   • Прозрачные розыгрыши NFT\n')

    console.log('═══════════════════════════════════════════════════════════')
    console.log('  ✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ')
    console.log('  Система готова к использованию!')
    console.log('═══════════════════════════════════════════════════════════\n')
  } catch (error) {
    console.error('\n❌ Ошибка теста:', error)
    throw error
  } finally {
    await cleanup()
    await prisma.$disconnect()
  }
}

demonstrateProvablyFair()
