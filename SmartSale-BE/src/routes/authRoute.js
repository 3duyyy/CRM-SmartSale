import express from 'express'
import { authValidation } from '../validations/authValidation.js'
import { authController } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const Router = express.Router()
Router.route('/register').post(authValidation.register, authController.register)
Router.route('/login').post(authValidation.login, authController.login)
Router.route('/logout').post(authController.logout)
Router.route('/refresh-token').post(authController.refreshToken)
Router.route('/me').get(authMiddleware.Authenticate, authController.getMe)

export const authRoute = Router
