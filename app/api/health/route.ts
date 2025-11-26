import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'

/**
 * Health check endpoint for monitoring
 * GET /api/health
 *
 * Returns:
 * - 200 OK if all systems operational
 * - 503 Service Unavailable if critical services down
 */
export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'operational',
          responseTime: `${responseTime}ms`
        },
        app: {
          status: 'operational',
          version: process.env.npm_package_version || '1.0.0',
          nodeVersion: process.version
        }
      },
      uptime: process.uptime()
    }, { status: 200 })

  } catch (error) {
    logger.error('Health check failed', error)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      services: {
        database: {
          status: 'down'
        },
        app: {
          status: 'degraded'
        }
      }
    }, { status: 503 })
  }
}
