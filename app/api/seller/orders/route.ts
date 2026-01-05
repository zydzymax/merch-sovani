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

    // Получаем заказы, в которых есть товары этого продавца
    const orders = await prisma.order.findMany({
      where: {
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
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    logger.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
