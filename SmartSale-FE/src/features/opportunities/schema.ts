import { emailSchema, nameSchema, objectIdSchema, phoneSchema } from '@/shared/schema'
import z from 'zod'

export const leadSchema = z.object({
  name: nameSchema.min(1, { error: 'Tên khách hàng không được để trống!' }),
  company: z.string().max(50, { error: 'Tên công ty quá dài!' }).optional().nullable().or(z.literal('')),
  email: emailSchema,
  phone: phoneSchema,
  status: z.enum(['moi', 'tiep_can', 'cham_soc', 'da_chot', 'da_huy']),
  value: z.number().min(0, { error: 'Giá trị không được âm' }),
  note: z.string().max(1000, 'Ghi chú quá dài!').optional().nullable().or(z.literal('')),
  assignedTo: objectIdSchema.min(0, { error: 'Người phụ trách là bắt buộc' })
})

export const leadUpdateSchema = z.object({
  name: nameSchema.optional(),
  company: z.string().max(50, { error: 'Tên công ty quá dài!' }).optional().nullable().or(z.literal('')),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  status: z.enum(['moi', 'tiep_can', 'cham_soc', 'da_chot', 'da_huy']).optional(),
  value: z.number().min(0, { error: 'Giá trị không được âm' }).optional(),
  note: z.string().max(1000, 'Ghi chú quá dài!').optional().or(z.literal('')),
  assignedTo: objectIdSchema.optional()
})
