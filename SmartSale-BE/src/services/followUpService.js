import { StatusCodes } from 'http-status-codes'
import { leadRepository } from '../repositories/leadRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { followUpRepository } from '../repositories/followUpRepository.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'

const createFollowUp = async (data, tokenDecoded) => {
  try {
    const lead = await leadRepository.findById(data?.lead)
    if (!lead) throw new ApiError('Khách hàng không tồn tại!', StatusCodes.NOT_FOUND)

    const existedFollowup = await followUpRepository.findOne({ lead: data?.lead })
    if (existedFollowup) throw new ApiError('Lead này đã có follow-up!', StatusCodes.BAD_REQUEST)

    if (tokenDecoded.roleName !== 'ADMIN' && lead.assignedTo._id.toString() !== tokenDecoded.id) {
      throw new ApiError('Bạn không có quyền tạo follow-up cho lead này!', 403)
    }

    await followUpRepository.create({ ...data, user: lead?.assignedTo })

    return { message: 'Tạo follow-up thành công!' }
  } catch (error) {
    throw error
  }
}

const getAllFollowUps = async (filter) => {
  try {
    return await followUpRepository.findAll(filter, FIELD_NOT_RETURN)
  } catch (error) {
    throw error
  }
}

const getFollowUpById = async (id) => {
  try {
    const result = await followUpRepository.findById(id, FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Follow-up không tồn tại!', StatusCodes.NOT_FOUND)
    return result
  } catch (error) {
    throw error
  }
}

const updateFollowUpById = async (id, payload) => {
  try {
    const followUp = await followUpRepository.findById(id)
    if (!followUp) throw new ApiError('Follow-up không tồn tại!', StatusCodes.NOT_FOUND)

    return await followUpRepository.updateById(id, payload, FIELD_NOT_RETURN)
  } catch (error) {
    throw error
  }
}

const deleteFollowUpById = async (id) => {
  try {
    const followUpToDelete = await followUpRepository.deleteById(id)
    if (!followUpToDelete) throw new ApiError('Không thể xóa Follow-up không tồn tại!', StatusCodes.NOT_FOUND)

    return { message: 'Xóa Follow-up thành công!' }
  } catch (error) {
    throw error
  }
}

export const followUpService = {
  createFollowUp,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUpById,
  deleteFollowUpById
}
