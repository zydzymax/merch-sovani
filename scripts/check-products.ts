import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    select: {
      slug: true,
      name: true,
      images: true
    }
  })

  console.log('\n📦 Featured Products:\n')
  products.forEach(p => {
    console.log(`${p.name} (${p.slug})`)
    console.log(`  Images: ${p.images.join(', ')}`)
    console.log('')
  })
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
