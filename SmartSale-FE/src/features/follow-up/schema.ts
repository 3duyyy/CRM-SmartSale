import { objectIdSchema } from '@/shared/schema'
import z from 'zod'

export const followUpCreateSchema = z.object({
  lead: objectIdSchema,
  type: z.enum(['CALL', 'MAIL']),
  content: z.string().min(1, 'Nội dung không được để trống!'),
  nextFollowUpDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  status: z.enum(['Chưa xử lý', 'Đã hoàn thành', 'Thất bại'])
})

export const followUpUpdateSchema = followUpCreateSchema.omit({ lead: true }).partial()
