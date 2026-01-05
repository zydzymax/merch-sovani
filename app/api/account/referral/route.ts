export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'

// GET - Get user's referral stats
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with referral code
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        referralCode: true,
        referralsFrom: {
          include: {
            referred: {
              select: {
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    if (!user || !user.referralCode) {
      return NextResponse.json(
        { error: 'User not found or no referral code' },
        { status: 404 }
      )
    }

    // Count referrals
    const referralsCount = user.referralsFrom.length

    // Build referral URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.getnwin.ru'
    const referralUrl = `${baseUrl}?ref=${user.referralCode}`

    return NextResponse.json({
      userId: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      referralCode: user.referralCode,
      referralUrl,
      referralsCount,
      referrals: user.referralsFrom.map(r => ({
        name: r.referred.name,
        joinedAt: r.createdAt,
      })),
    })
  } catch (error) {
    logger.error('Error getting referral stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
