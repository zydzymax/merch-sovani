import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'
import { logger } from '@/lib/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId } = body

    if (!itemId) {
      return NextResponse.json({ error: 'itemId обязателен' }, { status: 400 })
    }

    // Get current session to verify ownership
    const session = await getOrCreateSession({ readOnly: true })

    if (!session.id) {
      return NextResponse.json({ error: 'Сессия не найдена' }, { status: 401 })
    }

    // Verify the item belongs to this session (IDOR protection)
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { session: true }
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    if (cartItem.sessionId !== session.id) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    // Delete cart item (now verified to belong to user)
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Remove from cart failed', error)
    return NextResponse.json({ error: 'Ошибка удаления из корзины' }, { status: 500 })
  }
}
