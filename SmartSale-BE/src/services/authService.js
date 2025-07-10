import { StatusCodes } from 'http-status-codes'
import { userRepository } from '../repositories/userRepository.js'
import { ApiError } from '../utils/ApiError.js'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { jwtUtils } from '../utils/jwt.js'
import { redisService } from './redisService.js'
import { FIELD_NOT_RETURN, ROLES } from '../utils/constants.js'
import { roleRepository } from '../repositories/roleRepository.js'

const register = async (reqBody) => {
  try {
    const existedUser = await userRepository.findByEmail(reqBody.email)
    if (existedUser) throw new ApiError('Email đã tồn tại!', StatusCodes.BAD_REQUEST)

    // Mặc định register role là STAFF
    const defaultRole = await roleRepository.findByName(ROLES.STAFF)
    const newUser = {
      name: reqBody.name,
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 10),
      roles: defaultRole._id
    }

    return await userRepository.createUser(newUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userRepository.findByEmail(reqBody.email, '-createdAt -updatedAt')

    if (!existUser) {
      throw new ApiError('Không thể tìm thấy account!', StatusCodes.NOT_FOUND)
    }

    if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError('Email hoặc mật khẩu không chính xác!', StatusCodes.NOT_ACCEPTABLE)
    }

    const userInfo = { id: existUser._id, roleName: existUser?.roles?.name }

    const accessToken = await jwtUtils.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
    const refreshToken = await jwtUtils.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)

    await redisService.saveRefreshToken(existUser._id, refreshToken)

    // Lọc field password trước khi trả về
    const { password: _, ...userData } = existUser.toObject()

    return { accessToken, refreshToken, userData }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const tokenDecoded = await jwtUtils.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)
    if (!tokenDecoded) return null

    const payload = {
      id: tokenDecoded.id,
      email: tokenDecoded.email
    }

    const newAccessToken = await jwtUtils.generateToken(payload, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
    const newRefreshToken = await jwtUtils.generateToken(payload, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)

    await redisService.saveRefreshToken(payload.id, newRefreshToken)

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  } catch (error) {
    throw error
  }
}

const getMe = async (myId) => {
  try {
    const result = await userRepository.findById(myId, FIELD_NOT_RETURN)
    return { result }
  } catch (error) {
    throw error
  }
}

export const authService = {
  register,
  login,
  refreshToken,
  getMe
}
