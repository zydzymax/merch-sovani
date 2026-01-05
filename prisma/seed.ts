import { PrismaClient, ProductCategory, DrawStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.referralHit.deleteMany(),
    prisma.referralLink.deleteMany(),
    prisma.entry.deleteMany(),
    prisma.draw.deleteMany(),
    prisma.prize.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.inventory.deleteMany(),
    prisma.variant.deleteMany(),
    prisma.product.deleteMany(),
    prisma.address.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.setting.deleteMany(),
  ])

  console.log('✅ Cleared existing data')

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!@#', 10)
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@fashion.local',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 10)
  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.local',
      password: customerPassword,
      name: 'Test Customer',
      phone: '+79991234567',
      role: 'CUSTOMER',
    },
  })
  console.log('✅ Created test customer:', customer.email)

  // Create 6 products (4 from Nikita Minchenko, 2 from SoVAni)
  const products = await Promise.all([
    // 1. Брелок от Никиты Минченко (исправлено)
    prisma.product.create({
      data: {
        name: 'Брелок Никита Минченко',
        slug: 'brelok-nikita-minchenko',
        description:
          'Стильный брелок от блогера Никиты Минченко из прочных материалов. Компактный и практичный аксессуар для ключей.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1600',
        ],
        features: {
          material: 'Металл, кожа',
          care: 'Протирать сухой тканью',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'BRELOK-MINCHENKO-01',
              name: 'Стандартный',
              price: 150000, // 1500 руб
              images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1600'],
              sortOrder: 1,
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 2. Значок SoVAni (оставить как есть)
    prisma.product.create({
      data: {
        name: 'Значок Никита Минченко',
        slug: 'znachok-nikita-minchenko',
        description: 'Коллекционный значок SoVAni с фирменным логотипом. Металлическая застежка, яркий дизайн.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600',
        ],
        features: {
          material: 'Металл, эмаль',
          size: '3x3 см',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'BADGE-SOVANI-01',
              name: 'Стандартный',
              price: 150000, // 1500 руб
              images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600'],
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 3. Стикер от Никиты Минченко (исправлено)
    prisma.product.create({
      data: {
        name: 'Стикер Никита Минченко',
        slug: 'stiker-nikita-minchenko',
        description:
          'Водостойкая виниловая наклейка от блогера Никиты Минченко. Идеально для ноутбука, телефона или любой гладкой поверхности.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1594587411474-18400cd64c8e?q=80&w=1600',
        ],
        features: {
          material: 'Виниловая пленка',
          waterproof: 'Водостойкая',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'STICKER-MINCHENKO-01',
              name: 'Стандартный',
              price: 150000, // 1500 руб
              images: ['https://images.unsplash.com/photo-1594587411474-18400cd64c8e?q=80&w=1600'],
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 4. Шеврон от Никиты Минченко (исправлено)
    prisma.product.create({
      data: {
        name: 'Шеврон Никита Минченко',
        slug: 'shevron-nikita-minchenko',
        description: 'Вышитый шеврон от блогера Никиты Минченко. Можно пришить или приклеить на одежду, рюкзак или сумку.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1600',
        ],
        features: {
          material: 'Вышивка на ткани',
          mounting: 'Пришивной или термоклеевой',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'PATCH-MINCHENKO-01',
              name: 'Стандартный',
              price: 200000, // 2000 руб
              images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1600'],
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 5. Футболка оверсайз от Никиты Минченко (исправлено)
    prisma.product.create({
      data: {
        name: 'Футболка оверсайз Никита Минченко',
        slug: 'futbolka-oversize-nikita-minchenko',
        description: 'Стильная футболка оверсайз от блогера Никиты Минченко из премиального хлопка. Свободный крой, максимальный комфорт.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1600',
        ],
        features: {
          material: '100% премиальный хлопок',
          fit: 'Oversized',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'TSHIRT-OS-MINCHENKO-01',
              name: 'Оверсайз',
              price: 250000, // 2500 руб
              images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1600'],
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 6. Пижама женская SoVAni (оставить как есть)
    prisma.product.create({
      data: {
        name: 'Пижама женская SoVAni',
        slug: 'pizhama-zhenskaya-sovani',
        description: 'Уютная женская пижама SoVAni из мягкого трикотажа. Комплект из кофты и брюк для максимального комфорта.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1609873814058-a8928924184a?q=80&w=1600',
        ],
        features: {
          includes: 'Кофта + брюки',
          material: 'Мягкий трикотаж',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'PAJAMA-SOVANI-01',
              name: 'Стандартный',
              price: 300000, // 3000 руб
              images: ['https://images.unsplash.com/photo-1609873814058-a8928924184a?q=80&w=1600'],
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),
  ])
  console.log('✅ Created', products.length, 'products')

  // Create prizes (3 prizes ONLY)
  const prizes = await Promise.all([
    prisma.prize.create({
      data: {
        name: 'iPhone 17 Pro',
        description: 'Новейший смартфон Apple iPhone 17 Pro',
        image: 'https://images.unsplash.com/photo-1696446702797-60d56d98c076?q=80&w=800',
        value: 15000000, // 150 тыс руб
        sortOrder: 1,
      },
    }),
    prisma.prize.create({
      data: {
        name: 'Apple Watch Ultra 3',
        description: 'Умные часы Apple Watch Ultra 3',
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800',
        value: 5000000, // 50 тыс руб
        sortOrder: 2,
      },
    }),
    prisma.prize.create({
      data: {
        name: 'Xreal One',
        description: 'AR очки нового поколения Xreal One',
        image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?q=80&w=800',
        value: 4000000, // 40 тыс руб
        sortOrder: 3,
      },
    }),
  ])
  console.log('✅ Created', prizes.length, 'prizes')

  // Create active draw
  const now = new Date()
  const endsAt = new Date(process.env.PROMO_ENDS_AT || '2025-12-31T23:59:59Z')
  const draw = await prisma.draw.create({
    data: {
      name: 'Еженедельный розыгрыш призов SoVAni',
      description:
        'Участвуй в акции "1 покупка = 1 шанс". Каждую неделю разыгрываем призы: iPhone 17 Pro, Apple Watch Ultra 3 и Xreal One!',
      prizeId: prizes[0].id, // iPhone 17 Pro - главный приз
      status: DrawStatus.ACTIVE,
      startsAt: now,
      endsAt: endsAt,
      metadata: {
        rules: 'Полные правила см. на странице /legal/promo-rules',
        drawFrequency: 'weekly',
        prizesOrder: 'iPhone 17 Pro, Apple Watch Ultra 3, Xreal One разыгрываются еженедельно.',
      },
    },
  })
  console.log('✅ Created active draw:', draw.name)

  // Create referral link for test customer
  const refLink = await prisma.referralLink.create({
    data: {
      code: 'TEST2025',
      ownerId: customer.id,
      utm: {
        source: 'referral',
        medium: 'customer',
        campaign: 'test',
      },
      isActive: true,
    },
  })
  console.log('✅ Created referral link:', refLink.code)

  // Create settings
  await prisma.setting.createMany({
    data: [
      {
        key: 'promo_active',
        value: true,
      },
      {
        key: 'promo_ends_at',
        value: endsAt.toISOString(),
      },
      {
        key: 'shipping_pochta_rf',
        value: {
          enabled: true,
          price: 0,
          name: 'Почта РФ (бесплатно)',
        },
      },
    ],
  })
  console.log('✅ Created settings')

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
