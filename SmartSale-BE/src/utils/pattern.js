import Joi from 'joi'

export const customMessage = {
  id: {
    'string.pattern.base': 'ID phải có dạng ObjectId của MongoDB!',
    'string.empty': 'ID không được để trống!',
    'any.required': 'Thiếu ID!'
  },
  role: {
    'string.pattern.base': 'Role phải có dạng ObjectId của MongoDB!',
    'string.empty': 'Role không được để trống!',
    'any.required': 'Thiếu Role!'
  },
  assignedTo: {
    'string.pattern.base': 'Người được giao Lead phải có dạng ObjectId được giao Lead của MongoDB!',
    'string.empty': 'Người được giao Lead không được để trống!',
    'any.required': 'Thiếu Người được giao Lead!'
  }
}

export const objectIdValidation = Joi.string().pattern(/^[0-9a-fA-F]{24}$/)

export const emailValidation = Joi.string().email().trim().strict().messages({
  'string.empty': 'Email không được để trống!',
  'string.email': 'Email không hợp lệ!',
  'any.required': 'Thiếu Email!'
})

export const passwordValidation = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  .trim()
  .strict()
  .messages({
    'string.pattern.base': 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!',
    'string.empty': 'Mật khẩu không được để trống!',
    'any.required': 'Thiếu password!'
  })

export const nameValidation = Joi.string().min(1).max(30).trim().strict().messages({
  'string.empty': 'Tên không được bỏ trống!',
  'string.name': 'Tên không hợp lệ!',
  'any.required': 'Thiếu tên!'
})

export const phoneValidation = Joi.string()
  .pattern(/^(0|\+84)[1-9][0-9]{8}$/)
  .trim()
  .strict()
  .messages({
    'string.empty': 'Số điện thoại không được bỏ trống!',
    'string.pattern.base': 'Số điện thoại không hợp lệ!',
    'any.required': 'Thiếu số điện thoại!'
  })
