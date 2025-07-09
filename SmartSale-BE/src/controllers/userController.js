import { StatusCodes } from 'http-status-codes'
import { userService } from '../services/userService.js'

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers()
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  try {
    const result = await userService.updateUserById(req.params.id, req.body, req.tokenDecoded.roleName)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  try {
    const result = await userService.deleteById(req.params.id, req.tokenDecoded.roleName)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getAllUsers,
  getUserById,
  updateById,
  deleteById
}
