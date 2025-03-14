import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '@/features/landing/auth/login-customer'

export const Route = createFileRoute('/(auth)/login-customer')({
  component: () => (
      <LoginPage />
  ),
})
