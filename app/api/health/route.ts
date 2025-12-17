import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { redis, isRedisReady } from '@/lib/redis/client'
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
  const services: Record<string, { status: string; responseTime?: string; error?: string }> = {}

  let overallStatus = 'healthy'
  let httpStatus = 200

  // Check database connectivity
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    services.database = {
      status: 'operational',
      responseTime: `${Date.now() - dbStart}ms`
    }
  } catch (error) {
    services.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
    overallStatus = 'unhealthy'
    httpStatus = 503
    logger.error('Health check: Database down', error)
  }

  // Check Redis connectivity
  try {
    const redisStart = Date.now()
    if (isRedisReady()) {
      await redis.ping()
      services.redis = {
        status: 'operational',
        responseTime: `${Date.now() - redisStart}ms`
      }
    } else {
      services.redis = {
        status: 'degraded',
        error: 'Not connected (using memory fallback)'
      }
    }
  } catch (error) {
    services.redis = {
      status: 'degraded',
      error: 'Connection failed (using memory fallback)'
    }
    // Redis is non-critical, don't change overall status
  }

  // App status
  services.app = {
    status: overallStatus === 'healthy' ? 'operational' : 'degraded',
  }

  const responseTime = Date.now() - startTime

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    services,
    system: {
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
      memoryUsage: {
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      }
    }
  }, { status: httpStatus })
}

// Allow caching for 10 seconds
export const revalidate = 10
