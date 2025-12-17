'use client'

import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  name: string
  price: string
  description?: string
  imageUrl: string
  href: string
  badge?: string
  ozonLink?: string
  outOfStock?: boolean
}

export default function ProductCard({ name, price, description, imageUrl, href, badge, ozonLink, outOfStock }: ProductCardProps) {
  if (outOfStock && ozonLink) {
    return (
      <div style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card product-card" style={{
          padding: 'var(--gap-3)',
          transition: 'all 0.2s ease',
        }}>
          <div style={{
            position: 'relative',
            aspectRatio: '1/1',
            background: 'var(--bg)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--gap-2)',
            overflow: 'hidden',
          }}>
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover', opacity: 0.7 }}
            />
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#f59e0b',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              Нет в наличии
            </div>
          </div>

          <h3 className="font-display" style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: 'var(--gap-1)',
            lineHeight: 1.3,
          }}>
            {name}
          </h3>

          {description && (
            <p style={{
              fontSize: '12px',
              color: 'var(--muted)',
              marginBottom: 'var(--gap-2)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {description}
            </p>
          )}

          <div style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--muted)',
            textDecoration: 'line-through',
            marginBottom: '12px',
          }}>
            {price}
          </div>

          <a 
            href={ozonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#005bff',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Заказать на Ozon
          </a>
        </div>
      </div>
    )
  }

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card product-card" style={{
        padding: 'var(--gap-3)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}>
        <div style={{
          position: 'relative',
          aspectRatio: '1/1',
          background: 'var(--bg)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--gap-2)',
          overflow: 'hidden',
        }}>
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          {badge && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'var(--accent)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {badge}
            </div>
          )}
        </div>

        <h3 className="font-display" style={{
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: 'var(--gap-1)',
          lineHeight: 1.3,
        }}>
          {name}
        </h3>

        {description && (
          <p style={{
            fontSize: '12px',
            color: 'var(--muted)',
            marginBottom: 'var(--gap-2)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {description}
          </p>
        )}

        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          {price}
        </div>
      </div>
    </Link>
  )
}
