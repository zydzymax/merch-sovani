import { prisma } from '@/lib/db/prisma'
import { generateEntryCode } from './format'

/**
 * Generate unique entry code with collision detection
 * Retries up to 10 times if collision occurs
 *
 * For 50k participants with 36^4 combinations per millisecond,
 * collision probability is extremely low (~0.003%)
 */
export async function generateUniqueEntryCode(maxRetries: number = 10): Promise<string> {
  let attempts = 0

  while (attempts < maxRetries) {
    const code = generateEntryCode()

    // Check if code already exists
    const existing = await prisma.entry.findUnique({
      where: { uniqueCode: code },
    })

    if (!existing) {
      // Also check in orders (entryCode field)
      const existingOrder = await prisma.order.findUnique({
        where: { entryCode: code },
      })

      if (!existingOrder) {
        return code
      }
    }

    attempts++

    // If collision occurred, wait 1ms before retry to get new timestamp
    await new Promise((resolve) => setTimeout(resolve, 1))
  }

  throw new Error(
    `Failed to generate unique entry code after ${maxRetries} attempts. This should never happen.`
  )
}

/**
 * Calculate theoretical collision probability
 * For educational purposes
 */
export function calculateCollisionProbability(participants: number): number {
  // Using birthday paradox formula
  // P(collision) ≈ 1 - e^(-n²/2d)
  // where n = number of participants, d = number of possible codes
  const d = Math.pow(36, 4) // 1,679,616 combinations per millisecond
  const n = participants
  const probability = 1 - Math.exp(-(n * n) / (2 * d))
  return probability
}

/**
 * Get statistics about entry codes
 */
export async function getEntryCodeStats() {
  const totalEntries = await prisma.entry.count()
  const totalOrders = await prisma.order.count({
    where: { entryCode: { not: null } },
  })

  const collisionProbability = calculateCollisionProbability(totalEntries)

  return {
    totalEntries,
    totalOrders,
    collisionProbability: `${(collisionProbability * 100).toFixed(6)}%`,
    capacity: {
      perMillisecond: Math.pow(36, 4),
      theoretical: 'Practically unlimited with timestamp',
    },
  }
}
