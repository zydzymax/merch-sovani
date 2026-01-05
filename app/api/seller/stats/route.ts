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

    const sellerId = session.user.id

    // Подсчитываем статистику
    const [products, orders, pendingPayouts, completedOrders] = await Promise.all([
      prisma.product.count({ where: { sellerId } }),
      prisma.order.count({
        where: {
          items: {
            some: {
              variant: {
                product: { sellerId }
              }
            }
          }
        }
      }),
      prisma.payout.count({
        where: {
          sellerId,
          status: { in: ['PENDING', 'PROCESSING'] }
        }
      }),
      prisma.order.findMany({
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
    ])

    // Вычисляем доступный баланс (50% от выполненных заказов минус выплаты)
    let totalEarned = 0
    for (const order of completedOrders) {
      const orderTotal = order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)
      totalEarned += Math.floor(orderTotal * 0.5) // 50% комиссия
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

    return NextResponse.json({
      balance,
      totalOrders: orders,
      totalProducts: products,
      pendingPayouts,
    })
  } catch (error) {
    logger.error('Error fetching seller stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
