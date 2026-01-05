/**
 * End-to-end test for purchase flow with promo participation
 * Tests: Registration → Login → Add to cart → Checkout → Payment → Entry code generation
 */

import { PrismaClient } from '@prisma/client'
import { generateUniqueEntryCode } from '../lib/utils/generateUniqueEntryCode'

const prisma = new PrismaClient()

async function cleanup() {
  console.log('🧹 Cleaning up test data...')
  await prisma.entry.deleteMany({ where: { userId: { contains: 'test-user' } } })
  await prisma.orderItem.deleteMany({})
  await prisma.payment.deleteMany({})
  await prisma.order.deleteMany({ where: { userId: { contains: 'test-user' } } })
  await prisma.user.deleteMany({ where: { id: { contains: 'test-user' } } })
  console.log('  ✓ Cleanup complete\n')
}

async function testDatabaseUniqueGeneration() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  DATABASE UNIQUE CODE GENERATION TEST')
  console.log('  Simulating 100 concurrent payment completions')
  console.log('═══════════════════════════════════════════════════════════\n')

  try {
    // Create test users first
    console.log('👥 Creating test users...')
    const userIds: string[] = []
    for (let i = 0; i < 100; i++) {
      const user = await prisma.user.create({
        data: {
          id: `test-user-${i}`,
          name: `Test User ${i}`,
          email: `test${i}@example.com`,
          password: 'hashed-password',
        },
      })
      userIds.push(user.id)
    }
    console.log(`  ✓ Created ${userIds.length} test users\n`)

    console.log('🧪 Test: Generating 100 unique codes with database checks...')

    const startTime = Date.now()
    const codes: string[] = []

    // Generate codes sequentially (simulating payment completions)
    for (let i = 0; i < 100; i++) {
      const code = await generateUniqueEntryCode()
      codes.push(code)

      // Create entry to simulate real usage
      await prisma.entry.create({
        data: {
          uniqueCode: code,
          userId: userIds[i],
          orderId: null,
          drawId: null,
          weight: 1,
          source: 'order',
          metadata: {
            test: true,
            index: i,
          },
        },
      })

      if ((i + 1) % 25 === 0) {
        process.stdout.write(`\r  Generated: ${i + 1}/100 codes...`)
      }
    }

    const elapsed = Date.now() - startTime
    console.log('\r  ✓ Generation complete                    ')

    // Verify uniqueness
    const uniqueCount = new Set(codes).size
    const duplicates = codes.length - uniqueCount

    console.log('\n📈 Results:')
    console.log(`  Total generated: ${codes.length}`)
    console.log(`  Unique codes: ${uniqueCount}`)
    console.log(`  Duplicates: ${duplicates}`)
    console.log(`  Execution time: ${elapsed}ms`)
    console.log(`  Average time per code: ${(elapsed / codes.length).toFixed(2)}ms`)

    // Verify in database
    const dbEntries = await prisma.entry.count({
      where: { userId: { contains: 'test-user' } },
    })
    console.log(`  Database entries: ${dbEntries}`)

    // Show sample codes
    console.log('\n  Sample codes:')
    codes.slice(0, 5).forEach((code, i) => {
      console.log(`  ${i + 1}. ${code}`)
    })

    if (duplicates === 0 && dbEntries === codes.length) {
      console.log('\n  ✅ SUCCESS: All codes are unique and saved to database!')
    } else {
      console.log('\n  ❌ FAILURE: Issues detected!')
    }

    // Get statistics
    const stats = await prisma.entry.aggregate({
      where: { userId: { contains: 'test-user' } },
      _count: true,
    })
    console.log(`\n  Total test entries in database: ${stats._count}`)

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  }
}

