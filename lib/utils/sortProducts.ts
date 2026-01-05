type Product = any // Using any to avoid type conflicts with Prisma generated types

export function sortProducts(products: Product[], sortBy: string = 'new'): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'popular':
      // Sort by popularity (sales count or views, fallback to creation date)
      return sorted.sort((a, b) => {
        const salesA = a.salesCount || 0
        const salesB = b.salesCount || 0
        if (salesA !== salesB) return salesB - salesA
        return b.createdAt.getTime() - a.createdAt.getTime()
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
