import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'

// GET - получить список всех товаров
export async function GET() {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST - создать новый товар
export async function POST(request: NextRequest) {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const {
      name,
      category,
      description,
      images,
      material,
      brand,
      country,
      care,
      composition,
      sellerName,
      sellerInn,
      sellerOgrn,
      sellerAddress,
      variants,
    } = body

    // Генерируем slug из названия
    const baseSlug = name.toLowerCase()
      .replace(/[^а-яa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    let slug = baseSlug
    let counter = 1

    // Проверяем уникальность slug
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Создаём товар с вариантами и инвентарём
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        description,
        images,
        material,
        brand,
        country,
        care,
        composition,
        sellerName,
        sellerInn,
        sellerOgrn,
        sellerAddress,
        variants: {
          create: variants.map((v: any, index: number) => ({
            sku: `${slug}-${v.size.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
            size: v.size,
            price: v.price,
            weight: v.weight || null,
            length: v.length || null,
            width: v.width || null,
            height: v.height || null,
            inventory: {
              create: {
                quantity: v.stock || 0,
              },
            },
          })),
        },
      },
      include: {
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
