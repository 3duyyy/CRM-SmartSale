import Joi from 'joi'
import { ApiError } from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { emailValidation, nameValidation, passwordValidation } from '../utils/pattern.js'

const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation
  }).unknown(false)

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: emailValidation,
    password: passwordValidation
  }).unknown(false)

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

export const authValidation = {
  register,
  login
}
