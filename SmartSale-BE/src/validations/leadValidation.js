import Joi from 'joi'
import { customMessageObjectId, emailValidation, nameValidation, objectIdValidation, phoneValidation } from '../utils/pattern.js'
import { ApiError } from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: nameValidation.required(),
    company: Joi.string().max(100).allow('', null).messages({
      'string.base': 'Tên công ty phải là chuỗi!',
      'string.max': 'Tên công ty quá dài!'
    }),
    email: emailValidation.required(),
    phone: phoneValidation.required(),
    status: Joi.string().valid('moi', 'tiep_can', 'cham_soc', 'da_chot', 'da_huy').default('moi').messages({
      'any.only': 'Trạng thái không hợp lệ!'
    }),
    value: Joi.number().min(0).required().messages({
      'number.min': 'Giá trị không được âm!',
      'any.required': 'Thiếu giá trị mang lại của người dùng ($)!'
    }),
    note: Joi.string().max(1000).allow('', null).messages({
      'string.base': 'Ghi chú phải là chuỗi!',
      'string.max': 'Ghi chú quá dài!'
    }),
    assignedTo: objectIdValidation.required().messages(customMessageObjectId.assignedTo)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

const updateLead = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: nameValidation,
    company: Joi.string().max(100).allow('', null).messages({
      'string.base': 'Tên công ty phải là chuỗi!',
      'string.max': 'Tên công ty quá dài!'
    }),
    email: emailValidation,
    phone: phoneValidation,
    status: Joi.string().valid('moi', 'tiep_can', 'cham_soc', 'da_chot', 'da_huy').messages({
      'any.only': 'Trạng thái không hợp lệ!'
    }),
    value: Joi.number().min(0).messages({
      'number.min': 'Giá trị không được âm!',
      'any.required': 'Thiếu giá trị mang lại của người dùng ($)!'
    }),
    note: Joi.string().max(1000).allow('', null).messages({
      'string.base': 'Ghi chú phải là chuỗi!',
      'string.max': 'Ghi chú quá dài!'
    }),
    assignedTo: objectIdValidation.messages(customMessageObjectId.assignedTo)
  })
    .min(1)
    .unknown(false)
    .messages({
      'object.min': 'Dữ liệu cập nhật không được để trống!'
    })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

export const leadValidation = {
  createNew,
  updateLead
}
