import { StatusCodes } from 'http-status-codes'
import { userRepository } from '../repositories/userRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'

const getAllUsers = async () => {
  try {
    const result = await userRepository.findAll(FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Không tồn tại người dùng nào!', StatusCodes.NOT_FOUND)

    return { data: result }
  } catch (error) {
    throw error
  }
}

const getUserById = async (userId) => {
  try {
    const result = await userRepository.findById(userId, FIELD_NOT_RETURN)
    console.log(result)

    if (!result) throw new ApiError('Người dùng không tồn tại!', StatusCodes.NOT_FOUND)

    return { data: result }
  } catch (error) {
    throw error
  }
}

const updateUserById = async (userId, updateData, roleName) => {
  try {
    if (updateData.roles && roleName !== 'ADMIN') {
      throw new ApiError('Bạn không có quyền sửa Role!', StatusCodes.FORBIDDEN)
    }

    const result = await userRepository.updateById(userId, updateData, FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Người dùng không tồn tại!', StatusCodes.NOT_FOUND)

    return { data: result }
  } catch (error) {
    throw error
  }
}

const deleteById = async (userId) => {
  try {
    const user = await userRepository.findById(userId)
    if (!user) throw new ApiError('Người dùng không tồn tại!', StatusCodes.NOT_FOUND)

    if (user?.roles?.name === 'ADMIN') throw new ApiError('Không thể xóa người dùng có quyền Admin!', StatusCodes.NOT_ACCEPTABLE)

    const result = await userRepository.deleteById(userId)
    if (!result) throw new ApiError('Không thể xóa người dùng!', StatusCodes.BAD_REQUEST)

    return { message: 'Xóa thành công!' }
  } catch (error) {
    throw error
  }
}

export const userService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteById
}
