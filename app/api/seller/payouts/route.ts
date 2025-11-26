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

    const payouts = await prisma.payout.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payouts)
  } catch (error) {
    logger.error('Error fetching payouts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sellerId = session.user.id
    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Получаем информацию о продавце
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
    })

    if (!seller?.bankAccount || !seller?.bankName || !seller?.bankBik) {
      return NextResponse.json(
        { error: 'Необходимо заполнить банковские реквизиты в настройках' },
        { status: 400 }
      )
    }

    // Вычисляем доступный баланс
    const completedOrders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        items: {
          some: {
            variant: {
              product: { sellerId }
            }
          }
        }
      },
      include: {
        items: {
          where: {
            variant: {
              product: { sellerId }
            }
          },
          include: {
            variant: true
          }
        }
      }
    })

    let totalEarned = 0
    for (const order of completedOrders) {
      const orderTotal = order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)
      totalEarned += Math.floor(orderTotal * 0.5)
    }

    const completedPayouts = await prisma.payout.aggregate({
      where: {
        sellerId,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })

    const balance = totalEarned - (completedPayouts._sum.amount || 0)

    if (amount > balance) {
      return NextResponse.json(
        { error: 'Недостаточно средств' },
        { status: 400 }
      )
    }

    // Создаём заявку на выплату
    const payout = await prisma.payout.create({
      data: {
        sellerId,
        amount,
        status: 'PENDING',
        bankAccount: seller.bankAccount,
        bankName: seller.bankName,
        bankBik: seller.bankBik,
      },
    })

    return NextResponse.json(payout)
  } catch (error) {
    logger.error('Error creating payout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
