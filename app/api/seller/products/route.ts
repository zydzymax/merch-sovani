import { NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    logger.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, images, category } = body

    if (!name || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category: category, // CLOTHING or SUPPLEMENTS
        images: images || [],
        sellerId: session.user.id,
        isActive: false, // По умолчанию не активен, админ должен проверить
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    logger.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
