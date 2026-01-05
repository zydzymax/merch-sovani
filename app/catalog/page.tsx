import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'
import PajamaPromo from '@/app/_components/PajamaPromo'
import TshirtCatalog from '@/app/_components/TshirtCatalog'
import ProductCarousel from '@/app/_components/ProductCarousel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { take: 1, orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  // Filter: only keychains and stickers (exclude t-shirts, pajamas, badges)
  const accessories = products.filter((p) => {
    const name = p.name.toLowerCase()
    const slug = p.slug.toLowerCase()
    return !name.includes('футболка') &&
           !name.includes('пижама') &&
           !name.includes('значок') &&
           !slug.includes('znachok')
  })

  // Sort: keychains first (by name containing "брелок")
  const sortedProducts = [...accessories].sort((a, b) => {
    const aIsKeychain = a.name.toLowerCase().includes('брелок')
    const bIsKeychain = b.name.toLowerCase().includes('брелок')
    if (aIsKeychain && !bIsKeychain) return -1
    if (!aIsKeychain && bIsKeychain) return 1
    return 0
  })

  const carouselProducts = sortedProducts.map((product) => {
    const variant = product.variants[0]
    return {
      id: product.id,
      name: product.name,
      price: variant?.price ? formatPrice(variant.price) : '0 ₽',
      imageUrl: product.images[0] || '/placeholder.png',
      href: `/product/${product.slug}`,
      description: product.description || undefined,
    }
  })

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />
      <section className="section">
        <div className="container">
          <h1 className="font-display" style={{ fontSize: 'var(--h2)', textAlign: 'center', marginBottom: 'var(--gap-5)' }}>
            Каталог товаров
          </h1>
        </div>
        {/* Products Carousel - outside container for full-width scroll */}
        <ProductCarousel products={carouselProducts} title="Аксессуары" />
      </section>

      {/* Pajama Promo - link to Ozon */}
      <PajamaPromo />

      {/* T-shirts - order form only */}
      <TshirtCatalog />

      <BigFooter />
    </div>
  )
}
