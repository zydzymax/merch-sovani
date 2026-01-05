import { prisma } from '@/lib/db/prisma'

/**
 * Маппинг товаров брелоков на количество промокодов
 * 1 брелок = 1 промокод
 * 2 брелока = 3 промокода
 * 3 брелока = 5 промокодов
 */
const KEYCHAIN_PROMO_MAP: Record<string, number> = {
  '1-brelok': 1,
  '2-breloka': 3,
  '3-breloka': 5,
}

interface PromoCodeResult {
  totalCodes: number
  products: { slug: string; name: string; codes: number }[]
}

/**
 * Определяет количество промокодов для заказа на основе товаров-брелоков
 */
export async function getPromoCodesCountForOrder(orderId: string): Promise<PromoCodeResult> {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  })

  let totalCodes = 0
  const products: { slug: string; name: string; codes: number }[] = []

  for (const item of orderItems) {
    const slug = item.variant.product.slug
    const codesForProduct = KEYCHAIN_PROMO_MAP[slug]

    if (codesForProduct) {
      // Умножаем на количество товара в заказе
      const codes = codesForProduct * item.quantity
      totalCodes += codes
      products.push({
        slug,
        name: item.variant.product.name,
        codes,
      })
    }
  }

  // Если нет брелоков, но есть участие в акции - даём 1 код по умолчанию
  if (totalCodes === 0) {
    totalCodes = 1
  }

  return { totalCodes, products }
}
