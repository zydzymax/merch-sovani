import { PrismaClient, ProductCategory, DrawStatus, TicketStatus } from '@prisma/client'
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
    prisma.ticket.deleteMany(),
    prisma.ticketTier.deleteMany(),
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

  // Create products (6 demo products)
  const products = await Promise.all([
    // 1. Футболка
    prisma.product.create({
      data: {
        name: 'Хлопковая футболка Premium',
        slug: 'cotton-premium-tshirt',
        description:
          'Классическая футболка из 100% органического хлопка. Комфортная посадка, дышащая ткань, идеально для повседневной носки.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        ],
        features: {
          material: '100% органический хлопок',
          care: 'Машинная стирка при 30°C',
          country: 'Турция',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'TSHIRT-WHITE-S',
              name: 'Белая S',
              size: 'S',
              color: 'Белый',
              price: 199000, // 1990 руб
              compareAt: 249000,
              images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
              sortOrder: 1,
              isActive: true,
              inventory: {
                create: { quantity: 50, reserved: 0 },
              },
            },
            {
              sku: 'TSHIRT-WHITE-M',
              name: 'Белая M',
              size: 'M',
              color: 'Белый',
              price: 199000,
              compareAt: 249000,
              images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
              sortOrder: 2,
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
            {
              sku: 'TSHIRT-BLACK-M',
              name: 'Черная M',
              size: 'M',
              color: 'Черный',
              price: 199000,
              compareAt: 249000,
              images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
              sortOrder: 3,
              isActive: true,
              inventory: {
                create: { quantity: 75, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 2. Лонгслив
    prisma.product.create({
      data: {
        name: 'Лонгслив оверсайз',
        slug: 'oversized-longsleeve',
        description: 'Стильный оверсайз лонгслив для создания модного casual образа. Мягкая ткань, свободный крой.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        ],
        isFeatured: false,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'LONG-BEIGE-M',
              name: 'Бежевый M',
              size: 'M',
              color: 'Бежевый',
              price: 299000,
              images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
              isActive: true,
              inventory: {
                create: { quantity: 30, reserved: 0 },
              },
            },
            {
              sku: 'LONG-BEIGE-L',
              name: 'Бежевый L',
              size: 'L',
              color: 'Бежевый',
              price: 299000,
              images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
              isActive: true,
              inventory: {
                create: { quantity: 40, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 3. Худи
    prisma.product.create({
      data: {
        name: 'Худи с капюшоном Premium',
        slug: 'premium-hoodie',
        description:
          'Теплое худи из плотного трикотажа. Удобный капюшон, карман-кенгуру, рибаная отделка.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        ],
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'HOODIE-GRAY-M',
              name: 'Серое M',
              size: 'M',
              color: 'Серый',
              price: 449000,
              compareAt: 599000,
              images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
              isActive: true,
              inventory: {
                create: { quantity: 60, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 4. Штаны
    prisma.product.create({
      data: {
        name: 'Спортивные брюки комфорт',
        slug: 'comfort-sport-pants',
        description: 'Удобные спортивные брюки для активного отдыха и прогулок.',
        category: ProductCategory.CLOTHING,
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
        ],
        isActive: true,
        variants: {
          create: [
            {
              sku: 'PANTS-BLACK-M',
              name: 'Черные M',
              size: 'M',
              color: 'Черный',
              price: 349000,
              images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
              isActive: true,
              inventory: {
                create: { quantity: 45, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 5. БАД 1
    prisma.product.create({
      data: {
        name: 'Витамин C + Цинк',
        slug: 'vitamin-c-zinc',
        description:
          'Комплекс для поддержки иммунитета. 60 капсул. БАД не является лекарственным средством.',
        category: ProductCategory.SUPPLEMENTS,
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
        ],
        features: {
          dosage: '1 капсула в день',
          capsules: 60,
          warning: 'Перед применением проконсультируйтесь со специалистом',
        },
        isActive: true,
        variants: {
          create: [
            {
              sku: 'SUPPL-VIT-C-60',
              price: 79900,
              images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
              isActive: true,
              inventory: {
                create: { quantity: 100, reserved: 0 },
              },
            },
          ],
        },
      },
    }),

    // 6. БАД 2
    prisma.product.create({
      data: {
        name: 'Омега-3 Premium',
        slug: 'omega-3-premium',
        description:
          'Высококачественная Омега-3 из дикой рыбы. 90 капсул. БАД не является лекарственным средством.',
        category: ProductCategory.SUPPLEMENTS,
        images: [
          'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800',
        ],
        features: {
          dosage: '2 капсулы в день',
          capsules: 90,
          warning: 'Перед применением проконсультируйтесь со специалистом',
        },
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            {
              sku: 'SUPPL-OMEGA3-90',
              price: 129900,
              compareAt: 159900,
              images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800'],
              isActive: true,
              inventory: {
                create: { quantity: 80, reserved: 0 },
              },
            },
          ],
        },
      },
    }),
  ])
  console.log('✅ Created', products.length, 'products')

  // Create ticket tiers (3 tiers)
  const tiers = await Promise.all([
    prisma.ticketTier.create({
      data: {
        name: 'Стандарт',
        description: 'Базовый доступ к ивенту',
        price: 199000,
        perks: ['Вход на мероприятие', 'Приветственный набор', '1 шанс в розыгрыше'],
        entryWeight: 1,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.ticketTier.create({
      data: {
        name: 'VIP',
        description: 'Расширенный доступ',
        price: 499000,
        perks: [
          'Вход на мероприятие',
          'VIP-зона',
          'Meet & Greet',
          'Эксклюзивный мерч',
          '3 шанса в розыгрыше',
        ],
        entryWeight: 3,
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.ticketTier.create({
      data: {
        name: 'Premium',
        description: 'Максимальные привилегии',
        price: 999000,
        perks: [
          'Все привилегии VIP',
          'Backstage-доступ',
          'Персональный ассистент',
          'Приоритетная регистрация',
          '5 шансов в розыгрыше',
        ],
        entryWeight: 5,
        sortOrder: 3,
        isActive: true,
      },
    }),
  ])
  console.log('✅ Created', tiers.length, 'ticket tiers')

  // Create prizes (4 prizes)
  const prizes = await Promise.all([
    prisma.prize.create({
      data: {
        name: 'iPhone 16 Pro Max',
        description: 'Новейший смартфон Apple',
        image: 'https://images.unsplash.com/photo-1696446702797-60d56d98c076?w=800',
        value: 15000000,
        sortOrder: 1,
      },
    }),
    prisma.prize.create({
      data: {
        name: 'Сертификат 50 000 ₽',
        description: 'На покупку товаров в нашем магазине',
        image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
        value: 5000000,
        sortOrder: 2,
      },
    }),
    prisma.prize.create({
      data: {
        name: 'AirPods Pro',
        description: 'Беспроводные наушники Apple',
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
        value: 2500000,
        sortOrder: 3,
      },
    }),
    prisma.prize.create({
      data: {
        name: 'Набор одежды Premium',
        description: 'Эксклюзивный набор из 5 вещей',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
        value: 1500000,
        sortOrder: 4,
      },
    }),
  ])
  console.log('✅ Created', prizes.length, 'prizes')

  // Create active draw
  const now = new Date()
  const endsAt = new Date(process.env.PROMO_ENDS_AT || '2025-12-31T23:59:59Z')
  const draw = await prisma.draw.create({
    data: {
      name: 'Новогодний розыгрыш 2025',
      description:
        'Главный розыгрыш года! Участвуй в акции "1 покупка = 1 шанс" и выиграй один из призов.',
      prizeId: prizes[0].id,
      status: DrawStatus.ACTIVE,
      startsAt: now,
      endsAt: endsAt,
      metadata: {
        rules: 'Полные правила см. на странице /legal/promo-rules',
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
        key: 'entry_weights',
        value: {
          order: 1,
          ticket_standard: 1,
          ticket_vip: 3,
          ticket_premium: 5,
          referral: 1,
        },
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
