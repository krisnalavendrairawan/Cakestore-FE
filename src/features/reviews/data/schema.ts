import { z } from 'zod'


export const ReviewSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  user : z.object({
    name: z.string(),
    email: z.string(),
  }),
  product_id: z.number(),
  product: z.object({
    id: z.number(),
    name: z.string(),
  }),
  rating: z.number(),
  review_text: z.string(),
  reply: z.string(),
  reply_date: z.string(),
  created_at: z.string(),

})

export type Review = z.infer<typeof ReviewSchema>

export const reviewListSchema = z.array(ReviewSchema)

export const apiResponseSchema = z.object({
  status: z.string(),
  data: reviewListSchema
})

export type ApiResponse = z.infer<typeof apiResponseSchema>