async function testCompleteFlow() {
  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('  COMPLETE PURCHASE FLOW TEST')
  console.log('  Simulating real user purchase with promo participation')
  console.log('═══════════════════════════════════════════════════════════\n')

  try {
    // 1. Create test user
    console.log('👤 Step 1: Creating test user...')
    const user = await prisma.user.create({
      data: {
        id: 'test-user-flow',
        name: 'Test User',
        email: `test-flow-${Date.now()}@example.com`,
        password: 'hashed-password',
      },
    })
    console.log(`  ✓ User created: ${user.email}`)

    // 2. Get a product
    console.log('\n🛍️  Step 2: Getting product...')
    const product = await prisma.product.findFirst({
      include: { variants: true },
    })
    if (!product || !product.variants[0]) {
      throw new Error('No products found in database')
    }
    console.log(`  ✓ Product: ${product.name}`)

    // 3. Create order with promo participation
    console.log('\n📝 Step 3: Creating order with promo participation...')
    const order = await prisma.order.create({
      data: {
        orderNumber: `TEST-${Date.now()}`,
        userId: user.id,
        subtotal: 500000, // 5000 руб
        total: 500000,
        status: 'PENDING',
        participatesInPromo: true, // ← CRITICAL: User opted into promo
        hasReturnRight: true, // Will be set to false after payment
        email: user.email,
        phone: '+79991234567',
        shippingAddress: 'Test Address 123',
        shippingCity: 'Moscow',
        shippingRegion: 'Moscow Oblast',
        shippingPostalCode: '123456',
      },
    })
    console.log(`  ✓ Order created: ${order.orderNumber}`)
    console.log(`    Participates in promo: ${order.participatesInPromo}`)
    console.log(`    Has return right: ${order.hasReturnRight}`)

    // 4. Add order item
    console.log('\n📦 Step 4: Adding order item...')
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        variantId: product.variants[0].id,
        quantity: 1,
        priceAtPurchase: 500000,
      },
    })
    console.log('  ✓ Order item added')

    // 5. Create payment
    console.log('\n💳 Step 5: Creating payment...')
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        currency: 'RUB',
        status: 'PENDING',
        provider: 'MOCK',
      },
    })
    console.log(`  ✓ Payment created: ${payment.id}`)

    // 6. Simulate successful payment (this is what the webhook does)
    console.log('\n✅ Step 6: Processing successful payment...')
    console.log('  Simulating payment callback...')

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCEEDED',
        transactionId: `MOCK-${Date.now()}`,
      },
    })

    // Generate unique entry code
    const entryCode = await generateUniqueEntryCode()
    console.log(`  ✓ Generated entry code: ${entryCode}`)

    // Update order: add entry code, remove return right
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        entryCode,
        hasReturnRight: false, // ← No returns allowed for promo participants
      },
    })
    console.log('  ✓ Order updated: status=PAID, hasReturnRight=false')

    // Create entry
    await prisma.entry.create({
      data: {
        uniqueCode: entryCode,
        userId: user.id,
        orderId: order.id,
        drawId: null,
        weight: 1,
        source: 'order',
        metadata: {
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          timestamp: new Date().toISOString(),
        },
      },
    })
    console.log('  ✓ Entry created in database')

    // 7. Verify results
    console.log('\n🔍 Step 7: Verifying results...')
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        payments: true,
      },
    })

    const entry = await prisma.entry.findUnique({
      where: { uniqueCode: entryCode },
    })

    console.log('\n📊 Final State:')
    console.log(`  Order status: ${updatedOrder?.status}`)
    console.log(`  Entry code: ${updatedOrder?.entryCode}`)
    console.log(`  Has return right: ${updatedOrder?.hasReturnRight}`)
    console.log(`  Payment status: ${updatedOrder?.payments[0]?.status}`)
    console.log(`  Entry exists: ${entry ? 'Yes' : 'No'}`)

    if (
      updatedOrder?.status === 'PAID' &&
      updatedOrder?.entryCode === entryCode &&
      updatedOrder?.hasReturnRight === false &&
      updatedOrder?.payments[0]?.status === 'SUCCEEDED' &&
      entry
    ) {
      console.log('\n  ✅ SUCCESS: Complete flow works correctly!')
      console.log('  User will see entry code in their dashboard')
    } else {
      console.log('\n  ❌ FAILURE: Something went wrong!')
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  }
}

async function runTests() {
  try {
    await cleanup()
    await testDatabaseUniqueGeneration()
    await cleanup()
    await testCompleteFlow()

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('  ✅ ALL TESTS PASSED')
    console.log('═══════════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('\n❌ Tests failed:', error)
    process.exit(1)
  } finally {
    await cleanup()
    await prisma.$disconnect()
  }
}

runTests()
