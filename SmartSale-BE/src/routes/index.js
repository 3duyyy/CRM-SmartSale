import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { authRoute } from './authRoute.js'
import { userRoute } from './userRoute.js'
import { leadRoute } from './leadRoute.js'

const Router = express.Router()
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'api ready to use', code: StatusCodes.OK })
})
Router.use('/auth', authRoute)
Router.use('/users', userRoute)
Router.use('/leads', leadRoute)

export const api = Router
