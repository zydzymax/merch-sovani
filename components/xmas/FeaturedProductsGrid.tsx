'use client'

import Image from 'next/image'
import Link from 'next/link'
import { chancesForProduct, getChancesLabel } from '@/lib/chances'

interface FeaturedProductsGridProps {
  products: Array<{
    id: string
    name: string
    slug: string
    images: string[]
    variants: Array<{
      price: number
      compareAt?: number | null
    }>
  }>
}

export function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  const displayProducts = products.slice(0, 4)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayProducts.map((product) => {
        const variant = product.variants[0]
        const hasDiscount = variant?.compareAt && variant.compareAt > variant.price
        const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
        const chancesLabel = getChancesLabel(chances)

        return (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group block"
          >
            <div className="bg-brand-cream rounded-2xl border-2 border-brand-gold/20 overflow-hidden shadow-md hover:shadow-2xl hover:border-brand-gold transition-all duration-300 hover:scale-105 h-full flex flex-col">
              {/* Product Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-cream text-brand-dark/30">
                    No Image
                  </div>
                )}
                
                {/* Chances Badge */}
                <div className="absolute top-3 left-3 bg-brand-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <span>🎁</span>
                  <span>{chancesLabel}</span>
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute right-3 top-3 rounded-full bg-brand-forest px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    -{Math.round(((variant.compareAt! - variant.price) / variant.compareAt!) * 100)}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="mb-3 line-clamp-2 text-base font-semibold text-brand-dark">
                  {product.name}
                </h3>

                <div className="mt-auto">
                  {variant && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-brand-red">
                        {(variant.price / 100).toLocaleString('ru-RU')} ₽
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-brand-dark/50 line-through">
                          {(variant.compareAt! / 100).toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
