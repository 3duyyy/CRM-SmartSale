import { z } from 'zod'
import { MESSAGE, REGEX } from './pattern'

export const nameSchema = z.string().max(30, { error: 'Tên không được vượt quá 30 ký tự!' }).trim()

export const emailSchema = z.email({ error: MESSAGE.invalidEmail }).max(100, { error: 'Email quá dài!' }).trim()

export const passwordSchema = z.string().regex(REGEX.password, { error: MESSAGE.invalidPassword }).trim()

export const phoneSchema = z.string().regex(REGEX.phone, { error: MESSAGE.invalidPhone }).trim()

export const objectIdSchema = z.string().regex(REGEX.objectId, { error: MESSAGE.invalidObjectId })

export const roleIdSchema = z
  .string()
  .regex(REGEX.objectId, { error: 'Role phải có dạng ObjectId của MongoDB!' })
  .trim()

// 🧑‍💼 AssignedTo ID
export const assignedToSchema = z
  .string()
  .regex(REGEX.objectId, { error: 'Người được giao Lead phải có dạng ObjectId của MongoDB!' })
  .trim()
