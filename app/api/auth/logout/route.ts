export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/utils/logger'

export async function POST() {
  try {
    // Clear auth cookie
    cookies().delete('auth_token')

    return NextResponse.json({
      success: true,
      message: 'Вы успешно вышли из системы',
    })
  } catch (error) {
    logger.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Ошибка выхода' },
      { status: 500 }
    )
  }
}
