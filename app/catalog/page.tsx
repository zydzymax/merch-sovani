import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import { chancesForProduct, getChancesLabel } from '@/lib/chances'

export default async function CatalogPage() {
  // Fetch all active products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { take: 1, orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  // Group by category
  const clothingProducts = products.filter((p) => p.category === 'CLOTHING')
  const supplementsProducts = products.filter((p) => p.category === 'SUPPLEMENTS')

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
              <Link href="/catalog" className="text-primary font-medium">
                Каталог
              </Link>
              <Link href="/promo" className="hover:text-primary transition-colors">
                Акция
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

      {/* Page content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Каталог товаров</h1>

        {/* Clothing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-6 text-gray-800">Одежда</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clothingProducts.map((product) => {
              const variant = product.variants[0]
              const hasDiscount = variant?.compareAt && variant.compareAt > variant.price
              const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
              const chancesLabel = getChancesLabel(chances)

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
                        No Image
                      </div>
                    )}
                    
                    {/* Chances Badge */}
                    <div className="absolute top-3 left-3 bg-brand-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                      <span>🎁</span>
                      <span>{chancesLabel}</span>
                    </div>
                    
                    {hasDiscount && (
                      <div className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        -{Math.round(((variant.compareAt! - variant.price) / variant.compareAt!) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-base font-medium text-gray-900">
                      {product.name}
                    </h3>
                    {variant && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(variant.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(variant.compareAt!)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Supplements Section */}
        {supplementsProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-800">БАДы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {supplementsProducts.map((product) => {
                const variant = product.variants[0]
                const hasDiscount = variant?.compareAt && variant.compareAt > variant.price
                const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
                const chancesLabel = getChancesLabel(chances)

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {/* Chances Badge */}
                      <div className="absolute top-3 left-3 bg-brand-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                        <span>🎁</span>
                        <span>{chancesLabel}</span>
                      </div>
                      
                      {hasDiscount && (
                        <div className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                          -{Math.round(((variant.compareAt! - variant.price) / variant.compareAt!) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-base font-medium text-gray-900">
                        {product.name}
                      </h3>
                      {variant && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(variant.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(variant.compareAt!)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
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
