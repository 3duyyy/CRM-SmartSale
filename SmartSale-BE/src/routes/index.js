import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { authRoute } from './authRoute.js'
import { userRoute } from './userRoute.js'

const Router = express.Router()
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'api ready to use', code: StatusCodes.OK })
})
Router.use('/auth', authRoute)
Router.use('/users', userRoute)

export const api = Router
