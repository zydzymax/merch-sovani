export interface Product {
  id?: string
  slug?: string
  name?: string
  title?: string
}

export function chancesForProduct(p: Product): number {
  const title = (p.title || p.name || '').toLowerCase()
  const slug = (p.slug || '').toLowerCase()
  
  // Check for pajama (3 chances)
  const isPajama = 
    title.includes('пижам') || 
    title.includes('pajama') || 
    title.includes('pijama') ||
    slug.includes('pajama') || 
    slug.includes('pijama') ||
    title.includes('sovani')
  
  if (isPajama) return 3
  
  // Check for t-shirt oversize (2 chances)
  const isTshirt = 
    title.includes('футболк') || 
    title.includes('tshirt') || 
    title.includes('t-shirt') ||
    slug.includes('tshirt') ||
    slug.includes('futbolka') ||
    title.includes('oversize') ||
    title.includes('оверсайз')
  
  if (isTshirt) return 2
  
  // All other products = 1 chance
  return 1
}

export function getChancesLabel(chances: number): string {
  if (chances === 1) return '+1 шанс'
  if (chances >= 2 && chances <= 4) return `+${chances} шанса`
  return `+${chances} шансов`
}

export function getTotalChancesLabel(total: number): string {
  if (total === 1) return '1 шанс'
  if (total >= 2 && total <= 4) return `${total} шанса`
  return `${total} шансов`
}
