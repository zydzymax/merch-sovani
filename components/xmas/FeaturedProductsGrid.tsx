'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
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
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative">
      {/* Navigation Buttons - Hidden on mobile */}
      <button
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white border-2 border-brand-gold shadow-lg hover:bg-brand-gold hover:text-white transition-all"
        aria-label="Previous products"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white border-2 border-brand-gold shadow-lg hover:bg-brand-gold hover:text-white transition-all"
        aria-label="Next products"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
      {displayProducts.map((product) => {
        const variant = product.variants[0]
        const hasDiscount = variant?.compareAt && variant.compareAt > variant.price
        const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
        const chancesLabel = getChancesLabel(chances)

        return (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group block flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[280px] snap-start"
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
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 280px"
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

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
