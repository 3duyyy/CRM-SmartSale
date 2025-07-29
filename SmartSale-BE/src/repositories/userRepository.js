import { leadModel } from '../models/leadModel.js'
import { userModel } from '../models/userModel.js'

const createUser = async (data) => {
  return await userModel.create(data)
}

const findByEmail = async (email, selectField) => {
  return await userModel
    .findOne({ email })
    .populate({ path: 'roles', populate: { path: 'permissions' } })
    .select(selectField)
}

const findById = async (id, selectField) => {
  return await userModel
    .findById(id)
    .populate({ path: 'roles', populate: { path: 'permissions' } })
    .select(selectField)
}

const findAll = async (filter, selectField) => {
  const query = {}

  if (filter.role) {
    query.roles = filter.role
  }

  if (filter.searchUser) {
    query.name = { $regex: filter.searchUser, $options: 'i' }
  }

  const page = Number(filter.page) || 1
  const limit = Number(filter.limit) || 8
  const skip = (filter.page - 1) * filter.limit

  if (filter.isPagination === 'false') {
    const users = await userModel
      .find(query)
      .populate({ path: 'roles', populate: { path: 'permissions' } })
      .select(selectField)

    return { data: users }
  }

  const [users, total] = await Promise.all([
    userModel
      .find(query)
      .populate({ path: 'roles', populate: { path: 'permissions' } })
      .select(selectField)
      .skip(skip)
      .limit(limit),
    userModel.countDocuments(query)
  ])

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const updateById = async (id, updateData, selectField) => {
  return await userModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .populate({ path: 'roles', populate: { path: 'permissions' } })
    .select(selectField)
}

const deleteById = async (id) => {
  return await userModel.findByIdAndDelete(id)
}

const getPermissionByUserId = async (id) => {
  const user = await userModel
    .findById(id)
    .populate({ path: 'roles', populate: { path: 'permissions' } })
    .lean()

  if (!user) return []

  const permissions = user?.roles?.permissions?.map((p) => p.name)
  const uniquePermissions = [...new Set(permissions)]
  return uniquePermissions
}

const getLeadStatsByUser = async (searchQuery) => {
  const pipeline = [
    {
      // NHÓM dữ liệu
      $group: {
        _id: '$assignedTo',
        processing: {
          $sum: { $cond: [{ $eq: ['$status', 'cham_soc'] }, 1, 0] }
        },
        closed: {
          $sum: { $cond: [{ $eq: ['$status', 'da_chot'] }, 1, 0] }
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$status', 'da_huy'] }, 1, 0] }
        }
      }
    },
    {
      // JOIN Collection
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    // Biến user thành các document riêng biệt
    { $unwind: '$user' },
    {
      // Giống Select để lấy ra field cần thiết
      $project: {
        name: '$user.name',
        processing: 1,
        closed: 1,
        cancelled: 1
      }
    }
  ]

  if (searchQuery) {
    pipeline.push({
      $match: {
        name: { $regex: searchQuery, $options: 'i' } // không phân biệt hoa thường
      }
    })
  }

  return await leadModel.aggregate(pipeline)
}

export const userRepository = {
  createUser,
  findByEmail,
  findById,
  findAll,
  updateById,
  deleteById,
  getPermissionByUserId,
  getLeadStatsByUser
}
