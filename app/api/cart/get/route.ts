export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'

export async function GET() {
  try {
    const session = await getOrCreateSession()
    const cartItems = session.cart || []

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
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Ошибка получения корзины' }, { status: 500 })
  }
}
