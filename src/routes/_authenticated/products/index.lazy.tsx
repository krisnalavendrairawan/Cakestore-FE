import { createLazyFileRoute } from '@tanstack/react-router'
import Products from '@/features/products'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/products/')({
  component: () => (
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  ),
})
