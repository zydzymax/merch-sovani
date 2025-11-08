import { chancesForProduct } from '@/lib/chances'

type Product = any // Using any to avoid type conflicts with Prisma generated types

export function sortProducts(products: Product[], sortBy: string = 'new'): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'chances_desc':
      return sorted.sort((a, b) => {
        const chancesA = chancesForProduct({ id: a.id, slug: a.slug, name: a.name })
        const chancesB = chancesForProduct({ id: b.id, slug: b.slug, name: b.name })
        return chancesB - chancesA
      })

    case 'price_asc':
      return sorted.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0
        const priceB = b.variants[0]?.price || 0
        return priceA - priceB
      })

    case 'price_desc':
      return sorted.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0
        const priceB = b.variants[0]?.price || 0
        return priceB - priceA
      })

    case 'new':
    default:
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}
