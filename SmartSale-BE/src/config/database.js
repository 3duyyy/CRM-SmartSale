import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URI)
    console.log('MongoDB successfully connected!')
  } catch (error) {
    console.error('MongoDB connection error!', error)
    process.exit(1)
  }
}

export const closeDB = async () => {
  await mongoose.connection.close()
}
