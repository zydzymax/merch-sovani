import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/db/prisma'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be defined')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function getUser() {
  try {
    const token = cookies().get('auth_token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    return user
  } catch (error) {
    console.error('getUser error:', error)
    return null
  }
}
