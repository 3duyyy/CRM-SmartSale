import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/ApiError.js'
import { jwtUtils } from '../utils/jwt.js'
import { env } from '../config/env.js'

// Kiểm tra Token
const Authenticate = async (req, res, next) => {
  try {
    const clientAccessToken = req.cookies.accessToken

    if (!clientAccessToken) {
      throw new ApiError('Access token expired!', StatusCodes.UNAUTHORIZED)
    }

    const tokenDecoded = await jwtUtils.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

    req.tokenDecoded = tokenDecoded

    next()
  } catch (error) {
    // Bắt lỗi Token expired
    if (error?.name === 'TokenExpiredError') {
      next(new ApiError('Access token expired!', StatusCodes.UNAUTHORIZED))
      return
    } else {
      // Bắt lỗi bất kì trường hợp nào Token không hợp lệ
      next(new ApiError('Unauthorized!', StatusCodes.UNAUTHORIZED))
    }
  }
}

export const authMiddleware = { Authenticate }
