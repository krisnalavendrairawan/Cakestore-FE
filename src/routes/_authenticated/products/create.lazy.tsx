import { createLazyFileRoute } from '@tanstack/react-router'
import CreateProduct from '@/features/products/create'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/products/create')({
  component: () => (
    <ProtectedRoute>
      <CreateProduct />
    </ProtectedRoute>
  ),
})
