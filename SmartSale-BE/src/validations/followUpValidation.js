import Joi from 'joi'
import { objectIdValidation } from '../utils/pattern.js'
import { ApiError } from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { STATUS_VALUES, TYPE_VALUES } from '../utils/constants.js'

const createFollowUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    lead: objectIdValidation.required(),
    type: Joi.string()
      .valid(...TYPE_VALUES)
      .default('CALL')
      .messages({
        'any.only': 'Loại follow-up không hợp lệ!'
      }),
    content: Joi.string().min(1).required().messages({
      'string.base': 'Nội dung phải là chuỗi!',
      'string.empty': 'Nội dung không được để trống!'
    }),
    nextFollowUpDate: Joi.date().greater('now').optional().messages({
      'date.base': 'Ngày follow-up tiếp theo không hợp lệ!',
      'date.greater': 'Ngày follow-up tiếp theo phải lớn hơn hiện tại!'
    }),
    status: Joi.string()
      .valid(...STATUS_VALUES)
      .default('Chưa xử lý')
      .messages({
        'any.only': 'Trạng thái follow-up không hợp lệ!'
      })
  })

  try {
    req.body = await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

const updateFollowUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    type: Joi.string()
      .valid(...TYPE_VALUES)
      .messages({
        'any.only': 'Loại follow-up không hợp lệ!'
      }),
    content: Joi.string().min(1).messages({
      'string.base': 'Nội dung phải là chuỗi!',
      'string.empty': 'Nội dung không được để trống!'
    }),
    nextFollowUpDate: Joi.date().optional().messages({
      'date.base': 'Ngày follow-up tiếp theo không hợp lệ!'
    }),
    status: Joi.string()
      .valid(...STATUS_VALUES)
      .messages({
        'any.only': 'Trạng thái follow-up không hợp lệ!'
      })
  })
    .min(1)
    .unknown(false)
    .messages({
      'object.min': 'Dữ liệu cập nhật không được để trống!'
    })

  try {
    req.body = await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const messages = error.details.map((e) => e.message)
    next(new ApiError('Dữ liệu không hợp lệ', StatusCodes.BAD_REQUEST, messages))
  }
}

export const followUpValidation = {
  createFollowUp,
  updateFollowUp
}
