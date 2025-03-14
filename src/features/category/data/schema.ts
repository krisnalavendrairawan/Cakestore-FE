import { z } from 'zod'


export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
})

export type Category = z.infer<typeof categorySchema>

export const categoryListSchema = z.array(categorySchema)

export const apiResponseSchema = z.object({
  status: z.string(),
  data: categoryListSchema
})

export type ApiResponse = z.infer<typeof apiResponseSchema>