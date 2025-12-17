import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/security/rateLimit'
import { validateINN, validateOGRN } from '@/lib/utils/innOgrnValidation'
import { normalizePhone } from '@/lib/utils/phoneNormalization'

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      request.ip ||
                      'unknown'

    // Rate limit: 2 seller registration attempts per day per IP
    const rateLimit = checkRateLimit(ipAddress, {
      maxRequests: 2,
      windowSeconds: 24 * 60 * 60,
    })

    const headers = getRateLimitHeaders(rateLimit)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Слишком много попыток регистрации продавца. Попробуйте завтра.' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const {
      email,
      password,
      name,
      phone,
      companyName,
      inn,
      ogrn,
      legalAddress,
      bankAccount,
      bankName,
      bankBik,
      bankCorAccount,
    } = body

    // Валидация обязательных полей
    if (!email || !password || !name || !phone || !companyName || !inn || !ogrn || !legalAddress) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Validate and normalize phone number
    const normalizedPhone = normalizePhone(phone)
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'Неверный формат номера телефона. Используйте формат +79991234567 или 89991234567' },
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

    // Validate INN
    const innValidation = validateINN(inn)
    if (!innValidation.valid) {
      return NextResponse.json(
        { error: innValidation.error },
        { status: 400, headers }
      )
    }

    // Validate OGRN
    const ogrnValidation = validateOGRN(ogrn)
    if (!ogrnValidation.valid) {
      return NextResponse.json(
        { error: ogrnValidation.error },
        { status: 400, headers }
      )
    }

    // Проверяем, не существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Проверяем, не используется ли телефон другим продавцом
    const existingSellerWithPhone = await prisma.user.findFirst({
      where: {
        phone: normalizedPhone,
        role: 'SELLER',
      },
    })

    if (existingSellerWithPhone) {
      return NextResponse.json(
        { error: 'Этот номер телефона уже используется другим продавцом' },
        { status: 400 }
      )
    }

    // Хешируем пароль (cost factor 12 для безопасности)
    const passwordHash = await bcrypt.hash(password, 12)

    // Создаём продавца
    const seller = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: normalizedPhone,
        role: 'SELLER',
        companyName,
        inn,
        ogrn,
        legalAddress,
        bankAccount: bankAccount || null,
        bankName: bankName || null,
        bankBik: bankBik || null,
        bankCorAccount: bankCorAccount || null,
        offerAcceptedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Регистрация прошла успешно',
      sellerId: seller.id,
    }, { headers })
  } catch (error) {
    logger.error('Error registering seller:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
