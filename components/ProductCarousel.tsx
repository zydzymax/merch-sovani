'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductCarouselProps {
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

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(max-width: 767px)': {
        // Mobile: show 2 items per view
        slidesToScroll: 1,
      },
      '(min-width: 768px)': {
        // Desktop: auto-fit based on container
        slidesToScroll: 1,
      },
    },
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {products.map((product) => {
            const variant = product.variants[0]
            const hasDiscount = variant?.compareAt && variant.compareAt > variant.price

            return (
              <div
                key={product.id}
                className="flex-[0_0_50%] min-w-0 pl-4 md:flex-[0_0_33.333%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="group block h-full"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                          No Image
                        </div>
                      )}
                      {hasDiscount && (
                        <div className="absolute right-2 top-2 rounded-full bg-[#9D2A43] px-3 py-1 text-xs font-semibold text-white">
                          -{Math.round(((variant.compareAt! - variant.price) / variant.compareAt!) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 md:text-base">
                        {product.name}
                      </h3>

                      <div className="mt-auto">
                        {variant && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#9D2A43] md:text-xl">
                              {(variant.price / 100).toLocaleString('ru-RU')} ₽
                            </span>
                            {hasDiscount && (
                              <span className="text-sm text-gray-500 line-through">
                                {(variant.compareAt! / 100).toLocaleString('ru-RU')} ₽
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl disabled:opacity-50 md:p-3"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800 md:h-6 md:w-6" />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl disabled:opacity-50 md:p-3"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 text-gray-800 md:h-6 md:w-6" />
        </button>
      )}
    </div>
  )
}
