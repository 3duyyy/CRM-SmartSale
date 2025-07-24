import { roleModel } from '../models/roleModel.js'

const findByName = async (name, selectField) => {
  return await roleModel.findOne({ name }).populate('permissions').select(selectField)
}

const getAllRoles = async () => {
  return await roleModel.find().select()
}

const createNewRole = async (roleData) => {
  return await roleModel.create(roleData)
}

export const roleRepository = {
  findByName,
  getAllRoles,
  createNewRole
}
