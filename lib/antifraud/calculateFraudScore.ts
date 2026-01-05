import { prisma } from '@/lib/db/prisma'

interface FraudCheckData {
  userId?: string
  email: string
  phone: string
  ipAddress?: string
  deviceFingerprint?: string
  shippingAddress: string
  shippingPostalCode: string
}

interface FraudResult {
  fraudScore: number
  fraudFlags: string[]
  isHighRisk: boolean
}

/**
 * Calculate fraud score for an order
 * Returns score 0-100 (higher = more suspicious)
 */
export async function calculateOrderFraudScore(
  data: FraudCheckData
): Promise<FraudResult> {
  const fraudFlags: string[] = []
  let fraudScore = 0

  // 1. Check for multiple orders from same IP
  if (data.ipAddress) {
    const ordersFromSameIP = await prisma.order.count({
      where: {
        ipAddress: data.ipAddress,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    if (ordersFromSameIP > 3) {
      fraudFlags.push('multiple_orders_same_ip')
      fraudScore += 25
    }
  }

  // 2. Check for multiple accounts with same device
  if (data.deviceFingerprint) {
    const usersWithSameDevice = await prisma.order.findMany({
      where: {
        deviceFingerprint: data.deviceFingerprint,
        userId: { not: data.userId || undefined },
      },
      distinct: ['userId'],
      select: { userId: true },
    })

    if (usersWithSameDevice.length > 1) {
      fraudFlags.push('device_shared_accounts')
      fraudScore += 20
    }
  }

  // 3. Check for same phone number used by different users
  const usersWithSamePhone = await prisma.user.count({
    where: {
      phone: data.phone,
      id: { not: data.userId || undefined },
    },
  })

  if (usersWithSamePhone > 0) {
    fraudFlags.push('phone_multiple_accounts')
    fraudScore += 30
  }

  // 4. Check for rapid succession orders (velocity check)
  if (data.userId) {
    const recentOrders = await prisma.order.count({
      where: {
        userId: data.userId,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    })

    if (recentOrders > 3) {
      fraudFlags.push('high_velocity')
      fraudScore += 20
    }
  }

  // 5. Check for suspicious email patterns
  const emailLower = data.email.toLowerCase()
  if (
    emailLower.includes('+') &&
    emailLower.split('+')[1]?.includes('@')
  ) {
    fraudFlags.push('email_alias')
    fraudScore += 15
  }

  // Temporary/disposable email patterns
  const disposableDomains = ['temp', 'throwaway', 'guerrilla', '10minute']
  if (disposableDomains.some(domain => emailLower.includes(domain))) {
    fraudFlags.push('disposable_email')
    fraudScore += 35
  }

  // 6. Check for same delivery address used by multiple users
  const addressKey = `${data.shippingAddress}|${data.shippingPostalCode}`.toLowerCase()
  const ordersToSameAddress = await prisma.order.count({
    where: {
      shippingAddress: data.shippingAddress,
      shippingPostalCode: data.shippingPostalCode,
      userId: { not: data.userId || undefined },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
  })

  if (ordersToSameAddress > 2) {
    fraudFlags.push('address_multiple_users')
    fraudScore += 25
  }

  // 7. Check for new user with large order (first order check)
  if (data.userId) {
    const userOrderCount = await prisma.order.count({
      where: { userId: data.userId },
    })

    if (userOrderCount === 0) {
      // First order - slightly elevated risk
      fraudScore += 5
    }
  }

  const finalScore = Math.min(fraudScore, 100)
  const isHighRisk = finalScore >= 50

  return {
    fraudScore: finalScore,
    fraudFlags,
    isHighRisk,
  }
}

/**
 * Get fraud statistics for a user
 */
export async function getUserFraudStats(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    select: {
      fraudScore: true,
      fraudFlags: true,
      status: true,
    },
  })

  const avgFraudScore = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.fraudScore, 0) / orders.length
    : 0

  const allFlags = orders.flatMap(o => (o.fraudFlags as string[]) || [])
  const uniqueFlags = Array.from(new Set(allFlags))

  const refundedCount = orders.filter(o => o.status === 'REFUNDED').length

  return {
    totalOrders: orders.length,
    avgFraudScore,
    uniqueFraudFlags: uniqueFlags,
    refundedOrdersCount: refundedCount,
    refundRate: orders.length > 0 ? refundedCount / orders.length : 0,
  }
}
