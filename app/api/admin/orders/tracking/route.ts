import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { orderId, trackingNumber } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Update order with CDEK tracking number
    await prisma.order.update({
      where: { id: orderId },
      data: {
        cdekTrackingNumber: trackingNumber || null,
      },
    })

    logger.info('Order tracking number updated', {
      adminId: user.id,
      orderId,
      trackingNumber,
    })

    return NextResponse.json({
      success: true,
      message: 'Tracking number updated successfully',
    })
  } catch (error) {
    logger.error('Error updating tracking number', error)
    return NextResponse.json(
      { error: 'Failed to update tracking number' },
      { status: 500 }
    )
  }
}
