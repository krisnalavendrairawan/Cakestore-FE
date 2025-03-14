import { z } from 'zod'

export const paymentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  order_id: z.number(),
  amount: z.number(),
  payment_method: z.string(),
  payment_date: z.string().nullable().optional(),
  status: z.string(),
  user: z.object({
    name: z.string()
  }).optional(),
  order: z.object({
    order_number: z.string(),
    order_date: z.string(),
    total_price: z.number()
  }).optional()
})

export type Payment = z.infer<typeof paymentSchema>