import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/ApiError.js'

export const errorHandler = (err, req, res, next) => {
  // Không phải instance của ApiError thì biến nó thành ApiError mặc định
  if (!(err instanceof ApiError)) {
    console.error('Unhandled error!', err)
    err = new ApiError('Đã có lỗi xảy ra!', StatusCodes.INTERNAL_SERVER_ERROR)
  }

  res.status(err.statusCode).json({
    message: err.message,
    error: err.errors || null
  })
}
