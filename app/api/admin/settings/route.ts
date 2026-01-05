import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'

export async function GET() {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const settings = await prisma.setting.findMany()

    // Convert to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(settingsObj)
  } catch (error) {
    logger.error('Get settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()

    // Save each setting
    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        create: {
          key,
          value: value as any,
          category: getCategoryForKey(key),
        },
        update: {
          value: value as any,
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Settings saved' })
  } catch (error) {
    logger.error('Save settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

function getCategoryForKey(key: string): string {
  if (key.startsWith('cdek')) return 'cdek'
  if (key.startsWith('site')) return 'site'
  if (key.startsWith('contact')) return 'site'
  return 'general'
}
