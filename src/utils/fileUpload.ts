export const getImageProductUrl = (fileName: string): string => {
  if (!fileName) return '/placeholder-image.jpg';
  
  try {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/storage/${fileName}`;
  } catch {
    return '/placeholder-image.jpg';
  }
};

export const getCustomerProfileImageUrl = (fileName: string): string => {
  if (!fileName) return '/placeholder-image.jpg';
  
  try {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    // Remove the duplicate path if it exists
    const cleanFileName = fileName
      .replace(/^\/storage\//, '')
      .replace(/^\/?(profile-images\/)+/, '');
    
    return `${baseUrl}/storage/profile-images/${cleanFileName}`;
  } catch {
    return '/placeholder-image.jpg';
  }
};

export const getStaffProfileImageUrl = (fileName: string): string => {
  if (!fileName) return '/placeholder-image.jpg';
  
  try {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    
    const cleanFileName = fileName
      .replace(/^\/storage\//, '')
      .replace(/^\/?(staff-profile-images\/)+/, '');
    
    return `${baseUrl}/storage/staff-profile-images/${cleanFileName}`;
  } catch {
    return '/placeholder-image.jpg';
  }
};