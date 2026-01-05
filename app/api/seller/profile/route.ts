import { NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        companyName: true,
        inn: true,
        ogrn: true,
        legalAddress: true,
        bankAccount: true,
        bankName: true,
        bankBik: true,
        bankCorAccount: true,
      },
    })

    return NextResponse.json(user || {})
  } catch (error) {
    logger.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      phone,
      companyName,
      inn,
      ogrn,
      legalAddress,
      bankAccount,
      bankName,
      bankBik,
      bankCorAccount,
    } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
        companyName,
        inn,
        ogrn,
        legalAddress,
        bankAccount,
        bankName,
        bankBik,
        bankCorAccount,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
