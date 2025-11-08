import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import HeroBanner from '@/app/_components/HeroBanner'
import { ThreeStockings } from '@/components/xmas/ThreeStockings'
import { PromoSanta } from '@/components/xmas/PromoSanta'
import { OnePurchaseBanner } from '@/components/xmas/OnePurchaseBanner'
import { FeaturedProductsGrid } from '@/components/xmas/FeaturedProductsGrid'
import { XmasFooterBanner } from '@/components/xmas/XmasFooterBanner'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { variants: { take: 1, orderBy: { sortOrder: 'asc' } } },
  })

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Three Stockings with Prizes */}
      <ThreeStockings />

      {/* Promo Santa Section */}
      <PromoSanta />

      {/* One Purchase Banner */}
      <OnePurchaseBanner />

      {/* Featured Products - 4 column grid */}
      <section id="catalog" className="py-14 bg-gradient-to-b from-white to-brand-cream/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Хиты продаж
            </h2>
            <p className="text-xl text-brand-dark/70">
              Стильные подарки к Новому году
            </p>
          </div>
          <FeaturedProductsGrid products={featuredProducts} />
          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="inline-block px-10 py-4 border-3 border-brand-forest text-brand-forest rounded-full hover:bg-brand-forest hover:text-brand-cream transition-all font-bold text-lg hover:scale-105 shadow-lg"
            >
              Смотреть весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Greeting Banner */}
      <XmasFooterBanner />

      {/* Footer */}
      <footer className="bg-brand-dark text-brand-cream py-16 border-t-4 border-brand-gold">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-serif font-bold text-2xl mb-4 text-brand-gold">
                SoVAni
              </h3>
              <p className="text-sm text-brand-cream/80 leading-relaxed">
                Премиальная одежда с новогодним настроением.
                Участвуй в розыгрышах и выигрывай крутые призы!
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-brand-gold">Покупателям</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/catalog" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Каталог товаров
                  </Link>
                </li>
                <li>
                  <Link href="/promo" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Новогодняя акция
                  </Link>
                </li>
                <li>
                  <Link href="/draws" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Розыгрыши призов
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Личный кабинет
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-brand-gold">Документы</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/legal/privacy" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/legal/offer" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Публичная оферта
                  </Link>
                </li>
                <li>
                  <Link href="/legal/promo-rules" className="text-brand-cream/80 hover:text-brand-gold transition-colors">
                    Правила розыгрыша
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-brand-gold">Контакты</h4>
              <p className="text-sm text-brand-cream/80">Email: hello@sovani.ru</p>
              <p className="text-sm text-brand-cream/80 mt-2">Тел: +7 (999) 123-45-67</p>
              <div className="mt-6 flex gap-4 text-2xl">
                <span className="hover:scale-110 transition-transform cursor-pointer">📱</span>
                <span className="hover:scale-110 transition-transform cursor-pointer">💌</span>
                <span className="hover:scale-110 transition-transform cursor-pointer">🎁</span>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-cream/20 pt-8 text-center">
            <p className="text-sm text-brand-cream/70">
              © 2025 SoVAni. Все права защищены.
            </p>
            <p className="text-xs text-brand-cream/50 mt-2">
              С Новым Годом! Пусть удача всегда будет на твоей стороне ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
