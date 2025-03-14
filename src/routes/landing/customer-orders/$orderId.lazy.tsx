import { CustomerProtectedRoute } from '@/components/customer-protected-route'
import { createLazyFileRoute } from '@tanstack/react-router'
import DetailOrder from '@/features/landing/customer-orders/detail-order'

export const Route = createLazyFileRoute('/landing/customer-orders/$orderId')({
  component: OrderDetailRoute,
})

function OrderDetailRoute() {
  const { orderId } = Route.useParams()
  return (
    <CustomerProtectedRoute>
      <DetailOrder orderId={orderId} />
    </CustomerProtectedRoute>
  )
}