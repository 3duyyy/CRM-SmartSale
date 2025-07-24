import { StatusCodes } from 'http-status-codes'
import { userRepository } from '../repositories/userRepository.js'
import { ApiError } from '../utils/ApiError.js'

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const permissions = await userRepository.getPermissionByUserId(req.tokenDecoded.id)

      if (!permissions.includes(requiredPermission) && req.tokenDecoded.roleName !== 'ADMIN') {
        return next(new ApiError('Bạn không có quyền làm tác vụ này!', StatusCodes.FORBIDDEN))
      }

      next()
    } catch (error) {
      next(new ApiError('Lỗi kiểm tra quyền', StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}
