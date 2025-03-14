import { z } from 'zod'

const roleSchema = z.union([
  z.literal('admin'),
  z.literal('customer'),
  z.literal('staff')
])

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  gender: z.string(),
  address: z.string(),
  roles: z.array(roleSchema)
})

export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)

export const apiResponseSchema = z.object({
  status: z.string(),
  data: userListSchema
})

export type ApiResponse = z.infer<typeof apiResponseSchema>