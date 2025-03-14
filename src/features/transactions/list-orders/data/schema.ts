import { z } from 'zod'

export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  total_price: z.number(),
  order_date: z.string(),
  status: z.string(),
  payment_status: z.string(),
  order_number: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
    phone_number: z.string(),
  }).optional(),
  order_items: z.array(z.object({
    id: z.number(),
    product_id: z.number(),
    order_id: z.number(),
    qty: z.number(),
    price: z.number(),
    subtotal: z.number(),
    product: z.object({
      id: z.number(),
      name: z.string(),
      image: z.string(),
      price: z.number(),
      discount: z.number(),
    }).optional()
  })).optional(),
  payments: z.array(z.object({
    id: z.number(),
    payment_method: z.string(),
payment_date: z.string().nullable().optional(),
  })).optional(),
  notes: z.string().optional(),
})


export type Order = z.infer<typeof orderSchema>