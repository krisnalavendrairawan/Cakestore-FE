import { createFileRoute } from '@tanstack/react-router'
import ProcessingOrders from '@/features/transactions/processing-orders'

export const Route = createFileRoute(
  '/_authenticated/transactions/processing-orders/',
)({
  component: ProcessingOrders,
})
