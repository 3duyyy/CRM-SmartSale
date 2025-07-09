import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { userController } from '../controllers/userController.js'
import { userValidation } from '../validations/userValidation.js'
import { checkPermission } from '../middlewares/checkPermission.js'
import { PERMISSIONS } from '../utils/constants.js'

const Router = express.Router()
Router.use(authMiddleware.Authenticate)
Router.route('/').get(checkPermission(PERMISSIONS.VIEW_USER), userController.getAllUsers)
Router.route('/:id').get(checkPermission(PERMISSIONS.VIEW_USER_DETAIL), userValidation.getUserById, userController.getUserById)
Router.route('/:id').put(checkPermission(PERMISSIONS.EDIT_USER), userValidation.updateById, userController.updateById)
Router.route('/:id').delete(checkPermission(PERMISSIONS.DELETE_USER), userController.deleteById)

export const userRoute = Router
