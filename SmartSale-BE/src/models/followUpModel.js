import mongoose from 'mongoose'

const followUpSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lead' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['CALL', 'MAIL'], required: true },
    content: { type: String, required: true },
    nextFollowUpDate: { type: Date },
    status: { type: String, enum: ['Chưa xử lý', 'Đã hoàn thành', 'Thất bại'], default: 'Chưa xử lý' }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'follow-ups'
  }
)

export const followUpModel = mongoose.model('FollowUp', followUpSchema)
