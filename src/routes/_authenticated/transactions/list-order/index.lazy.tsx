import { createLazyFileRoute } from '@tanstack/react-router'
import ListOrders from '@/features/transactions/list-orders'

export const Route = createLazyFileRoute(
  '/_authenticated/transactions/list-order/',
)({
  component: ListOrders,
})
