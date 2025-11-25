import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { jwtVerify } from 'jose'
import type { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be defined')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

type SessionWithCart = Prisma.SessionGetPayload<{
  include: {
    cart: {
      include: {
        variant: {
          include: {
            product: true
            inventory: true
          }
        }
      }
    }
  }
}>

export async function getOrCreateSession(options: { readOnly?: boolean } = {}): Promise<SessionWithCart> {
  // Try to get user from auth token
  const token = cookies().get('auth_token')?.value
  let userId: string | null = null

  if (token) {
    try {
      const { payload} = await jwtVerify(token, JWT_SECRET)
      userId = payload.userId as string
    } catch (error) {
      // Token invalid, continue as guest
    }
  }

  // Get session ID
  let sessionId = cookies().get('session_id')?.value

  // If no session and read-only mode, return empty session
  if (!sessionId && options.readOnly) {
    return {
      id: '',
      sessionId: '',
      sessionToken: null,
      userId: null,
      cart: [],
      expiresAt: null,
      expires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  if (!sessionId) {
    // Generate cryptographically secure session ID
    sessionId = `sess_${randomBytes(32).toString('hex')}`

    // Set session cookie (only allowed in Server Actions/Route Handlers)
    if (!options.readOnly) {
      cookies().set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
    }
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

  if (!session && !options.readOnly) {
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
  } else if (!session && options.readOnly) {
    // Return empty session for read-only mode
    return {
      id: '',
      sessionId: sessionId || '',
      sessionToken: null,
      userId: null,
      cart: [],
      expiresAt: null,
      expires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  } else if (session && userId && !session.userId && !options.readOnly) {
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

  return session!
}
