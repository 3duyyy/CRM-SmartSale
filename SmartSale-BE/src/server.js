import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import { env } from './config/env.js'
import { connectDB } from './config/database.js'
import { api } from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import './models/index.js'
import cookieParser from 'cookie-parser'
import { connectRedis } from './config/redis.js'

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
// Route
app.use('/api', api)
// Config middleware error handler
app.use(errorHandler)

await connectDB()
await connectRedis()

app.listen(env.PORT, () => {
  console.log(`Server run on Port: ${env.PORT}`)
})
