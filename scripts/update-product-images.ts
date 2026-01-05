import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Обновляем товары реальными фотографиями

  // Аксессуары (брелок, стикер, шеврон, значок) - используем accessories.png
  const accessoryProducts = [
    'brelok-nikita-minchenko',
    'stiker-nikita-minchenko',
    'shevron-nikita-minchenko',
    'znachok-nikita-minchenko'
  ]

  for (const slug of accessoryProducts) {
    await prisma.product.update({
      where: { slug },
      data: {
        images: ['/assets/xmas/accessories.png']
      }
    })
    console.log(`✅ Обновлен товар: ${slug}`)
  }

  // Футболка - используем minchenko-tshirt.png
  const tshirtSlugs = ['futbolka-nikita-minchenko', 'futbolka-sovani-classic']
  for (const slug of tshirtSlugs) {
    try {
      await prisma.product.update({
        where: { slug },
        data: {
          images: ['/assets/xmas/minchenko-tshirt.png']
        }
      })
      console.log(`✅ Обновлена футболка: ${slug}`)
    } catch (e) {
      console.log(`⚠️ Товар ${slug} не найден, пропускаем`)
    }
  }

  // Пижама - используем pajama.jpeg и sovani-pajama.jpg
  const pajamaSlugs = ['pizhama-sovani-premium', 'pizhama-sovani']
  for (const slug of pajamaSlugs) {
    try {
      await prisma.product.update({
        where: { slug },
        data: {
          images: ['/assets/xmas/sovani-pajama.jpg', '/assets/xmas/pajama.jpeg']
        }
      })
      console.log(`✅ Обновлена пижама: ${slug}`)
    } catch (e) {
      console.log(`⚠️ Товар ${slug} не найден, пропускаем`)
    }
  }

  console.log('\n🎉 Все изображения товаров обновлены!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
