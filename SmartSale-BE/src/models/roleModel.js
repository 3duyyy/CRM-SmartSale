import mongoose from 'mongoose'

// MongoDB quan hệ N-N chỉ cần viết 1 chiều và khi cần chỉ cần truy vấn ngược là được
const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: {
      type: String,
      default: ''
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'roles'
  }
)

export const roleModel = mongoose.model('Role', roleSchema)
