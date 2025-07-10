import { StatusCodes } from 'http-status-codes'
import { userRepository } from '../repositories/userRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'
import { leadRepository } from '../repositories/leadRepository.js'

const getAllUsers = async () => {
  try {
    const result = await userRepository.findAll(FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Chưa tồn tại người dùng nào trong danh sách!', StatusCodes.NOT_FOUND)

    return { data: result }
  } catch (error) {
    throw error
  }
}

const getUserById = async (userId) => {
  try {
    const result = await userRepository.findById(userId, FIELD_NOT_RETURN)

    if (!result) throw new ApiError('Người dùng không tồn tại!', StatusCodes.NOT_FOUND)

    return { data: result }
  } catch (error) {
    throw error
  }
}

const updateUserById = async (userId, updateData, roleName) => {
  try {
    if (updateData?.roles && roleName !== 'ADMIN') {
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
    if (user?.roles?.name === 'ADMIN') throw new ApiError('Không thể xóa người dùng có quyền Admin!', StatusCodes.NOT_ACCEPTABLE)

    // Cập nhật field assignedTo cho Lead được phụ trách bởi user đã bị xóa
    await leadRepository.unassignLeadsByUserId(userId)

    const result = await userRepository.deleteById(userId)
    if (!result) throw new ApiError('Không thể xóa người dùng không tồn tại!', StatusCodes.BAD_REQUEST)

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
