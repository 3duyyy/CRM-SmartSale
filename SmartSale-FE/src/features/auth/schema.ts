import { z } from 'zod'
import { emailSchema, nameSchema, passwordSchema } from '@/shared/schema'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const registerSchema = z
  .object({
    name: nameSchema.min(1, { error: 'Họ tên không được để trống!' }),
    email: emailSchema.min(1, { error: 'Email không được để trống!' }),
    password: passwordSchema.min(1, { error: 'Mật khẩu không được để trống!' }),
    confirmPassword: z.string().min(1, { error: 'Mật khẩu xác nhận không được để trống!' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Mật khẩu xác nhận không khớp!',
    path: ['confirmPassword']
  })
