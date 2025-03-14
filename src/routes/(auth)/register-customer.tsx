import { createFileRoute } from '@tanstack/react-router'
import RegisterPage from '@/features/landing/auth/register-customer'

export const Route = createFileRoute('/(auth)/register-customer')({
  component: () => <RegisterPage />,
})
