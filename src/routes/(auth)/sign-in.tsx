import { createFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: () => (
    <AuthGuard>
      <SignIn />
    </AuthGuard>
  )
})