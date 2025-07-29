import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { checkPermission } from '../middlewares/checkPermission.js'
import { PERMISSIONS } from '../utils/constants.js'
import { followUpController } from '../controllers/followUpController.js'
import { followUpValidation } from '../validations/followUpValidation.js'

const Router = express.Router()
Router.use(authMiddleware.Authenticate)
Router.route('/')
  .get(checkPermission(PERMISSIONS.VIEW_FOLLOWUP), followUpController.getAllFollowUps)
  .post(checkPermission(PERMISSIONS.COMPLETE_FOLLOWUP), followUpValidation.createFollowUp, followUpController.createFollowUp)
Router.route('/:id')
  .put(checkPermission(PERMISSIONS.EDIT_FOLLOWUP), followUpValidation.updateFollowUp, followUpController.updateFollowUpById)
  .delete(checkPermission(PERMISSIONS.DELETE_FOLLOWUP), followUpController.deleteFollowUpById)
export const followUpRoute = Router
