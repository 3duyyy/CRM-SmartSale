import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_APP_PASS
  }
})

export const sendLeadEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `SmartSale <${env.EMAIL_USER}`,
      to,
      subject,
      html
    }

    return await transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

// Controller viết vào leadController
