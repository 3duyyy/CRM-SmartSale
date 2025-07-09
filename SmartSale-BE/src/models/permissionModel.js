import mongoose from 'mongoose'

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'permissions'
  }
)

export const permissionModel = mongoose.model('Permission', permissionSchema)
