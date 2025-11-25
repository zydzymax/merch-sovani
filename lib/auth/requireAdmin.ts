import { NextResponse } from 'next/server'
import { getUser } from './getUser'

/**
 * Middleware helper to require admin authentication
 * Returns user if authenticated as admin, otherwise returns error response
 */
export async function requireAdmin() {
  const user = await getUser()

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      ),
      user: null,
    }
  }

  if (user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора.' },
        { status: 403 }
      ),
      user: null,
    }
  }

  return { error: null, user }
}
