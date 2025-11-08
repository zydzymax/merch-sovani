import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId } = body

    if (!itemId) {
      return NextResponse.json({ error: 'itemId обязателен' }, { status: 400 })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json({ error: 'Ошибка удаления из корзины' }, { status: 500 })
  }
}
