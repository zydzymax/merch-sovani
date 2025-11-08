import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import AddToCartButton from '@/components/AddToCartButton'
import { chancesForProduct, getChancesLabel } from '@/lib/chances'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { inventory: true },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const defaultVariant = product.variants[0]
  const hasDiscount = defaultVariant?.compareAt && defaultVariant.compareAt > defaultVariant.price
  
  // Calculate chances
  const chances = chancesForProduct({ id: product.id, slug: product.slug, name: product.name })
  const chancesLabel = getChancesLabel(chances)

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
              <Link href="/catalog" className="hover:text-primary transition-colors">
                Каталог
              </Link>
              <Link href="/promo" className="hover:text-primary transition-colors">
                Акция
              </Link>
              <Link href="/draws" className="hover:text-primary transition-colors">
                Розыгрыши
              </Link>
              <Link href="/cart" className="hover:text-primary transition-colors">
                Корзина
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

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">
            Главная
          </Link>
          {' / '}
          <Link href="/catalog" className="hover:text-primary">
            Каталог
          </Link>
          {' / '}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              
              {/* Chances Badge */}
              <div className="absolute top-4 left-4 bg-brand-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 z-10">
                <span>🎁</span>
                <span>{chancesLabel}</span>
              </div>
              
              {hasDiscount && (
                <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                  -{Math.round(((defaultVariant.compareAt! - defaultVariant.price) / defaultVariant.compareAt!) * 100)}%
                </div>
              )}
            </div>

            {/* Additional images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`${product.name} ${idx + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(defaultVariant.price)}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-500 line-through">
                  {formatPrice(defaultVariant.compareAt!)}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <span className="inline-block bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                {product.category === 'CLOTHING' ? 'Одежда' : 'БАДы'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Описание</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && typeof product.features === 'object' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Характеристики</h2>
                <dl className="space-y-2">
                  {Object.entries(product.features as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="text-gray-600 capitalize">{key}:</dt>
                      <dd className="font-medium">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Варианты</h2>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{variant.name || `${variant.size} ${variant.color}`.trim()}</p>
                        <p className="text-sm text-gray-600">
                          В наличии: {variant.inventory?.quantity || 0} шт.
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(variant.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCartButton variantId={defaultVariant.id} productName={product.name} />

              <Link
                href="/catalog"
                className="block w-full text-center px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Продолжить покупки
              </Link>
            </div>

            {/* Promo Info */}
            <div className="mt-8 bg-brand-red/10 border-2 border-brand-red/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🎁</span>
                <div>
                  <h3 className="font-bold text-xl text-brand-dark mb-1">
                    Эта покупка = {chancesLabel} на призы!
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Оформив заказ с этим товаром, вы получаете <strong>{chancesLabel}</strong> на выигрыш iPhone 17 Pro, Apple Watch Ultra и XREAL Air 2 Ultra на общую сумму до 240 000 ₽!
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-red/20">
                <p className="text-xs text-gray-600">
                  💡 <strong>Правила акции:</strong> Пижама = 3 шанса • Футболка = 2 шанса • Остальные товары = 1 шанс
                </p>
              </div>
            </div>
          </div>
        </div>
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
