import { logger } from '@/lib/utils/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'

// GET - получить конкретный товар
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform variants to include stock from inventory
    const transformedProduct = {
      ...product,
      variants: product.variants.map((v) => ({
        ...v,
        stock: v.inventory?.quantity || 0,
      })),
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    logger.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT - обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Удаляем старые инвентарь и варианты
    const existingVariants = await prisma.variant.findMany({
      where: { productId: params.id },
      select: { id: true },
    })

    for (const variant of existingVariants) {
      await prisma.inventory.deleteMany({
        where: { variantId: variant.id },
      })
    }

    await prisma.variant.deleteMany({
      where: { productId: params.id },
    })

    // Обновляем товар и создаём новые варианты с инвентарём
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
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
        variants: {
          create: variants.map((v: any, index: number) => ({
            sku: v.sku || `${name.toLowerCase().replace(/\s+/g, '-')}-${v.size.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
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

    return NextResponse.json(product)
  } catch (error) {
    logger.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE - удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    // Сначала удаляем все варианты
    await prisma.variant.deleteMany({
      where: { productId: params.id },
    })

    // Затем удаляем сам товар
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
