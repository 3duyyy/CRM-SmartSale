import { StatusCodes } from 'http-status-codes'
import { roleService } from '../services/roleService.js'

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles()
    res.status(StatusCodes.OK).json(roles)
  } catch (error) {
    next(error)
  }
}

export const roleController = {
  getAllRoles
}
