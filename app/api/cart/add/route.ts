import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'
import { logger } from '@/lib/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { variantId, quantity = 1 } = body

    if (!variantId) {
      return NextResponse.json({ error: 'variantId обязателен' }, { status: 400 })
    }

    // Validate quantity
    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 1 || qty > 100) {
      return NextResponse.json({ error: 'Некорректное количество (1-100)' }, { status: 400 })
    }

    // Get or create session
    const session = await getOrCreateSession()

    // Check if variant exists and is active
    const variant = await prisma.variant.findUnique({
      where: { id: variantId, isActive: true },
      include: { inventory: true },
    })

    if (!variant) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    // Check inventory
    if (variant.inventory && variant.inventory.quantity < qty) {
      return NextResponse.json({ error: 'Недостаточно товара на складе' }, { status: 400 })
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        sessionId_variantId: {
          sessionId: session.id,
          variantId,
        },
      },
    })

    if (existingCartItem) {
      // Update quantity with max limit
      const newQuantity = Math.min(existingCartItem.quantity + qty, 100)
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          sessionId: session.id,
          variantId,
          quantity: qty,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Add to cart failed', error)
    return NextResponse.json({ error: 'Ошибка добавления в корзину' }, { status: 500 })
  }
}
