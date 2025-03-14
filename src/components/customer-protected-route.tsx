import { useEffect, useState } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Auth } from '@/services/api';

export function CustomerProtectedRoute({ 
  children, 
  redirectTo = '/login-customer' 
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { customer } = useAuthStore().auth; // Get customer auth specifically
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!customer.accessToken);

  useEffect(() => {
    const checkAuth = async () => {
      if (customer.accessToken) {
        try {
          const userData = await Auth.getCurrentCustomer();
          setIsAuthenticated(!!userData);
        } catch (error) {
          console.error('Failed to verify customer authentication:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [customer.accessToken]);

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if user is not authenticated
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
}