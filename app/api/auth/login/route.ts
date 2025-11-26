import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/security/rateLimit'
import { logger } from '@/lib/utils/logger'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be defined')
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      request.ip ||
                      'unknown'

    // Rate limit: 5 login attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(ipAddress, {
      maxRequests: 5,
      windowSeconds: 15 * 60,
    })

    const headers = getRateLimitHeaders(rateLimit)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Слишком много попыток входа. Попробуйте позже.' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Set cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }, { headers })
  } catch (error) {
    logger.error('Login failed', error)
    return NextResponse.json(
      { error: 'Ошибка входа' },
      { status: 500 }
    )
  }
}
