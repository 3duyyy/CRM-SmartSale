import { createClient } from 'redis'
import { env } from './env.js'

export const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  }
})

redisClient.on('error', (err) => {
  console.error('Redis client error: ', err)
})

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
      console.log('Redis connected!')
    }
  } catch (error) {
    console.error('Redis connect failed: ', error)
  }
}
