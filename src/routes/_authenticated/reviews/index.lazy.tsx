import { createLazyFileRoute } from '@tanstack/react-router'
import Review from '@/features/reviews'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/reviews/')({
  component: () => (
    <ProtectedRoute>
      <Review />
    </ProtectedRoute>
  ),
})
