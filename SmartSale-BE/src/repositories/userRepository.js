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

const findAll = async (selectField) => {
  return await userModel
    .find()
    .populate({ path: 'roles', populate: { path: 'permissions' } })
    .select(selectField)
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

export const userRepository = {
  createUser,
  findByEmail,
  findById,
  findAll,
  updateById,
  deleteById,
  getPermissionByUserId
}
