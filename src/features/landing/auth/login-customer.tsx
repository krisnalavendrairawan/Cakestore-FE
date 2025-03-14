import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Cake, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Auth } from '@/services/api';
  import { useAuthStore } from '@/stores/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();



const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    console.log('Attempting login with:', { email });

    const response = await Auth.customerLogin({ email, password });
    
    const authState = useAuthStore.getState();
    console.log('Auth store state after login:', {
      customer: authState.auth.customer,
      token: authState.auth.customer.accessToken,
      userData: authState.auth.customer.user
    });
    
    // Check localStorage directly
    const storedUserData = localStorage.getItem('customer_user_data');

    // Verify the data is being passed correctly
    if (!authState.auth.customer.user) {
      console.error('User data not set in auth store after login');
      throw new Error('Login successful but user data not stored');
    }

    navigate({ to: '/landing' });
  } catch (err: any) {
    console.error('Login error:', err);
    if (err.response) {
      console.error('Error response:', {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      });
    }
    
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Login gagal. Silakan coba lagi.');
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 flex justify-center">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Cake className="w-7 h-7 text-pink-600" />
              </div>
              <span className="text-2xl font-bold text-white">
                Salma Bakery
              </span>
            </motion.div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Customer Login
            </h1>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-200/50"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                to="/register-customer"
                className="text-pink-600 hover:text-pink-800 font-medium transition-colors"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Background decorations */}
      <div className="fixed top-20 left-20 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-32 h-32 bg-pink-200 rounded-full blur-3xl"
        />
      </div>
      <div className="fixed bottom-20 right-20 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="w-40 h-40 bg-purple-200 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default LoginPage;