import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import Image from 'next/image'
import DeleteProductButton from './DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      variants: {
        include: {
          inventory: true,
        },
      },
    },
  })

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
            Управление товарами
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>
            Всего товаров: {products.length}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Добавить товар
        </Link>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gap: 20 }}>
        {products.map((product) => {
          const totalStock = product.variants.reduce(
            (sum, v) => sum + (v.inventory?.quantity || 0),
            0
          )

          return (
            <div
              key={product.id}
              className="tile"
              style={{
                padding: 24,
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 24,
                alignItems: 'center',
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'var(--surface)',
                }}
              >
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={120}
                    height={120}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40,
                    }}
                  >
                    📦
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h3 className="font-display" style={{ fontSize: 20 }}>
                    {product.name}
                  </h3>
                </div>

                <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12 }}>
                  {product.description?.substring(0, 100)}
                  {product.description && product.description.length > 100 ? '...' : ''}
                </div>

                <div style={{ display: 'flex', gap: 20, fontSize: 14 }}>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Вариантов:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{product.variants.length}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>На складе:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{totalStock} шт.</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Категория:</span>{' '}
                    <span style={{ fontWeight: 600 }}>
                      {product.category === 'CLOTHING' ? 'Одежда' : 'Добавки'}
                    </span>
                  </div>
                </div>

                {/* Seller Info */}
                {product.sellerName && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      background: 'var(--surface)',
                      borderRadius: 8,
                      fontSize: 13,
                      color: 'var(--muted)',
                    }}
                  >
                    Продавец: {product.sellerName} (ИНН: {product.sellerInn || 'не указан'})
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="btn btn-ghost"
                  style={{ fontSize: 14 }}
                >
                  Редактировать
                </Link>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </div>
          )
        })}

        {products.length === 0 && (
          <div className="tile" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <h3 className="font-display" style={{ fontSize: 24, marginBottom: 8 }}>
              Нет товаров
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
              Добавьте первый товар в каталог
            </p>
            <Link href="/admin/products/new" className="btn btn-primary">
              + Добавить товар
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
