import { StatusCodes } from 'http-status-codes'
import { leadRepository } from '../repositories/leadRepository.js'
import { ApiError } from '../utils/ApiError.js'
import { FIELD_NOT_RETURN } from '../utils/constants.js'
import { leadModel } from '../models/leadModel.js'

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

const dragLeadService = async ({ leadId, source, destination, tokenDecoded }) => {
  const session = await leadModel.startSession()
  session.startTransaction()

  try {
    const lead = await leadModel.findById(leadId).session(session)
    if (!lead) {
      throw new ApiError('Lead không tồn tại hoặc đã bị xóa!', StatusCodes.NOT_FOUND)
    }

    const isAdmin = tokenDecoded.roleName === 'ADMIN'
    const isAssignedTo = lead.assignedTo?.toString() === tokenDecoded.id
    if (!isAdmin && !isAssignedTo) {
      throw new ApiError('Bạn không có quyền kéo thả lead này!', StatusCodes.FORBIDDEN)
    }

    const isSameColumn = source.status === destination.status

    if (isSameColumn) {
      const leadsInStatus = await leadModel.find({ status: source.status }).session(session).sort({ order: 1 })
      const draggedLeadIndex = leadsInStatus.findIndex((l) => l._id.toString() === leadId)

      if (draggedLeadIndex === -1) {
        throw new ApiError('Lead không tìm thấy trong cột nguồn!', StatusCodes.NOT_FOUND)
      }

      // Lấy lead khỏi vị trí cũ
      const [draggedLead] = leadsInStatus.splice(draggedLeadIndex, 1)

      // Chèn lead vào vị trí mới
      leadsInStatus.splice(destination.order, 0, draggedLead)

      // Cập nhật lại toàn bộ order trong cột
      await Promise.all(leadsInStatus.map((l, idx) => leadModel.findByIdAndUpdate(l._id, { order: idx }, { session })))
    } else {
      // Khác cột
      // Lấy lead từ cột nguồn và xóa khỏi đó
      const sourceLeads = await leadModel.find({ status: source.status }).session(session).sort({ order: 1 })
      const draggedLeadIndex = sourceLeads.findIndex((l) => l._id.toString() === leadId)

      if (draggedLeadIndex === -1) {
        throw new ApiError('Lead không tìm thấy trong cột nguồn!', StatusCodes.NOT_FOUND)
      }

      const [draggedLead] = sourceLeads.splice(draggedLeadIndex, 1)
      await Promise.all(sourceLeads.map((l, idx) => leadModel.findByIdAndUpdate(l._id, { order: idx }, { session })))

      // Thêm lead vào cột đích và cập nhật order/status
      const destLeads = await leadModel.find({ status: destination.status }).session(session).sort({ order: 1 })
      destLeads.splice(destination.order, 0, draggedLead)

      await Promise.all(
        destLeads.map((l, idx) => {
          const updateData = { order: idx }
          if (l._id.toString() === leadId) {
            // Chỉ cập nhật status cho lead đang được kéo
            updateData.status = destination.status
          }
          return leadModel.findByIdAndUpdate(l._id, updateData, { session })
        })
      )
    }

    await session.commitTransaction()
    session.endSession()
    return { message: 'Drag thành công' }
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export const leadService = {
  createNew,
  getLeadById,
  getAllLeads,
  updateById,
  deleteById,
  dragLeadService
}
