import express from 'express'
import { checkPermission } from '../middlewares/checkPermission.js'
import { PERMISSIONS } from '../utils/constants.js'
import { leadValidation } from '../validations/leadValidation.js'
import { leadController } from '../controllers/leadController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const Router = express.Router()
Router.use(authMiddleware.Authenticate)
Router.route('/drag').put(checkPermission(PERMISSIONS.REORDER_LEAD), leadValidation.dragLead, leadController.dragLead)
Router.route('/')
  .get(checkPermission(PERMISSIONS.VIEW_LEAD), leadController.getAllLeads)
  .post(checkPermission(PERMISSIONS.CREATE_LEAD), leadValidation.createNew, leadController.createNew)
Router.route('/:id')
  .get(checkPermission(PERMISSIONS.VIEW_LEAD_DETAIL), leadController.getLeadById)
  .put(checkPermission(PERMISSIONS.EDIT_LEAD), leadValidation.updateLead, leadController.updateById)
  .delete(checkPermission(PERMISSIONS.DELETE_LEAD), leadController.deleteById)
Router.route('/send-email').post(checkPermission(PERMISSIONS.SEND_MAIL), leadValidation.sendMailToLead, leadController.sendMailToLead)
export const leadRoute = Router
