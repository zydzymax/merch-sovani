import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import Hero from '@/app/_components/Hero'
import ProductCard from '@/app/_components/ProductCard'
import FooterNew from '@/app/_components/FooterNew'
import Link from 'next/link'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { variants: { take: 1, orderBy: { sortOrder: 'asc' } } },
    take: 6,
  })

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Стильная одежда с акцией &quot;1 покупка = 1 шанс&quot;"
        subtitle="Покупай одежду и участвуй в розыгрыше iPhone 17 Pro Max, Apple Watch Ultra и других крутых призов"
        ctaPrimary={{ text: 'Смотреть каталог', href: '/catalog' }}
        ctaSecondary={{ text: 'Узнать об акции', href: '/promo' }}
      />

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="font-display" style={{
            fontSize: 'var(--h2)',
            textAlign: 'center',
            marginBottom: 'var(--gap-5)',
          }}>
            Наши товары
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--gap-3)',
          }}>
            {featuredProducts.map((product) => {
              const variant = product.variants[0]
              const price = variant?.price ? formatPrice(variant.price) : '0 ₽'

              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={price}
                  description={product.description || undefined}
                  imageUrl={product.images[0] || '/placeholder.png'}
                  href={`/product/${product.slug}`}
                  badge="🎁 +1 шанс"
                />
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--gap-5)' }}>
            <Link href="/catalog" className="btn-pill">
              Смотреть весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="section" style={{
        background: 'radial-gradient(circle at 70% 50%, rgba(229,42,39,0.12), transparent 60%)',
      }}>
        <div className="container">
          <div className="card" style={{
            padding: 'var(--gap-5)',
            textAlign: 'center',
            maxWidth: '800px',
            marginInline: 'auto',
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: 'var(--gap-2)',
              fontFamily: 'var(--font-display)',
            }}>
              Главный приз
            </p>
            <h2 className="font-display" style={{
              fontSize: 'var(--h2)',
              marginBottom: 'var(--gap-2)',
            }}>
              iPhone 17 Pro Max
            </h2>
            <p style={{
              fontSize: 'var(--lead)',
              color: 'var(--muted)',
              marginBottom: 'var(--gap-4)',
            }}>
              И еще множество других призов: Apple Watch Ultra, XREAL Air 2 Ultra и многое другое
            </p>
            <Link href="/draws" className="btn-pill">
              Узнать подробнее
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterNew />
    </>
  )
}
