import { createFileRoute } from '@tanstack/react-router'
import { CustomerProtectedRoute } from '@/components/customer-protected-route'
import Catalog from '@/features/landing/catalog'
export const Route = createFileRoute('/landing/catalog/')({
  component: () => (
    <CustomerProtectedRoute>
      <Catalog />
    </CustomerProtectedRoute>
  ),
})

