import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { staffProfileService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Camera, Mail, Phone, MapPin, User, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getStaffProfileImageUrl  } from '@/utils/fileUpload';

const ProfilePage = () => {
  const staffUser = useAuthStore(state => state.auth.staff.user);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    gender: '',
    image: null as File | null,
  });

  const handleGoBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (staffUser) {
      console.log('🚀 ~ file: profile.tsx ~ line 19 ~ useEffect ~ staffUser', staffUser);
      setFormData({
        name: staffUser.name || '',
        email: staffUser.email || '',
        phone_number: staffUser.phone_number || '',
        address: staffUser.address || '',
        gender: staffUser.gender || '',
        image: null,
      });
      
      setImagePreview(null);
      
      if (staffUser.image && 
          staffUser.image !== 'null' && 
          staffUser.image !== 'undefined' && 
          staffUser.image !== '') {
        setImagePreview(staffUser.image);
      }
    } else {
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        gender: '',
        image: null,
      });
      setImagePreview(null);
    }
  }, [staffUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('phone_number', formData.phone_number);
      form.append('address', formData.address);
      form.append('gender', formData.gender);

      if (formData.image) {
        form.append('image', formData.image);
      }

      await staffProfileService.updateProfile(form);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            className="absolute left-4 top-4 p-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">Staff Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-primary/10">
                  {imagePreview ? (
                    <img 
                      src={imagePreview?.startsWith('blob:') 
                          ? imagePreview
                          : getStaffProfileImageUrl(imagePreview || '')} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== '/placeholder-image.jpg') {
                            target.src = '/placeholder-image.jpg';
                          }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="image" 
                  className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-50"
                    required
                    readOnly
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Gender</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  className="flex space-x-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Address Field - Full Width with Textarea */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="min-h-[100px] pl-10 resize-y"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;