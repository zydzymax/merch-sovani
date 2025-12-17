export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    // Clear auth cookie
    cookies().delete('auth_token')

    // Redirect to home page
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_URL || 'https://www.sovani.info'))
  } catch (error) {
    logger.error('Logout error:', error)
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_URL || 'https://www.sovani.info'))
  }
}

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
