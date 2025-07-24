import { StatusCodes } from 'http-status-codes'
import { leadRepository } from '../repositories/leadRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'

const createNew = async (reqBody, id) => {
  try {
    const existedLead = await leadRepository.findByEmail(reqBody.email)
    if (existedLead) throw new ApiError('Email của khách hàng đã tồn tại!', StatusCodes.BAD_REQUEST)

    const status = reqBody.status || 'moi'
    const maxOrderLead = await leadRepository.findMaxOrderLead(status)
    const order = maxOrderLead ? maxOrderLead.order + 1 : 0

    const userData = {
      ...reqBody,
      status,
      createdBy: id,
      order
    }

    return await leadRepository.create(userData)
  } catch (error) {
    throw error
  }
}

const getAllLeads = async (filter) => {
  try {
    const result = await leadRepository.findAll(filter, FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Chưa tồn tại Lead nào trong danh sách!')

    return { data: result }
  } catch (error) {
    throw error
  }
}

const getLeadById = async (leadId) => {
  try {
    const result = await leadRepository.findById(leadId, FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Không tồn tại Lead này!')

    return { data: result }
  } catch (error) {
    throw error
  }
}

const updateById = async (leadId, updateData, roleName) => {
  try {
    if (updateData?.assignedTo && roleName !== 'ADMIN') {
      throw new ApiError('Bạn không có quyền giao khách hàng cho người khác!', StatusCodes.FORBIDDEN)
    }

    const result = await leadRepository.updateById(leadId, updateData, FIELD_NOT_RETURN)
    if (!result) throw new ApiError('Lead không tồn tại!', StatusCodes.NOT_FOUND)

    return { data: result }
  } catch (error) {
    throw error
  }
}

const deleteById = async (leadId) => {
  try {
    const leadToDelete = await leadRepository.deleteById(leadId)
    if (!leadToDelete) throw new ApiError('Không thể xóa khách hàng không tồn tại!', StatusCodes.BAD_REQUEST)

    return { message: 'Xóa thành công!' }
  } catch (error) {
    throw error
  }
}

export const leadService = {
  createNew,
  getLeadById,
  getAllLeads,
  updateById,
  deleteById
}
