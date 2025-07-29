import { StatusCodes } from 'http-status-codes'
import { leadService } from '../services/leadService.js'
import { sendLeadEmail } from '../services/mailService.js'
import { leadEmailTemplates } from '../utils/emailTemplate.js'

const createNew = async (req, res, next) => {
  try {
    const result = await leadService.createNew(req.body, req.tokenDecoded.id)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getAllLeads = async (req, res, next) => {
  try {
    const { status, assignedTo, search } = req.query

    const result = await leadService.getAllLeads({ status, assignedTo, search })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getLeadById = async (req, res, next) => {
  try {
    const result = await leadService.getLeadById(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  try {
    const result = await leadService.updateById(req.params.id, req.body, req.tokenDecoded.roleName)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  try {
    const result = await leadService.deleteById(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const sendMailToLead = async (req, res, next) => {
  try {
    const { email, name, company, value, status } = req.body

    const templateMail =
      status === 'da_chot'
        ? leadEmailTemplates.da_chot({ name })
        : status === 'da_huy'
          ? leadEmailTemplates.da_huy({ name })
          : leadEmailTemplates.default({ name, company, value })

    await sendLeadEmail({
      to: email,
      subject: templateMail.subject,
      html: templateMail.html
    })

    return res.status(200).json({ success: true, message: 'Email đã được gửi thành công!' })
  } catch (error) {
    next(error)
  }
}

export const leadController = {
  createNew,
  getLeadById,
  getAllLeads,
  updateById,
  deleteById,
  sendMailToLead
}
