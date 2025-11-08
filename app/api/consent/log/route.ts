import { NextRequest, NextResponse } from 'next/server'
import { logConsent } from '@/lib/legal/getLegalDoc'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, formType, docKey, docVersion, metadata } = body

    // Get client IP and user agent for audit trail
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    await logConsent({
      userId,
      formType,
      docKey,
      docVersion,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Consent log error:', error)
    return NextResponse.json({ error: 'Failed to log consent' }, { status: 500 })
  }
}
