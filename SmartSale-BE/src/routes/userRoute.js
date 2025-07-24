import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { userController } from '../controllers/userController.js'
import { userValidation } from '../validations/userValidation.js'
import { checkPermission } from '../middlewares/checkPermission.js'
import { PERMISSIONS } from '../utils/constants.js'

const Router = express.Router()
Router.use(authMiddleware.Authenticate)
Router.route('/')
  .get(checkPermission(PERMISSIONS.VIEW_USER), userController.getAllUsers)
  .post(checkPermission(PERMISSIONS.CREATE_USER), userValidation.createUser, userController.createUser)
Router.route('/:id')
  .get(checkPermission(PERMISSIONS.VIEW_USER_DETAIL), userValidation.getUserById, userController.getUserById)
  .put(checkPermission(PERMISSIONS.EDIT_USER), userValidation.updateById, userController.updateById)
  .delete(checkPermission(PERMISSIONS.DELETE_USER), userController.deleteById)

export const userRoute = Router
