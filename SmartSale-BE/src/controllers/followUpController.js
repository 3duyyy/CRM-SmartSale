import { StatusCodes } from 'http-status-codes'
import { followUpService } from '../services/followUpService.js'

const createFollowUp = async (req, res, next) => {
  try {
    const tokenDecoded = req.tokenDecoded
    const result = await followUpService.createFollowUp({ ...req.body, user: req.tokenDecoded._id }, tokenDecoded)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getAllFollowUps = async (req, res, next) => {
  try {
    const { search = '', status = '', page = 1, limit = 6, isPagination = true } = req.query
    const result = await followUpService.getAllFollowUps({
      search,
      status,
      page: parseInt(page),
      limit: parseInt(limit),
      isPagination
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getFollowUpById = async (req, res, next) => {
  try {
    const result = await followUpService.getFollowUpById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateFollowUpById = async (req, res, next) => {
  try {
    const result = await followUpService.updateFollowUpById(req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteFollowUpById = async (req, res, next) => {
  try {
    const result = await followUpService.deleteFollowUpById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const followUpController = {
  createFollowUp,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUpById,
  deleteFollowUpById
}
