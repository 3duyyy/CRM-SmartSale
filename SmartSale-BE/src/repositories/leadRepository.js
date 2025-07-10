import { leadModel } from '../models/leadModel.js'

const create = async (data) => {
  return await leadModel.create(data)
}

// Check exist lead
const findByEmail = async (email) => {
  return await leadModel.findOne({ email })
}

const findAll = async (selectField) => {
  return await leadModel.find().populate('assignedTo', 'name email').select(selectField)
}

const findById = async (id, selectField) => {
  return await leadModel.findById(id).populate('assignedTo createdBy', 'name email').select(selectField)
}

const updateById = async (id, updateData, selectField) => {
  return await leadModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .populate('assignedTo createdBy', 'name email')
    .select(selectField)
}

const deleteById = async (id) => {
  return await leadModel.findByIdAndDelete(id)
}

const unassignLeadsByUserId = async (userId) => {
  return await leadModel.updateMany({ assignedTo: userId }, { $set: { assignedTo: null } })
}

export const leadRepository = {
  create,
  findByEmail,
  findAll,
  findById,
  updateById,
  deleteById,
  unassignLeadsByUserId
}
