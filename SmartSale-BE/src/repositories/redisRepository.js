import ms from 'ms'
import { redisClient } from '../config/redis.js'

const setKey = async (key, value, ttl) => {
  if (ttl) {
    await redisClient.set(key, value, { expiration: { type: 'EX', value: ms(ttl) / 1000 } })
  } else {
    await redisClient.set(key, value)
  }
}

const getKey = async (key) => {
  return await redisClient.get(key)
}

const deleteKey = async (key) => {
  await redisClient.del(key)
}

export const redisRepository = {
  setKey,
  getKey,
  deleteKey
}
