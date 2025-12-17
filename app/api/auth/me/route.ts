export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}
