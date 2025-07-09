import { roleModel } from '../models/roleModel.js'

const findByName = async (name, selectField) => {
  return await roleModel.findOne({ name }).populate('permissions').select(selectField)
}

export const roleRepository = {
  findByName
}
