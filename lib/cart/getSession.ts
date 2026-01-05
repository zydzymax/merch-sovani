import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

/**
 * Get existing session without creating one (read-only for GET routes)
 */
export async function getSession() {
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

  // Get session ID (don't create if missing)
  const sessionId = cookies().get('session_id')?.value

  if (!sessionId) {
    return null
  }

  // Get session from database
  const session = await prisma.session.findUnique({
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

  return session
}
