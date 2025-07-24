import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/ApiError.js'
import cors from 'cors'

const allowedOrigins = ['http://localhost:5173']
export const corsOption = {
  origin: (origin, callback) => {
    // Cho phép tất cả request ko có origin (VD: Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new ApiError('Not allowed by CORS!', StatusCodes.FORBIDDEN))
    }
  },
  credentials: true
}
