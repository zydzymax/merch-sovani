import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/security/rateLimit'
import { logger } from '@/lib/utils/logger'

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      request.ip ||
                      'unknown'

    // Rate limit: 3 registration attempts per hour per IP
    const rateLimit = checkRateLimit(ipAddress, {
      maxRequests: 3,
      windowSeconds: 60 * 60,
    })

    const headers = getRateLimitHeaders(rateLimit)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Слишком много попыток регистрации. Попробуйте позже.' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const { name, email, phone, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Имя, email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=[\]{};':"\\|,.<>\/]{12,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error: 'Пароль должен содержать минимум 12 символов, включая заглавные и строчные буквы, цифры и специальные символы'
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate unique referral code
    let referralCode = generateReferralCode()
    let codeExists = await prisma.user.findUnique({ where: { referralCode } })
    while (codeExists) {
      referralCode = generateReferralCode()
      codeExists = await prisma.user.findUnique({ where: { referralCode } })
    }

    // Check for referral cookie
    const cookieStore = cookies()
    const refCookie = cookieStore.get('ref')
    let referrerId: string | null = null

    if (refCookie?.value) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: refCookie.value },
      })
      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
        referralCode,
        role: 'CUSTOMER',
      },
    })

    // Create referral relationship if referred
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredId: user.id,
        },
      })
      // Clear referral cookie
      cookieStore.delete('ref')
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        referralCode: user.referralCode,
      },
    }, { headers })
  } catch (error) {
    logger.error('Registration failed', error)
    return NextResponse.json(
      { error: 'Ошибка регистрации' },
      { status: 500 }
    )
  }
}
