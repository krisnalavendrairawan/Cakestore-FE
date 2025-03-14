
import { useEffect, useState } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';

export function ProtectedRoute({ 
  children, 
  redirectTo = '/sign-in' 
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { staff } = useAuthStore().auth;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!staff.accessToken);

  useEffect(() => {
    console.log('Staff token:', staff.accessToken);
    const checkAuth = async () => {
      if (staff.accessToken) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [staff.accessToken]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
}