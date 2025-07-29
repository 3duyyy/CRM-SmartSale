import { followUpModel } from '../models/followUpModel.js'
import { leadModel } from '../models/leadModel.js'

const create = async (data) => {
  return await followUpModel.create(data)
}

const findAll = async (filter, selectField) => {
  const query = {}

  if (filter.status) {
    query.status = filter.status
  }

  if (filter.search) {
    // Chọc vào collection lead để lấy ra lead và xử lý rồi map ở followUp
    const leads = await leadModel.find({ name: { $regex: filter.search, $options: 'i' } }).select('_id')
    query.lead = { $in: leads.map((lead) => lead._id) }
  }

  if (filter.isPagination === 'false') {
    const results = await followUpModel
      .find(query)
      .populate([
        { path: 'lead', select: 'name email company' },
        { path: 'user', select: 'name email' }
      ])
      .select(selectField)
    return { data: results }
  }
  const page = Number(filter.page) || 1
  const limit = Number(filter.limit) || 6
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    followUpModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate([
        { path: 'lead', select: 'name email company' },
        { path: 'user', select: 'name email' }
      ])
      .select(selectField),
    followUpModel.countDocuments(query)
  ])

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      isPagination: true
    }
  }
}

const findById = async (id, selectField) => {
  return await followUpModel
    .findById(id)
    .populate([
      { path: 'lead', select: 'name email company' },
      { path: 'user', select: 'name email' }
    ])
    .select(selectField)
}

const findOne = async (filter) => {
  return await followUpModel.findOne(filter).populate('lead user')
}

const updateById = async (id, payload, selectField) => {
  return await followUpModel.findByIdAndUpdate(id, payload, { new: true }).select(selectField)
}

const deleteById = async (id) => {
  return await followUpModel.findByIdAndDelete(id)
}

const countCompleted = async () => {
  return await followUpModel.countDocuments({ status: 'Đã hoàn thành' })
}

export const followUpRepository = {
  create,
  findAll,
  findById,
  findOne,
  updateById,
  deleteById,
  countCompleted
}
