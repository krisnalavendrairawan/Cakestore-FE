import { createLazyFileRoute } from '@tanstack/react-router'
import StaffPasswordChange from '@/features/auth/change-password'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/(auth)/change-password')({
  component: () => (
    <ProtectedRoute>
      <StaffPasswordChange />
    </ProtectedRoute>
  ),
})
