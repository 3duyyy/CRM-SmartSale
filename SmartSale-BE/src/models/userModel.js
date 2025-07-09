import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minLength: 8 },
    // Phải dùng _id vì khi populate sẽ populate bằng id
    roles: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users'
  }
)

// Name trong mongoose.model là tên Model → Mongoose tự tạo collection roles
export const userModel = mongoose.model('User', userSchema)
