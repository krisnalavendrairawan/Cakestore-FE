import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import { ProtectedRoute } from '@/components/protected-route'


export const Route = createFileRoute('/_authenticated/')({
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
})
