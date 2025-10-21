import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import HeroShowcaseSticky from '@/components/HeroShowcaseSticky'

export default async function HomePage() {
  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { variants: { take: 1, orderBy: { sortOrder: 'asc' } } },
    take: 6,
  })

  // Fetch active draw
  const activeDraw = await prisma.draw.findFirst({
    where: { status: 'ACTIVE' },
    include: { prize: true },
  })

  // Calculate time remaining
  const timeRemaining = activeDraw
    ? Math.max(0, new Date(activeDraw.endsAt).getTime() - Date.now())
    : 0
  const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
              Fashion Shop
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/catalog" className="hover:text-primary transition-colors">
                Каталог
              </Link>
              <Link href="/promo" className="hover:text-primary transition-colors">
                Акция
              </Link>
              <Link href="/tickets" className="hover:text-primary transition-colors">
                Билеты
              </Link>
              <Link href="/draws" className="hover:text-primary transition-colors">
                Розыгрыши
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

      {/* Hero Showcase Sticky - трехколоночный дизайн с липкими фото */}
      <HeroShowcaseSticky />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Хиты продаж</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const variant = product.variants[0]
              const price = variant?.price || 0
              const compareAt = variant?.compareAt
              const image = variant?.images?.[0] || product.images?.[0] || '/placeholder.jpg'

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {compareAt && compareAt > price && (
                      <div className="absolute top-2 right-2 bg-destructive text-white px-2 py-1 rounded text-sm font-medium">
                        -{Math.round(((compareAt - price) / compareAt) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{formatPrice(price)}</span>
                      {compareAt && compareAt > price && (
                        <span className="text-sm line-through text-muted-foreground">
                          {formatPrice(compareAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="inline-block px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
            >
              Смотреть весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">Как получить шанс</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Выбери товары</h3>
              <p className="text-muted-foreground">Добавь понравившиеся вещи в корзину</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Участвуй в акции</h3>
              <p className="text-muted-foreground">
                Поставь галочку при оформлении (возврат станет невозможным)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Получи код</h3>
              <p className="text-muted-foreground">После оплаты получишь персональный код участия</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif font-bold text-xl mb-4">Fashion Shop</h3>
              <p className="text-sm opacity-80">Стильная одежда и призы каждый день</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Покупателям</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/catalog" className="opacity-80 hover:opacity-100">
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link href="/promo" className="opacity-80 hover:opacity-100">
                    Акция
                  </Link>
                </li>
                <li>
                  <Link href="/draws" className="opacity-80 hover:opacity-100">
                    Розыгрыши
                  </Link>
                </li>
                <li>
                  <Link href="/tickets" className="opacity-80 hover:opacity-100">
                    Билеты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/legal/offer" className="opacity-80 hover:opacity-100">
                    Публичная оферта
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="opacity-80 hover:opacity-100">
                    Конфиденциальность
                  </Link>
                </li>
                <li>
                  <Link href="/legal/promo-rules" className="opacity-80 hover:opacity-100">
                    Правила акции
                  </Link>
                </li>
                <li>
                  <Link href="/legal/returns" className="opacity-80 hover:opacity-100">
                    Возвраты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <p className="text-sm opacity-80">Email: hello@fashion.shop</p>
              <p className="text-sm opacity-80">Тел: +7 (999) 123-45-67</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-80">
            © 2025 Fashion Shop. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
