// Custom class bắn lỗi
export class ApiError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
    Error.captureStackTrace(this, this.constructor)
    console.error('Error: ', message)
  }
}
