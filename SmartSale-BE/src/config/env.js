import 'dotenv/config'

export const env = {
  DATABASE_URI: process.env.DATABASE_URI,
  PORT: process.env.PORT,

  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,

  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_APP_PASS: process.env.EMAIL_APP_PASS
}
