import Redis from 'ioredis'

const getRedisUrl = () => {
  return process.env.REDIS_URL || 'redis://localhost:6381'
}

// Create Redis instance with error handling
const createRedisClient = () => {
  const client = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('Redis: Max retries reached, giving up')
        return null // Stop retrying
      }
      const delay = Math.min(times * 200, 2000)
      return delay
    },
    reconnectOnError: (err) => {
      const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT']
      return targetErrors.some(e => err.message.includes(e))
    },
  })

  client.on('error', (err) => {
    // Only log once per error type to avoid spam
    if (!client._errorLogged) {
      console.warn('Redis connection error (will use fallback):', err.message)
      client._errorLogged = true
    }
  })

  client.on('connect', () => {
    console.log('✅ Connected to Redis')
    client._errorLogged = false
  })

  client.on('close', () => {
    console.warn('Redis connection closed')
  })

  return client
}

// Extend Redis type for error tracking
declare module 'ioredis' {
  interface Redis {
    _errorLogged?: boolean
  }
}

export const redis = createRedisClient()

// Connect asynchronously without blocking
redis.connect().catch((err) => {
  console.warn('Redis initial connection failed:', err.message)
})

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    try {
      await redis.quit()
    } catch (e) {
      // Ignore errors during shutdown
    }
  })

  process.on('SIGINT', async () => {
    try {
      await redis.quit()
    } catch (e) {
      // Ignore errors during shutdown
    }
  })
}

/**
 * Check if Redis is connected and ready
 */
export function isRedisReady(): boolean {
  return redis.status === 'ready'
}

/**
 * Safe Redis get with fallback
 */
export async function safeGet(key: string): Promise<string | null> {
  try {
    if (!isRedisReady()) return null
    return await redis.get(key)
  } catch (error) {
    console.warn('Redis get failed:', error)
    return null
  }
}

/**
 * Safe Redis set with fallback
 */
export async function safeSet(
  key: string,
  value: string,
  exSeconds?: number
): Promise<boolean> {
  try {
    if (!isRedisReady()) return false
    if (exSeconds) {
      await redis.setex(key, exSeconds, value)
    } else {
      await redis.set(key, value)
    }
    return true
  } catch (error) {
    console.warn('Redis set failed:', error)
    return false
  }
}

/**
 * Safe Redis delete
 */
export async function safeDel(key: string): Promise<boolean> {
  try {
    if (!isRedisReady()) return false
    await redis.del(key)
    return true
  } catch (error) {
    console.warn('Redis del failed:', error)
    return false
  }
}
