import { CustomerProtectedRoute } from '@/components/customer-protected-route'
import { createLazyFileRoute } from '@tanstack/react-router'
import Review from '@/features/landing/reviews'

export const Route = createLazyFileRoute('/landing/reviews/')({
  component: CustomerOrdersRoute,
})

function CustomerOrdersRoute() {
  return (
    <CustomerProtectedRoute>
      <Review />
    </CustomerProtectedRoute>
  )
}
