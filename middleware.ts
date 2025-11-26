import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // Handle referral tracking
  const refParam = request.nextUrl.searchParams.get('ref')

  if (refParam) {
    // Set referral cookie for 7 days
    response.cookies.set('ref', refParam, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
  }

  // Get user session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // If user is a SELLER, restrict access to only /seller/* routes
  if (token && token.role === 'SELLER') {
    // Allow access to seller routes, API routes, auth routes, and static files
    const allowedPaths = [
      '/seller',
      '/api',
      '/_next',
      '/images',
      '/assets',
      '/favicon.ico',
    ]

    // Check if the current path is allowed
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path))

    // If seller is trying to access a non-seller route, redirect to seller dashboard
    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = '/seller'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
