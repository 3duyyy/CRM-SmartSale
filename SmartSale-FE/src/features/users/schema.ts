import { emailSchema, nameSchema, passwordSchema, roleIdSchema } from '@/shared/schema'
import z from 'zod'

// Schema cho tạo mới user
export const userCreateSchema = z
  .object({
    name: nameSchema.min(1, 'Tên không được để trống!'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { error: 'Mật khẩu xác nhận không được để trống!' }),
    roles: roleIdSchema.min(1, 'Vai trò của người dùng không được để trống!')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp!',
    path: ['confirmPassword']
  })

// Schema cho cập nhật user
export const userUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  roles: roleIdSchema.optional()
})

// Schema cho reset password
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { error: 'Mật khẩu xác nhận không được để trống!' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp!',
    path: ['confirmPassword']
  })
