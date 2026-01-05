import { logger } from '@/lib/utils/logger'
import { NextRequest, NextResponse } from 'next/server'
import { conductDraw, conductMultiPrizeDraw } from '@/lib/utils/drawRandomizer'
import { requireAdmin } from '@/lib/auth/requireAdmin'

/**
 * API для проведения розыгрыша
 * POST /api/admin/draw/conduct
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const { error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const { drawId, numberOfWinners, multiPrize } = body

    if (!drawId) {
      return NextResponse.json({ error: 'Draw ID required' }, { status: 400 })
    }

    let result

    if (multiPrize && Array.isArray(multiPrize)) {
      // Розыгрыш нескольких призов
      result = await conductMultiPrizeDraw(drawId, multiPrize)
    } else {
      // Обычный розыгрыш одного приза
      const winners = numberOfWinners || 1
      result = await conductDraw(drawId, winners)
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    logger.error('Draw conduct error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
