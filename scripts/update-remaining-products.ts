import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Обновляем футболку
  await prisma.product.update({
    where: { slug: 'futbolka-oversize-nikita-minchenko' },
    data: {
      images: ['/assets/xmas/minchenko-tshirt.png']
    }
  })
  console.log('✅ Обновлена футболка: futbolka-oversize-nikita-minchenko')

  // Обновляем пижаму
  await prisma.product.update({
    where: { slug: 'pizhama-zhenskaya-sovani' },
    data: {
      images: ['/assets/xmas/sovani-pajama.jpg', '/assets/xmas/pajama.jpeg']
    }
  })
  console.log('✅ Обновлена пижама: pizhama-zhenskaya-sovani')

  console.log('\n🎉 Все товары теперь используют реальные фотографии!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
