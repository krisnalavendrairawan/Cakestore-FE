import { createLazyFileRoute } from '@tanstack/react-router'
import Customer from '@/features/users/customer'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/_authenticated/users/customer')({
  component: () => (
    <ProtectedRoute>
      <Customer />
    </ProtectedRoute>
  ),
})
