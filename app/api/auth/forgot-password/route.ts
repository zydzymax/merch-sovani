export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { emailService } from '@/lib/email/emailService'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Если аккаунт с таким email существует, мы отправили инструкции по сбросу пароля'
      })
    }

    // Invalidate any existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
      data: {
        expiresAt: new Date() // Expire immediately
      }
    })

    // Generate secure token
    const token = randomBytes(32).toString('hex')

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Create reset token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })

    // Build reset URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getnwin.ru'
    const resetUrl = `${siteUrl}/reset-password?token=${token}`

    // Send email
    await emailService.sendEmail({
      to: user.email,
      subject: 'Сброс пароля',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Сброс пароля</h1>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Вы запросили сброс пароля для вашего аккаунта.
              Нажмите кнопку ниже, чтобы установить новый пароль:
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                 style="display: inline-block; background: #000; color: white; text-decoration: none;
                        padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Сбросить пароль
              </a>
            </div>

            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              Ссылка действительна в течение 1 часа.
            </p>

            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

            <p style="color: #999; font-size: 12px;">
              Если кнопка не работает, скопируйте эту ссылку в браузер:<br>
              <a href="${resetUrl}" style="color: #666; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Сброс пароля\n\nВы запросили сброс пароля. Перейдите по ссылке: ${resetUrl}\n\nСсылка действительна в течение 1 часа.\n\nЕсли вы не запрашивали сброс пароля, проигнорируйте это письмо.`
    })

    return NextResponse.json({
      success: true,
      message: 'Если аккаунт с таким email существует, мы отправили инструкции по сбросу пароля'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
