import { createLazyFileRoute } from '@tanstack/react-router'
import ProfileChange from '@/features/auth/profile'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createLazyFileRoute('/(auth)/profile')({
  component: () => (
    <ProtectedRoute>
      <ProfileChange />
    </ProtectedRoute>
  ),
})
