import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: { type: String, trim: true, default: null },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    status: { type: String, enum: ['moi', 'tiep_can', 'cham_soc', 'da_chot', 'da_huy'], default: 'moi' },
    value: { type: Number, required: true },
    note: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    order: { type: Number, required: true, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'leads'
  }
)

export const leadModel = mongoose.model('Lead', leadSchema)
