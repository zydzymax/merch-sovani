import { prisma } from '@/lib/db/prisma'

/**
 * Annul all lottery entries for a given order
 * Called when order is refunded or returned
 */
export async function annulEntriesForOrder(
  orderId: string,
  reason: 'refund' | 'return' | 'fraud' | 'cancelled'
) {
  try {
    const result = await prisma.entry.updateMany({
      where: {
        orderId,
        isActive: true, // Only annul active entries
      },
      data: {
        isActive: false,
        annulledAt: new Date(),
        annulledReason: reason,
      },
    })

    console.log(`✅ Annulled ${result.count} entries for order ${orderId} (reason: ${reason})`)

    // Log to audit trail
    await prisma.auditLog.create({
      data: {
        action: 'ANNUL_ENTRIES',
        entity: 'Order',
        entityId: orderId,
        changes: {
          entriesAnnulled: result.count,
          reason,
        },
      },
    })

    return result.count
  } catch (error) {
    console.error('Error annulling entries:', error)
    throw error
  }
}

/**
 * Check if an order has active entries
 */
export async function hasActiveEntries(orderId: string): Promise<boolean> {
  const count = await prisma.entry.count({
    where: {
      orderId,
      isActive: true,
    },
  })

  return count > 0
}

/**
 * Restore annulled entries (for admin correction)
 */
export async function restoreEntriesForOrder(orderId: string) {
  const result = await prisma.entry.updateMany({
    where: {
      orderId,
      isActive: false,
    },
    data: {
      isActive: true,
      annulledAt: null,
      annulledReason: null,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'RESTORE_ENTRIES',
      entity: 'Order',
      entityId: orderId,
      changes: {
        entriesRestored: result.count,
      },
    },
  })

  return result.count
}
