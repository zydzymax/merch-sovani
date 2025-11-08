import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

export async function getOrCreateSession() {
  // Try to get user from auth token
  const token = cookies().get('auth_token')?.value
  let userId: string | null = null

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      userId = payload.userId as string
    } catch (error) {
      // Token invalid, continue as guest
    }
  }

  // Get or create session ID
  let sessionId = cookies().get('session_id')?.value

  if (!sessionId) {
    // Generate new session ID
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Set session cookie
    cookies().set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
  }

  // Get or create session in database
  let session = await prisma.session.findUnique({
    where: { sessionId },
    include: {
      cart: {
        include: {
          variant: {
            include: {
              product: true,
              inventory: true,
            },
          },
        },
      },
    },
  })

  if (!session) {
    session = await prisma.session.create({
      data: {
        sessionId,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        cart: {
          include: {
            variant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
        },
      },
    })
  } else if (userId && !session.userId) {
    // Update session with user ID if user just logged in
    session = await prisma.session.update({
      where: { id: session.id },
      data: { userId },
      include: {
        cart: {
          include: {
            variant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
        },
      },
    })
  }

  return session
}
