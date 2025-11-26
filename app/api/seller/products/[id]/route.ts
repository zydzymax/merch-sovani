import { logger } from '@/lib/utils/logger'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { prisma } from '@/lib/db/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id
    const body = await request.json()
    const { name, description, images, category } = body

    // Проверяем, что товар принадлежит этому продавцу
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: session.user.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        images,
        category,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    logger.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id

    // Проверяем, что товар принадлежит этому продавцу
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: session.user.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
