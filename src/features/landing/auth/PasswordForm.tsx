import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PasswordFormProps {
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

export const PasswordForm = ({ isLoading, onSubmit }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
  });

  const newPassword = watch('new_password');
  const oldPassword = watch('old_password');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your account password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="old_password">Current Password</Label>
            <Input
                id="old_password"
                type="password"
                {...register('old_password', { required: 'Current password is required' })}
            />
            {errors.old_password && (
                <p className="text-red-500 text-sm">
                {errors.old_password.message}
                </p>
            )}
            </div>


            <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
                id="new_password"
                type="password"
                {...register('new_password', {
                required: 'New password is required',
                minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                },
                validate: {
                    notSameAsOld: (value) => 
                    value !== oldPassword || 
                    'New password must be different from current password'
                }
                })}
            />
            {errors.new_password && (
                <p className="text-red-500 text-sm">
                {errors.new_password.message}
                </p>
            )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                <Input
                    id="new_password_confirmation"
                    type="password"
                    {...register('new_password_confirmation', {
                    required: 'Please confirm your new password',
                    validate: (value) => 
                        value === newPassword || 
                        'Passwords do not match'
                    })}
                />
                {errors.new_password_confirmation && (
                    <p className="text-red-500 text-sm">
                    {errors.new_password_confirmation.message}
                    </p>
                )}
            </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};