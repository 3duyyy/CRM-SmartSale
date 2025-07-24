import { leadModel } from '../models/leadModel.js'

const create = async (data) => {
  return (await leadModel.create(data)).populate('assignedTo')
}

// Check exist lead
const findByEmail = async (email) => {
  return await leadModel.findOne({ email })
}

const findAll = async (filter, selectField) => {
  const query = {}

  if (filter.status) {
    query.status = filter.status
  }

  if (filter.assignedTo) {
    query.assignedTo = filter.assignedTo
  }

  if (filter.search) {
    query.name = { $regex: filter.search, $options: 'i' }
  }

  return await leadModel.find(query).populate('assignedTo', 'name email').select(selectField)
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

const findMaxOrderLead = async (status) => {
  return await leadModel.findOne({ status: status }).sort('-order').exec()
}

export const leadRepository = {
  create,
  findByEmail,
  findAll,
  findById,
  updateById,
  deleteById,
  unassignLeadsByUserId,
  findMaxOrderLead
}
