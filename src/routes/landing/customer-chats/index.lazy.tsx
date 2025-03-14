import { CustomerProtectedRoute } from '@/components/customer-protected-route'
import { createLazyFileRoute } from '@tanstack/react-router'
import CustomerChats from '@/features/landing/customer-chats'

export const Route = createLazyFileRoute('/landing/customer-chats/')({
  component: CustomerOrdersRoute,
})

function CustomerOrdersRoute() {
  return (
    <CustomerProtectedRoute>
      <CustomerChats />
    </CustomerProtectedRoute>
  )
}
