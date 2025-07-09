import Joi from 'joi'

export const objectIdValidation = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'ID phải có dạng ObjectId của MongoDB!',
    'string.empty': 'ID không được để trống!',
    'any.required': 'Thiếu ID!'
  })

export const roleOfUserValidation = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Role phải có dạng ObjectId của MongoDB!',
    'string.empty': 'Role không được để trống!',
    'any.required': 'Thiếu Role!'
  })

export const emailValidation = Joi.string().email().required().trim().strict().messages({
  'string.empty': 'Email không được để trống!',
  'string.email': 'Email không hợp lệ!',
  'any.required': 'Thiếu Email!'
})

export const passwordValidation = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  .required()
  .trim()
  .strict()
  .messages({
    'string.pattern.base': 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!',
    'string.empty': 'Mật khẩu không được để trống!',
    'any.required': 'Thiếu password!'
  })

export const nameValidation = Joi.string().min(1).max(30).required().trim().strict().messages({
  'string.empty': 'Tên không được bỏ trống!',
  'string.name': 'Tên không hợp lệ!',
  'any.required': 'Thiếu tên!'
})
