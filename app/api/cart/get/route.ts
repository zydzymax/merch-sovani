export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/cart/getSession'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const session = await getSession()
    const cartItems = session?.cart || []

    // Calculate subtotal
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    )

    return NextResponse.json({
      items: cartItems,
      subtotal,
    })
  } catch (error) {
    logger.error('Get cart failed', error)
    return NextResponse.json({ error: 'Ошибка получения корзины' }, { status: 500 })
  }
}
