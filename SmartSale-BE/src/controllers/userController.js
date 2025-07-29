import { StatusCodes } from 'http-status-codes'
import { userService } from '../services/userService.js'

const getAllUsers = async (req, res, next) => {
  try {
    const { searchUser = '', role = '', page = 1, limit = 9, isPagination = true } = req.query

    const result = await userService.getAllUsers({ searchUser, role, page: parseInt(page), limit: parseInt(limit), isPagination })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  try {
    const userData = req.body
    const result = await userService.createUser(userData)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  try {
    const result = await userService.updateUserById(req.params.id, req.body, req.tokenDecoded.roleName)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  try {
    const result = await userService.deleteById(req.params.id, req.tokenDecoded.roleName)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getAllUsers,
  getUserById,
  updateById,
  deleteById,
  createUser
}
