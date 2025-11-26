export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'

// GET - Get user's referral stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with referral code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
    const baseUrl = process.env.NEXTAUTH_URL || 'https://shop.justbusiness.lol'
    const referralUrl = `${baseUrl}?ref=${user.referralCode}`

    return NextResponse.json({
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
