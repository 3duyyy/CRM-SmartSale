import { StatusCodes } from 'http-status-codes'
import { roleRepository } from '../repositories/roleRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'

const getAllRoles = async () => {
  try {
    const result = await roleRepository.getAllRoles()
    if (!result) throw new ApiError('Không có Role nào trong danh sách!', StatusCodes.NOT_FOUND)

    return result
  } catch (error) {
    throw error
  }
}

export const roleService = {
  getAllRoles
}
