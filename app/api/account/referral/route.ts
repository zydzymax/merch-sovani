export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { prisma } from '@/lib/db/prisma'

// Generate unique 8-character code (letters and numbers)
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET - Get user's referral link (or create if doesn't exist)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already has a referral link
    let referralLink = await prisma.referralLink.findFirst({
      where: {
        ownerId: user.id,
        isActive: true,
      },
      include: {
        hits: true,
      },
    })

    // If not, create one
    if (!referralLink) {
      let code = generateReferralCode()
      let isUnique = false

      // Ensure code is unique
      while (!isUnique) {
        const existing = await prisma.referralLink.findUnique({
          where: { code },
        })
        if (!existing) {
          isUnique = true
        } else {
          code = generateReferralCode()
        }
      }

      referralLink = await prisma.referralLink.create({
        data: {
          code,
          ownerId: user.id,
        },
        include: {
          hits: true,
        },
      })
    }

    // Calculate statistics
    const totalHits = referralLink.hits.length
    const convertedOrders = referralLink.hits.filter(
      (hit) => hit.convertedOrderId !== null
    ).length

    return NextResponse.json({
      code: referralLink.code,
      url: `https://sovani.shop/ref/${referralLink.code}`,
      stats: {
        clicks: totalHits,
        orders: convertedOrders,
      },
      createdAt: referralLink.createdAt,
    })
  } catch (error) {
    console.error('Error getting referral link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
