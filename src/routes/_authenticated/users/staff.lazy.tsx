import { createLazyFileRoute } from '@tanstack/react-router'
import Staff from '@/features/users/staff'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/users/staff')({
  component: () => (
    <ProtectedRoute>
      <Staff />
    </ProtectedRoute>
  ),
})
