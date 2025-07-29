import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { dashboardController } from '../controllers/dashboardController.js'

const Router = express.Router()
Router.use(authMiddleware.Authenticate)
Router.route('/').get(dashboardController.getDashboardStats)

export const dashboardRoute = Router
