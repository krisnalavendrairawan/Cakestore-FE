import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { profileService } from '@/services/api';
import CustomerNavbar from '../components/CustomerNavbar';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { toast } from '@/hooks/use-toast';

const ProfileManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore().auth.customer;

  // Handle Profile Update
  const handleProfileUpdate = async (data: any) => {
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key]?.[0]) {
        formData.append('image', data[key][0]);
      } else if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await profileService.updateProfile(formData);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });

      // Update user data in auth store
      useAuthStore.getState().auth.customer.setUser({
        ...user,
        ...data,
        image: response.data?.image || user?.image,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (data: any) => {
    setIsLoading(true);

    try {
      await profileService.updatePassword(data);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Password updated successfully",
        variant: "default",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <CustomerNavbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Settings</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your account information and security settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm 
              user={user}
              isLoading={isLoading}
              onSubmit={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="password">
            <PasswordForm 
              isLoading={isLoading}
              onSubmit={handlePasswordUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileManagement;
