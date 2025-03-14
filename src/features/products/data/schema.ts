import { z } from 'zod'



export const productSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  discount: z.number(),
  stock: z.number(),
  image: z.string(),
})



export type Product = z.infer<typeof productSchema>

export const productListSchema = z.array(productSchema)

export const apiResponseSchema = z.object({
  status: z.string(),
  data: productListSchema
})

export type ApiResponse = z.infer<typeof apiResponseSchema>