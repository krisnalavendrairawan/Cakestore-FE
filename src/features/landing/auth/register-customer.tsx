import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Cake, EyeIcon, EyeOffIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { userService } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

const PASSWORD_CRITERIA = [
  { id: 'length', label: 'At least 8 characters', test: (password: string) => password.length >= 8 },
//   { id: 'uppercase', label: 'At least one uppercase letter', test: (password: string) => /[A-Z]/.test(password) },
//   { id: 'lowercase', label: 'At least one lowercase letter', test: (password: string) => /[a-z]/.test(password) },
  { id: 'number', label: 'At least one number', test: (password: string) => /\d/.test(password) },
//   { id: 'special', label: 'At least one special character', test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    gender: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const { user: customerUser, accessToken: customerToken } = useAuthStore(state => state.auth.customer);

  useEffect(() => {
    if (customerUser && customerToken) {
      navigate({ to: '/landing' });
    }
  }, [customerUser, customerToken, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return false;
    }

    const allCriteriaMet = PASSWORD_CRITERIA.every(criterion => criterion.test(formData.password));
    if (!allCriteriaMet) {
      setError('Password tidak memenuhi kriteria keamanan');
      return false;
    }

    if (!formData.gender) {
      setError('Silakan pilih jenis kelamin');
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError('Nomor telepon tidak valid. Masukkan 10-15 digit angka');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await userService.registerCustomer({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        gender: formData.gender === 'Laki-laki' ? 'male' : 'female',        
        address: formData.address,
        password: formData.password,
        password_confirmation: formData.confirmPassword,

        roles: ['customer'],
      });

      setSuccess(true);
      
      setTimeout(() => {
        navigate({ to: '/login-customer' });
      }, 2000);

    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordScore = (password: string) => {
    if (!password) return 0;
    
    let score = 0;
    PASSWORD_CRITERIA.forEach(criterion => {
      if (criterion.test(password)) score++;
    });
    
    return score;
  };

  const passwordScore = getPasswordScore(formData.password);
  const strengthLabels = ['', 'Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  
  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-gray-200';
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    return colors[score];
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
              Buat Akun Baru
            </h1>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <AlertDescription className="text-green-800">
                  Registrasi berhasil! Redirecting ke halaman login...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  required
                  className="border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Nomor Telepon</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="081234567890"
                  required
                  className="border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                    <RadioGroup
                        value={formData.gender}
                        onValueChange={handleGenderChange}
                        className="flex space-x-6 mt-1"
                        required
                        >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="gender-male" />
                            <Label htmlFor="gender-male" className="cursor-pointer">Laki-laki</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="gender-female" />
                            <Label htmlFor="gender-female" className="cursor-pointer">Perempuan</Label>
                        </div>
                    </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  required
                  className="border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 resize-none min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
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

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-2 mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor(passwordScore)} transition-all duration-300`}
                        style={{ width: `${(passwordScore / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      Kekuatan Password: <span className="font-medium">{strengthLabels[passwordScore]}</span>
                    </p>
                    
                    {/* Password criteria */}
                    <div className="space-y-1 mt-1">
                      {PASSWORD_CRITERIA.map((criterion) => (
                        <div key={criterion.id} className="flex items-center text-xs">
                          <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                            criterion.test(formData.password)
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          }`}>
                            {criterion.test(formData.password) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className={criterion.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                            {criterion.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Konfirmasi Password"
                    required
                    className={`border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 pr-10 ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600">Password tidak sama</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-200/50"
                disabled={isLoading || success}
              >
                {isLoading ? 'Processing...' : 'Daftar'}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link
                to="/login-customer"
                className="text-pink-600 hover:text-pink-800 font-medium transition-colors"
              >
                Login Sekarang
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

export default RegisterPage;