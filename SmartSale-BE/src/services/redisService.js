import { redisRepository } from '../repositories/redisRepository.js'

const saveRefreshToken = async (userId, token) => {
  await redisRepository.setKey(`refreshToken:${userId}`, token, '7d')
}

const getRefreshToken = async (userId) => {
  return await redisRepository.getKey(`refreshToken:${userId}`)
}

const deleteRefreshToken = async (userId) => {
  return await redisRepository.deleteKey(`refreshToken:${userId}`)
}

export const redisService = {
  saveRefreshToken,
  getRefreshToken,
  deleteRefreshToken
}
