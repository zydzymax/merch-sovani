/**
 * Production-ready rate limiter with Redis support
 * Falls back to in-memory if Redis is unavailable
 */

import { redis } from '@/lib/redis/client'

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number
  /**
   * Time window in seconds
   */
  windowSeconds: number
  /**
   * Optional custom identifier (defaults to IP address)
   */
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

// Fallback in-memory store (for development or Redis failure)
interface RateLimitEntry {
  count: number
  resetTime: number
}

const memoryStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) {
        memoryStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Check rate limit using Redis (with memory fallback)
 */
export async function checkRateLimitAsync(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}:${config.maxRequests}:${config.windowSeconds}`
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  try {
    // Try Redis first
    const multi = redis.multi()
    multi.incr(key)
    multi.pttl(key)

    const results = await multi.exec()

    if (!results) {
      throw new Error('Redis multi exec failed')
    }

    const count = results[0][1] as number
    let ttl = results[1][1] as number

    // Set expiry if this is a new key
    if (ttl === -1) {
      await redis.pexpire(key, windowMs)
      ttl = windowMs
    }

    const resetTime = now + ttl
    const remaining = Math.max(0, config.maxRequests - count)
    const success = count <= config.maxRequests

    return {
      success,
      limit: config.maxRequests,
      remaining,
      resetTime,
    }
  } catch (error) {
    // Fallback to memory store if Redis fails
    console.warn('Redis rate limit failed, using memory fallback:', error)
    return checkRateLimitMemory(identifier, config)
  }
}

/**
 * Synchronous rate limit check (memory only)
 * Use this for backwards compatibility
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  return checkRateLimitMemory(identifier, config)
}

/**
 * Memory-based rate limit (fallback)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = `${identifier}:${config.maxRequests}:${config.windowSeconds}`

  let entry = memoryStore.get(key)

  // Create new entry if doesn't exist or expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowSeconds * 1000,
    }
    memoryStore.set(key, entry)
  }

  // Increment count
  entry.count++

  const remaining = Math.max(0, config.maxRequests - entry.count)
  const success = entry.count <= config.maxRequests

  return {
    success,
    limit: config.maxRequests,
    remaining,
    resetTime: entry.resetTime,
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}

/**
 * Reset rate limit for an identifier (admin use)
 */
export async function resetRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<void> {
  const key = `ratelimit:${identifier}:${config.maxRequests}:${config.windowSeconds}`

  try {
    await redis.del(key)
  } catch (error) {
    console.warn('Redis reset failed:', error)
  }

  // Also clear from memory
  const memKey = `${identifier}:${config.maxRequests}:${config.windowSeconds}`
  memoryStore.delete(memKey)
}
