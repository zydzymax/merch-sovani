import { prisma } from '@/lib/db/prisma'

interface FraudCheckResult {
  isValid: boolean
  fraudScore: number
  fraudReasons: string[]
}

/**
 * Check if a referral is fraudulent
 * Detects:
 * - Self-referrals
 * - Same IP address
 * - Same device fingerprint
 * - Same phone number
 * - Same delivery address
 */
export async function checkReferralFraud(
  referrerId: string,
  referredId: string,
  referredIp?: string,
  referredDevice?: string
): Promise<FraudCheckResult> {
  const fraudReasons: string[] = []
  let fraudScore = 0

  // 1. Check for self-referral
  if (referrerId === referredId) {
    fraudReasons.push('self_referral')
    fraudScore += 100
    return {
      isValid: false,
      fraudScore: 100,
      fraudReasons,
    }
  }

  // Get referrer and referred user data
  const [referrer, referred] = await Promise.all([
    prisma.user.findUnique({
      where: { id: referrerId },
      select: {
        id: true,
        email: true,
        phone: true,
        orders: {
          select: {
            ipAddress: true,
            deviceFingerprint: true,
            shippingAddress: true,
            shippingPostalCode: true,
            phone: true,
          },
          take: 5, // Check last 5 orders
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: referredId },
      select: {
        id: true,
        email: true,
        phone: true,
        orders: {
          select: {
            ipAddress: true,
            deviceFingerprint: true,
            shippingAddress: true,
            shippingPostalCode: true,
            phone: true,
          },
          take: 5,
        },
      },
    }),
  ])

  if (!referrer || !referred) {
    return {
      isValid: false,
      fraudScore: 100,
      fraudReasons: ['user_not_found'],
    }
  }

  // 2. Check if same phone number
  if (referrer.phone && referred.phone && referrer.phone === referred.phone) {
    fraudReasons.push('same_phone')
    fraudScore += 50
  }

  // 3. Check if same IP addresses
  const referrerIPs = referrer.orders.map(o => o.ipAddress).filter(Boolean)
  const referredIPs = referred.orders.map(o => o.ipAddress).filter(Boolean)

  if (referredIp && referrerIPs.includes(referredIp)) {
    fraudReasons.push('same_ip')
    fraudScore += 40
  }

  const commonIPs = referrerIPs.filter(ip => referredIPs.includes(ip))
  if (commonIPs.length > 0) {
    fraudReasons.push('ip_overlap')
    fraudScore += 30
  }

  // 4. Check if same device fingerprint
  const referrerDevices = referrer.orders.map(o => o.deviceFingerprint).filter(Boolean)
  const referredDevices = referred.orders.map(o => o.deviceFingerprint).filter(Boolean)

  if (referredDevice && referrerDevices.includes(referredDevice)) {
    fraudReasons.push('same_device')
    fraudScore += 45
  }

  const commonDevices = referrerDevices.filter(d => referredDevices.includes(d))
  if (commonDevices.length > 0) {
    fraudReasons.push('device_overlap')
    fraudScore += 35
  }

  // 5. Check if same delivery address
  const referrerAddresses = referrer.orders.map(o =>
    `${o.shippingAddress}|${o.shippingPostalCode}`.toLowerCase()
  )
  const referredAddresses = referred.orders.map(o =>
    `${o.shippingAddress}|${o.shippingPostalCode}`.toLowerCase()
  )

  const commonAddresses = referrerAddresses.filter(addr =>
    referredAddresses.includes(addr) && addr !== '|'
  )
  if (commonAddresses.length > 0) {
    fraudReasons.push('same_address')
    fraudScore += 40
  }

  // Determine if valid (fraud score < 50 = valid)
  const isValid = fraudScore < 50

  return {
    isValid,
    fraudScore: Math.min(fraudScore, 100),
    fraudReasons,
  }
}

/**
 * Mark a referral as fraudulent
 */
export async function markReferralAsFraud(
  referrerId: string,
  referredId: string,
  fraudScore: number,
  fraudReasons: string[]
) {
  await prisma.referral.updateMany({
    where: {
      referrerId,
      referredId,
    },
    data: {
      fraudChecked: true,
      fraudScore,
      fraudReason: fraudReasons.join(', '),
      isValid: false,
    },
  })

  // Annul any entries created from this fraudulent referral
  const referralEntries = await prisma.entry.findMany({
    where: {
      OR: [
        { userId: referrerId, source: 'referral' },
        { userId: referredId, source: 'referral' },
      ],
      isActive: true,
    },
  })

  if (referralEntries.length > 0) {
    await prisma.entry.updateMany({
      where: {
        id: { in: referralEntries.map(e => e.id) },
      },
      data: {
        isActive: false,
        annulledAt: new Date(),
        annulledReason: 'fraud',
      },
    })
  }

  await prisma.auditLog.create({
    data: {
      action: 'MARK_REFERRAL_FRAUD',
      entity: 'Referral',
      entityId: `${referrerId}-${referredId}`,
      changes: {
        fraudScore,
        fraudReasons,
        entriesAnnulled: referralEntries.length,
      },
    },
  })

  console.log(`⚠️ Marked referral as fraud: ${referrerId} -> ${referredId}`)
  console.log(`   Reasons: ${fraudReasons.join(', ')}`)
  console.log(`   Score: ${fraudScore}/100`)
  console.log(`   Annulled ${referralEntries.length} entries`)
}
