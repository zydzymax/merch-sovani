import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import { chancesForProduct, getChancesLabel } from '@/lib/chances'
import { sortProducts } from '@/lib/utils/sortProducts'
import { SortDropdown } from '@/components/SortDropdown'
import ProductCard from '@/app/_components/ProductCard'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

const FEATURE_SORT = process.env.NEXT_PUBLIC_FEATURE_SORT_FILTER === 'true'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { sort?: string }
}) {
  let products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { take: 1, orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  if (FEATURE_SORT && searchParams.sort) {
    products = sortProducts(products, searchParams.sort)
  }

  const clothingProducts = products.filter((p) => p.category === 'CLOTHING')
  const supplementsProducts = products.filter((p) => p.category === 'SUPPLEMENTS')

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />
      <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-5)', flexWrap: 'wrap', gap: 16 }}>
          <h1 className="font-display" style={{ fontSize: 'var(--h2)', textAlign: 'center', flex: '1 1 100%' }}>Каталог товаров</h1>
          {FEATURE_SORT && <SortDropdown />}
        </div>

        {/* Clothing */}
        {clothingProducts.length > 0 && (
          <div style={{ marginBottom: 'var(--gap-6)' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--h3)', marginBottom: 'var(--gap-4)', textAlign: 'center' }}>
              Одежда
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--gap-3)',
            }}>
              {clothingProducts.map((product) => {
                const variant = product.variants[0]
                const price = variant?.price ? formatPrice(variant.price) : '0 ₽'
                const isKeychain = product.slug === 'keychain' || product.name.toLowerCase().includes('брелок')
                const badge = isKeychain ? '🎁 1 брелок = 1 шанс на iPhone' : undefined

                return (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={price}
                    description={product.description || undefined}
                    imageUrl={product.images[0] || '/placeholder.png'}
                    href={`/product/${product.slug}`}
                    badge={badge}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Supplements */}
        {supplementsProducts.length > 0 && (
          <div>
            <h2 className="font-display" style={{ fontSize: 'var(--h3)', marginBottom: 'var(--gap-4)', textAlign: 'center' }}>
              БАДы
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--gap-3)',
            }}>
              {supplementsProducts.map((product) => {
                const variant = product.variants[0]
                const price = variant?.price ? formatPrice(variant.price) : '0 ₽'
                const isKeychain = product.slug === 'keychain' || product.name.toLowerCase().includes('брелок')
                const badge = isKeychain ? '🎁 1 брелок = 1 шанс на iPhone' : undefined

                return (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={price}
                    description={product.description || undefined}
                    imageUrl={product.images[0] || '/placeholder.png'}
                    href={`/product/${product.slug}`}
                    badge={badge}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
      <BigFooter />
    </div>
  )
}
