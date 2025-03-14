import { createLazyFileRoute } from '@tanstack/react-router'
import ListPayment from '@/features/transactions/list-payments'

export const Route = createLazyFileRoute(
  '/_authenticated/transactions/list-payment/',
)({
  component: ListPayment,
})
