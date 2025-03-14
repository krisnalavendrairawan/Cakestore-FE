import { createLazyFileRoute } from '@tanstack/react-router'
import Orders from '@/features/transactions/orders'

export const Route = createLazyFileRoute(
  '/_authenticated/transactions/orders/',
)({
  component: Orders,
})
