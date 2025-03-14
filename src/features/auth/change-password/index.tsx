import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { staffProfileService, Auth } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

const staffPasswordSchema = z.object({
  old_password: z.string().min(1, { message: 'Current password is required' }),
  new_password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  new_password_confirmation: z
    .string()
    .min(8, { message: 'Password confirmation must be at least 8 characters' }),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "Passwords don't match",
  path: ["new_password_confirmation"],
});

const StaffPasswordChange = () => {
    const navigate = useNavigate()
    const { auth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const resetStaffAuth = useAuthStore((state) => state.auth.staff.reset)

    const handleGoBack = () => {
        window.history.back();
    };

    useEffect(() => {
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const allowedRoles = ['staff', 'admin'];
            const hasAllowedRole = auth.staff.user?.roles.some(role => 
                allowedRoles.includes(role.name)
            );
            
            if (!auth.staff.accessToken || !hasAllowedRole) {
                navigate({ to: '/sign-in' })
                return;
            }
        };

        checkAuth();
    }, [auth.staff]);

    const form = useForm<z.infer<typeof staffPasswordSchema>>({
        resolver: zodResolver(staffPasswordSchema),
        defaultValues: {
            old_password: '',
            new_password: '',
            new_password_confirmation: ''
        },
    });

    async function onSubmit(data: z.infer<typeof staffPasswordSchema>) {
        try {
            setIsLoading(true);
            
            await staffProfileService.updatePassword(data);

            toast({
                title: "Success",
                description: "Password updated successfully. You will be logged out.",
            });
            
            setTimeout(async () => {
                try {
                    await Auth.Logout(); 
                    resetStaffAuth()
                    window.location.href = '/sign-in';
                } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/sign-in';
                }
            }, 2000);
            
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update password. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 relative">
                    <Button
                        variant="ghost"
                        className="absolute left-4 top-4 p-2"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex justify-center">
                        <Shield className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Change Your Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ensure your account is using a secure password
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <Alert className="mb-6 bg-blue-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.
                        </AlertDescription>
                    </Alert>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="old_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Current Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <Input 
                                                    {...field} 
                                                    type={showPassword.old ? "text" : "password"}
                                                    className="pl-10 pr-10" 
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, old: !prev.old }))}
                                                >
                                                    <Lock className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <Input 
                                                    {...field} 
                                                    type={showPassword.new ? "text" : "password"}
                                                    className="pl-10 pr-10" 
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                >
                                                    <Lock className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="new_password_confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Confirm New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <Input 
                                                    {...field} 
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    className="pl-10 pr-10" 
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                >
                                                    <Lock className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button 
                                type="submit" 
                                className="w-full py-6 text-lg font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-gray-500">
                    Make sure to remember your new password
                </CardFooter>
            </Card>
        </div>
    );
};

export default StaffPasswordChange;