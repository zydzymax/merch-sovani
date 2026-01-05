import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const content = await prisma.setting.findMany({
      where: { category: 'content' },
    })

    const contentObj = content.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(contentObj)
  } catch (error) {
    logger.error('Get content error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()

    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        create: {
          key,
          value: value as any,
          category: 'content',
          description: `Content field: ${key}`,
        },
        update: {
          value: value as any,
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Content saved' })
  } catch (error) {
    logger.error('Save content error:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
