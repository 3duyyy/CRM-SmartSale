import ms from 'ms'
import { authService } from '../services/authService.js'
import { StatusCodes } from 'http-status-codes'
import { redisService } from '../services/redisService.js'
import { ApiError } from '../utils/ApiError.js'

const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body)
    res.status(StatusCodes.OK).json({ message: 'Đăng ký thành công!', userData: newUser })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const userResult = await authService.login(req.body)

    res.status(StatusCodes.OK).json({ userResult })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    }

    res.clearCookie('accessToken', cookieOptions)
    res.clearCookie('refreshToken', cookieOptions)

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    if (req.cookies?.refreshToken === (await redisService.getRefreshToken(req.body.userId))) {
      const tokenResult = await authService.refreshToken(req.cookies?.refreshToken)
      return res.status(StatusCodes.OK).json(tokenResult)
    }
    throw new ApiError('Đã có lỗi xảy ra', 401)
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    const myId = req.tokenDecoded.id
    const result = await authService.getMe(myId)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  register,
  login,
  logout,
  refreshToken,
  getMe
}
