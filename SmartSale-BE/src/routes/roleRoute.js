import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { roleController } from '../controllers/roleController.js'

const Router = express.Router()
Router.use(authMiddleware.Authenticate)
Router.route('/').get(roleController.getAllRoles)

export const roleRoute = Router
