import { createLazyFileRoute } from '@tanstack/react-router'
import EditProduct from '@/features/products/edit'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/products/$slug/edit')(
  {
    component: () => (
      <ProtectedRoute>
        <EditProduct />
      </ProtectedRoute>
    ),
  },
)
