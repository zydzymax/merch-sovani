'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: string
  imageUrl: string
  href: string
  description?: string
}

interface ProductCarouselProps {
  products: Product[]
  title?: string
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (products.length === 0) return null

  return (
    <div style={{ marginBottom: 'var(--gap-5)' }}>
      {title && (
        <h2 className="font-display" style={{
          fontSize: 'var(--h3)',
          marginBottom: 'var(--gap-4)',
          textAlign: 'center'
        }}>
          {title}
        </h2>
      )}

      <div style={{ position: 'relative' }}>
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="carousel-arrow carousel-arrow-left"
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--ring)',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'opacity 0.2s',
          }}
          aria-label="Назад"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="carousel-arrow carousel-arrow-right"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--ring)',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'opacity 0.2s',
          }}
          aria-label="Вперёд"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Carousel container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="hide-scrollbar"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="tile"
              style={{
                flex: '0 0 auto',
                width: 'min(280px, 75vw)',
                scrollSnapAlign: 'start',
                textDecoration: 'none',
                color: 'inherit',
                padding: 16,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'var(--surface-2)',
                marginBottom: 12,
              }}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="280px"
                />
              </div>
              <h3 className="font-display" style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {product.name}
              </h3>
              {product.description && (
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {product.description}
                </p>
              )}
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--accent)',
              }}>
                {product.price}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 640px) {
          .carousel-arrow {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
