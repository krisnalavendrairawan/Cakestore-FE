import { Navigate, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.accessToken

  // Redirect ke home jika user sudah login
  return isAuthenticated ? <Navigate to="/" /> : children
}
