/**
 * Test script for unique entry code generation
 * Tests collision detection and uniqueness for 50k+ participants
 */

import { generateEntryCode, validateEntryCode } from '../lib/utils/format'

interface TestResults {
  totalGenerated: number
  uniqueCodes: Set<string>
  duplicates: number
  invalidCodes: number
  formatErrors: string[]
  executionTimeMs: number
}

/**
 * Test 1: Generate N codes and check for duplicates
 */
async function testUniqueGeneration(count: number): Promise<TestResults> {
  console.log(`\n🧪 Test 1: Generating ${count.toLocaleString()} codes...`)

  const startTime = Date.now()
  const codes = new Set<string>()
  const formatErrors: string[] = []
  let invalidCodes = 0

  for (let i = 0; i < count; i++) {
    const code = generateEntryCode()

    // Validate format
    if (!validateEntryCode(code)) {
      invalidCodes++
      if (formatErrors.length < 10) {
        formatErrors.push(code)
      }
    }

    codes.add(code)

    // Progress indicator
    if ((i + 1) % 10000 === 0) {
      process.stdout.write(`\r  Generated: ${(i + 1).toLocaleString()} codes...`)
    }
  }

  const executionTimeMs = Date.now() - startTime
  const duplicates = count - codes.size

  console.log('\r  ✓ Generation complete                    ')

  return {
    totalGenerated: count,
    uniqueCodes: codes,
    duplicates,
    invalidCodes,
    formatErrors,
    executionTimeMs,
  }
}

/**
 * Test 2: Analyze code format and distribution
 */
function analyzeCodeFormat(codes: Set<string>) {
  console.log('\n🔍 Test 2: Analyzing code format...')

  const samples = Array.from(codes).slice(0, 10)
  console.log('\n  Sample codes:')
  samples.forEach((code, i) => {
    const parts = code.split('-')
    const [timestamp, random, checksum] = parts
    console.log(`  ${i + 1}. ${code}`)
    console.log(`     └─ Timestamp: ${timestamp} (${parseInt(timestamp, 36)})`)
    console.log(`        Random: ${random}, Checksum: ${checksum}`)
  })

  // Check format consistency
  const formatPattern = /^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]$/
  const validFormats = Array.from(codes).filter(code => formatPattern.test(code)).length
  console.log(`\n  ✓ Valid format: ${validFormats.toLocaleString()} / ${codes.size.toLocaleString()} (${((validFormats / codes.size) * 100).toFixed(2)}%)`)
}

/**
 * Test 3: Calculate collision probability
 */
function calculateCollisionProbability(n: number) {
  console.log('\n📊 Test 3: Collision probability analysis...')

  // Using birthday paradox formula
  // P(collision) ≈ 1 - e^(-n²/2d)
  // where n = number of participants, d = number of possible codes

  const d = Math.pow(36, 4) // 1,679,616 combinations per millisecond
  const probability = 1 - Math.exp(-(n * n) / (2 * d))

  console.log(`\n  Total capacity per millisecond: ${d.toLocaleString()} codes`)
  console.log(`  Participants: ${n.toLocaleString()}`)
  console.log(`  Collision probability: ${(probability * 100).toFixed(6)}%`)

  // Calculate for different participant counts
  console.log('\n  Collision probability by participant count:')
  ;[1000, 5000, 10000, 25000, 50000, 100000].forEach(count => {
    const p = 1 - Math.exp(-(count * count) / (2 * d))
    console.log(`    ${count.toLocaleString().padStart(7)} participants: ${(p * 100).toFixed(6)}%`)
  })
}

/**
 * Test 4: Stress test - rapid generation
 */
async function testRapidGeneration() {
  console.log('\n⚡ Test 4: Rapid generation stress test...')
  console.log('  Generating 1000 codes in rapid succession...')

  const startTime = Date.now()
  const codes: string[] = []

  for (let i = 0; i < 1000; i++) {
    codes.push(generateEntryCode())
  }

  const elapsed = Date.now() - startTime
  const uniqueCount = new Set(codes).size
  const duplicates = codes.length - uniqueCount

  console.log(`  ✓ Generated 1000 codes in ${elapsed}ms`)
  console.log(`    Unique codes: ${uniqueCount}`)
  console.log(`    Duplicates: ${duplicates}`)
  console.log(`    Rate: ${(1000 / elapsed * 1000).toFixed(0)} codes/sec`)
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  UNIQUE ENTRY CODE GENERATION TEST SUITE')
  console.log('  Testing for 50,000+ participant capacity')
  console.log('═══════════════════════════════════════════════════════════')

  try {
    // Test 1: Generate 50k codes
    const results = await testUniqueGeneration(50000)

    console.log('\n📈 Results Summary:')
    console.log(`  Total generated: ${results.totalGenerated.toLocaleString()}`)
    console.log(`  Unique codes: ${results.uniqueCodes.size.toLocaleString()}`)
    console.log(`  Duplicates: ${results.duplicates}`)
    console.log(`  Invalid codes: ${results.invalidCodes}`)
    console.log(`  Execution time: ${results.executionTimeMs.toLocaleString()}ms`)
    console.log(`  Generation rate: ${(results.totalGenerated / results.executionTimeMs * 1000).toFixed(0)} codes/sec`)

    if (results.duplicates > 0) {
      console.log(`\n  ⚠️  WARNING: ${results.duplicates} duplicate(s) detected!`)
    } else {
      console.log('\n  ✅ SUCCESS: All codes are unique!')
    }

    if (results.invalidCodes > 0) {
      console.log(`\n  ⚠️  WARNING: ${results.invalidCodes} invalid code(s) detected!`)
      if (results.formatErrors.length > 0) {
        console.log('  First invalid codes:')
        results.formatErrors.forEach(code => console.log(`    - ${code}`))
      }
    } else {
      console.log('  ✅ SUCCESS: All codes passed validation!')
    }

    // Test 2: Format analysis
    analyzeCodeFormat(results.uniqueCodes)

    // Test 3: Collision probability
    calculateCollisionProbability(50000)

    // Test 4: Rapid generation
    await testRapidGeneration()

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('  ✅ ALL TESTS COMPLETED')
    console.log('═══════════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
runTests()
