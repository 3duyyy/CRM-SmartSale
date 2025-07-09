import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/ApiError.js'
import { jwtUtils } from '../utils/jwt.js'
import { env } from '../config/env.js'

// Kiểm tra Token
const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized - Token không tồn tại!')
    }

    const clientAccessToken = authHeader.split(' ')[1] || null

    if (!clientAccessToken) {
      throw new ApiError('Unauthorized - Không có Token!', StatusCodes.UNAUTHORIZED)
    }

    const tokenDecoded = await jwtUtils.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

    req.tokenDecoded = tokenDecoded

    next()
  } catch (error) {
    console.log('Auth Error: ', error)
    // Bắt lỗi Token expired
    if (error?.name === 'TokenExpiredError') {
      next(new ApiError('Token đã hết hạn!', StatusCodes.GONE))
      return
    }

    // Bắt lỗi bất kì trường hợp nào Token không hợp lệ
    next(new ApiError('Unauthorized!', StatusCodes.UNAUTHORIZED))
  }
}

export const authMiddleware = { Authenticate }
