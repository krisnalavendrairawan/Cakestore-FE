import { createLazyFileRoute } from '@tanstack/react-router'
import Category from '@/features/category'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/category/')({
  component: () => (
    <ProtectedRoute>
      <Category />
    </ProtectedRoute>
  ),
})
