import Redis from 'ioredis'

const getRedisUrl = () => {
  const url = process.env.REDIS_URL
  if (!url) {
    throw new Error('REDIS_URL not defined')
  }
  return url
}

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
})

redis.on('error', (err) => {
  console.error('Redis error:', err)
})

redis.on('connect', () => {
  console.log('✅ Connected to Redis')
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redis.quit()
})
