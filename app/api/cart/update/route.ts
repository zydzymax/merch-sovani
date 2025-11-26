import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
    }

    // Update cart item
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Update cart failed', error)
    return NextResponse.json({ error: 'Ошибка обновления корзины' }, { status: 500 })
  }
}
