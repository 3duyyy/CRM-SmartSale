import { StatusCodes } from 'http-status-codes'
import { leadService } from '../services/leadService.js'

const createNew = async (req, res, next) => {
  try {
    const result = await leadService.createNew(req.body, req.tokenDecoded.id)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getAllLeads = async (req, res, next) => {
  try {
    const result = await leadService.getAllLeads()

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getLeadById = async (req, res, next) => {
  try {
    const result = await leadService.getLeadById(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  try {
    const result = await leadService.updateById(req.params.id, req.body, req.tokenDecoded.roleName)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  try {
    const result = await leadService.deleteById(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const leadController = {
  createNew,
  getLeadById,
  getAllLeads,
  updateById,
  deleteById
}
