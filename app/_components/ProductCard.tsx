import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  name: string
  price: string
  description?: string
  imageUrl: string
  href: string
  badge?: string
}

export default function ProductCard({ name, price, description, imageUrl, href, badge }: ProductCardProps) {
  return (
    <div className="card product-card" style={{
      padding: 'var(--gap-3)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}>
      {/* Product Image */}
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

        {/* Badge */}
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

      {/* Product Info */}
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
        marginBottom: 'var(--gap-2)',
        color: 'var(--text)',
      }}>
        {price}
      </div>

      <Link href={href} className="btn-pill" style={{ width: '100%', fontSize: '12px' }}>
        Подробнее
      </Link>
    </div>
  )
}
