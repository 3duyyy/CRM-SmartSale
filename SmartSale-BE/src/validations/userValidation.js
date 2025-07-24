import Joi from 'joi'
import { customMessage, emailValidation, nameValidation, objectIdValidation, passwordValidation } from '../utils/pattern.js'
import { ApiError } from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const getUserById = async (req, res, next) => {
  const reqParamsSchema = Joi.object({
    id: objectIdValidation.required().messages(customMessage.id)
  })

  try {
    await reqParamsSchema.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

const createUser = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: nameValidation.required(),
    email: emailValidation.required(),
    password: passwordValidation.required(),
    roles: objectIdValidation.required().messages(customMessage.role)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

const updateById = async (req, res, next) => {
  const reqBodySchema = Joi.object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    roles: objectIdValidation.messages(customMessage.role)
  })
    .min(1)
    .unknown(false)
    .messages({
      'object.min': 'Dữ liệu cập nhật không được để trống!'
    })

  try {
    await reqBodySchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

export const userValidation = {
  getUserById,
  updateById,
  createUser
}
