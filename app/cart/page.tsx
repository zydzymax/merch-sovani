import Link from 'next/link'
import Image from 'next/image'
import { getOrCreateSession } from '@/lib/cart/getOrCreateSession'
import { formatPrice } from '@/lib/utils/format'
import CartItemActions from '@/components/CartItemActions'
import { chancesForProduct, getChancesLabel, getTotalChancesLabel } from '@/lib/chances'

export default async function CartPage() {
  const session = await getOrCreateSession()
  const cartItems = session.cart || []

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
  
  // Calculate total chances
  const totalChances = cartItems.reduce((sum, item) => {
    const chances = chancesForProduct({
      id: item.variant.product.id,
      slug: item.variant.product.slug,
      name: item.variant.product.name
    })
    return sum + (chances * item.quantity)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
              SoVAni
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/catalog" className="hover:text-primary transition-colors">
                Каталог
              </Link>
              <Link href="/cart" className="text-primary font-medium">
                Корзина
              </Link>
              <Link
                href="/account"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Войти
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Корзина</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-xl text-gray-500 mb-6">Ваша корзина пуста</p>
            <Link
              href="/catalog"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const chances = chancesForProduct({
                  id: item.variant.product.id,
                  slug: item.variant.product.slug,
                  name: item.variant.product.name
                })
                const itemTotalChances = chances * item.quantity
                const chancesLabel = getChancesLabel(chances)
                
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.variant.product.images[0] ? (
                          <Image
                            src={item.variant.product.images[0]}
                            alt={item.variant.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.variant.product.slug}`}
                          className="font-medium text-lg hover:text-primary transition-colors"
                        >
                          {item.variant.product.name}
                        </Link>
                        {item.variant.name && (
                          <p className="text-sm text-gray-600 mt-1">{item.variant.name}</p>
                        )}
                        <p className="text-primary font-bold mt-2">
                          {formatPrice(item.variant.price)}
                        </p>

                        {/* Chances badge */}
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-sm font-semibold">
                          <span>🎁</span>
                          <span>{chancesLabel}</span>
                          {item.quantity > 1 && (
                            <span className="text-xs opacity-75">× {item.quantity} = {getTotalChancesLabel(itemTotalChances)}</span>
                          )}
                        </div>

                        {/* Stock info */}
                        {item.variant.inventory && (
                          <p className="text-sm text-gray-500 mt-1">
                            В наличии: {item.variant.inventory.quantity} шт.
                          </p>
                        )}
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <CartItemActions itemId={item.id} currentQuantity={item.quantity} />

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Итого:</p>
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Итого</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Товары ({cartItems.length}):</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>К оплате:</span>
                    <span className="text-primary">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* Total chances display */}
                {totalChances > 0 && (
                  <div className="bg-brand-red/10 border-2 border-brand-red/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎁</span>
                        <span className="font-semibold text-gray-700">Итого шансов:</span>
                      </div>
                      <span className="text-2xl font-bold text-brand-red">
                        {getTotalChancesLabel(totalChances)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      на выигрыш iPhone 17 Pro, Apple Watch Ultra и XREAL Air 2 Ultra
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-white text-center px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Оформить заказ
                </Link>

                <Link
                  href="/catalog"
                  className="block w-full text-center px-8 py-3 mt-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Продолжить покупки
                </Link>

                {/* Promo info */}
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Акция «1 покупка = шансы на призы»</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Пижама = 3 шанса • Футболка = 2 шанса • Остальное = 1 шанс
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm opacity-80">
            © 2025 SoVAni. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
