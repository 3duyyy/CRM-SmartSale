import { StatusCodes } from 'http-status-codes'
import { followUpRepository } from '../repositories/followUpRepository.js'
import { leadRepository } from '../repositories/leadRepository.js'
import { userRepository } from '../repositories/userRepository.js'

const getDashboardStats = async (req, res, next) => {
  try {
    const search = req.query.search || ''

    const [totalLeads, totalFollowUps, userStats] = await Promise.all([
      leadRepository.countAll(),
      followUpRepository.countCompleted(),
      userRepository.getLeadStatsByUser(search)
    ])

    // Tổng số Lead thành công
    const totalClosed = userStats.reduce((sum, u) => (sum += u.closed), 0)
    // Tỉ lệ thành công
    const closeRate = totalLeads > 0 ? Math.round((totalClosed / totalLeads) * 100) : 0

    res.status(StatusCodes.OK).json({ totalLeads, totalFollowUps, userStats, closeRate })
  } catch (error) {
    next(error)
  }
}

export const dashboardController = {
  getDashboardStats
}
