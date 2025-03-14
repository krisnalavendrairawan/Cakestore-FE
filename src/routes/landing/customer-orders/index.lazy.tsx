import { CustomerProtectedRoute } from '@/components/customer-protected-route'
import { createLazyFileRoute } from '@tanstack/react-router'
import CustomerOrders from '@/features/landing/customer-orders'

export const Route = createLazyFileRoute('/landing/customer-orders/')({
  component: CustomerOrdersRoute,
})

function CustomerOrdersRoute() {
  return (
    <CustomerProtectedRoute>
      <CustomerOrders />
    </CustomerProtectedRoute>
  )
}