import { CustomerProtectedRoute } from '@/components/customer-protected-route'
import { createLazyFileRoute } from '@tanstack/react-router'
import Profile from '@/features/landing/auth/ProfileManagement'

export const Route = createLazyFileRoute('/landing/customer/profile')({
  component: CustomerOrdersRoute,
})

function CustomerOrdersRoute() {
  return (
    <CustomerProtectedRoute>
      <Profile />
    </CustomerProtectedRoute>
  )
}
