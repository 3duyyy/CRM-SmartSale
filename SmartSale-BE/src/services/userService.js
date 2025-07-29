import { StatusCodes } from 'http-status-codes'
import { userRepository } from '../repositories/userRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'
import { leadRepository } from '../repositories/leadRepository.js'
import bcrypt from 'bcryptjs'

const getAllUsers = async (filter) => {
  try {
    return await userRepository.findAll(filter, FIELD_NOT_RETURN)
  } catch (error) {
    throw error
  }
}

const getUserById = async (userId) => {
  try {
    const result = await userRepository.findById(userId, FIELD_NOT_RETURN)

    if (!result) throw new ApiError('Người dùng không tồn tại!', StatusCodes.NOT_FOUND)

    return result
  } catch (error) {
    throw error
  }
}

const createUser = async (userData) => {
  try {
    const existedUser = await userRepository.findByEmail(userData?.email)
    if (existedUser) throw new ApiError('Email đã tồn tại!', StatusCodes.BAD_REQUEST)

    const hashedPassword = await bcrypt.hashSync(userData?.password, 10)
    const createData = {
      ...userData,
      password: hashedPassword
    }

    return await userRepository.createUser(createData)
  } catch (error) {
    throw error
  }
}

const updateUserById = async (userId, updateData) => {
  try {
    let updatedData
    if (updateData.password) {
      updatedData = {
        ...updateData,
        password: bcrypt.hashSync(updateData?.password, 10)
      }
    } else {
      updatedData = updateData
    }

    const result = await userRepository.updateById(userId, updatedData, FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Người dùng không tồn tại!', StatusCodes.NOT_FOUND)

    return result
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
  deleteById,
  createUser
}
