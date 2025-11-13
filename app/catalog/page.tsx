import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import { chancesForProduct, getChancesLabel } from '@/lib/chances'
import { sortProducts } from '@/lib/utils/sortProducts'
import { SortDropdown } from '@/components/SortDropdown'
import ProductCard from '@/app/_components/ProductCard'

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
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-5)' }}>
          <h1 className="font-display" style={{ fontSize: 'var(--h2)' }}>Каталог товаров</h1>
          {FEATURE_SORT && <SortDropdown />}
        </div>

        {/* Clothing */}
        {clothingProducts.length > 0 && (
          <div style={{ marginBottom: 'var(--gap-6)' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--h3)', marginBottom: 'var(--gap-4)' }}>
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
                const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
                const chancesLabel = getChancesLabel(chances)

                return (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={price}
                    description={product.description || undefined}
                    imageUrl={product.images[0] || '/placeholder.png'}
                    href={`/product/${product.slug}`}
                    badge={`🎁 ${chancesLabel}`}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Supplements */}
        {supplementsProducts.length > 0 && (
          <div>
            <h2 className="font-display" style={{ fontSize: 'var(--h3)', marginBottom: 'var(--gap-4)' }}>
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
                const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
                const chancesLabel = getChancesLabel(chances)

                return (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={price}
                    description={product.description || undefined}
                    imageUrl={product.images[0] || '/placeholder.png'}
                    href={`/product/${product.slug}`}
                    badge={`🎁 ${chancesLabel}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
