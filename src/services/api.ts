// ini api.ts
import axios from 'axios';
import { User, userListSchema } from '../features/users/staff/data/schema';
import { useAuthStore } from '@/stores/authStore';
import { Category,categoryListSchema } from '@/features/category/data/schema';
import { productListSchema, } from '@/features/products/data/schema';
import {  Order, Payment, CreateOrderData, CreatePaymentData, CartData, UpdatePasswordData, UpdateStaffPasswordData, ChatUser, Message } from './interface';

const staffEndpoints = [
    '/staff',
    '/admin', 
    '/users',
    '/category',
    '/product',
    '/product/create',
    '/product/*/stock',  
    '/product/*/discount', 
    '/orders',
    '/cart',
    '/payments',
    '/logout',
    '/payments/midtrans',
    '/reviews',
    '/chat',
    '/chat/users'
];


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (!config.url) return config;

  const customerToken = useAuthStore.getState().auth.customer.accessToken;
  const staffToken = useAuthStore.getState().auth.staff.accessToken;

  const isSharedEndpoint = ['/category', '/product'].some(endpoint => 
    config.url?.includes(endpoint) && 
    ['GET'].includes(config.method?.toUpperCase() || '')
  ) || 
  config.url?.includes('/cart') || config.url?.includes('/orders') || config.url?.includes('/reviews') || config.url?.includes('/payments') || config.url?.includes('/chat');
  
  if (isSharedEndpoint) {
    const token = customerToken || staffToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
  
  // For staff-specific endpoints
  const isStaffEndpoint = staffEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );
  
  const token = isStaffEndpoint ? staffToken : customerToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});



export const Auth = {
staffLogin: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/staff/login', credentials);
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response format: missing token or user data');
      }

      const token = response.data.token;
      useAuthStore.getState().auth.staff.setAccessToken(token);
      
      
      useAuthStore.getState().auth.staff.setUser({
        ...response.data.user,
        roles: response.data.user.roles || [],
        status: response.data.user.status
      })
      
      return response.data;
    } catch (error) {
      useAuthStore.getState().auth.staff.reset();
      throw error;
    }
  },
  
  Logout: async () => {
    try {
      const token = useAuthStore.getState().auth.staff.accessToken;
      const response = await api.post('/auth/staff/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {

      useAuthStore.getState().auth.staff.reset();
      throw error;
    }
  },

  getCurrentUser: async () => {
      try {
        const token = useAuthStore.getState().auth.staff.accessToken;
        if (!token) return null;

        const response = await api.get('/auth/staff/user');
        
        if (response.data.status === 'success' && response.data.user) {
          const userData = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            roles: response.data.user.roles,
            status: response.data.user.status,
            image: response.data.user.image || '',
            phone_number: response.data.user.phone_number || '',
            address: response.data.user.address || '',
            gender: response.data.user.gender || '',
            created_at: response.data.user.created_at,
            updated_at: response.data.user.updated_at,
            deleted_at: response.data.user.deleted_at
          };

          useAuthStore.getState().auth.staff.setUser(userData);
          return userData;
        }
        return null;
      } catch (error) {
        console.error('Error getting current user:', error);
        useAuthStore.getState().auth.staff.reset();
        return null;
      }
    },


  customerLogin: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/customer/login', credentials);
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response format: missing token or user data');
      }

      const token = response.data.token;
      useAuthStore.getState().auth.customer.setAccessToken(token);
      
      const roles = response.data.user.roles.map((role: any) => role.name);
      
      useAuthStore.getState().auth.customer.setUser({
        ...response.data.user,
        roles: roles,
        status: response.data.user.status,
      });
      
      return response.data;
    } catch (error) {
      useAuthStore.getState().auth.customer.reset();
      throw error;
    }
  },


  customerLogout: async () => {
    try {
      const response = await api.post('/auth/customer/logout');
      
      useAuthStore.getState().auth.customer.reset();
      
      return response.data;
    } catch (error) {
      useAuthStore.getState().auth.customer.reset();
      throw error;
    }
  },

  getCurrentCustomer: async () => {
    try {
      const token = useAuthStore.getState().auth.customer.accessToken;
      if (!token) return null;

      const response = await api.get('/auth/customer/user');
      if (response.data.status === 'success' && response.data.user) {
        const roles = response.data.user.roles.map((role: any) => role.name);
        
        const existingUser = useAuthStore.getState().auth.customer.user;

        
        useAuthStore.getState().auth.customer.setUser({
          ...existingUser,
          ...response.data.user,
          roles: roles,
        });
        return response.data.user;
      }
      return null;
    } catch (error) {
      useAuthStore.getState().auth.customer.reset();
      throw error;
    }
  }
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return userListSchema.parse(response.data.data);
  },

  getStaff: async () => {
    const response = await api.get('/users/staff');
    return userListSchema.parse(response.data.data);
  },

  getCustomers: async () => {
    const response = await api.get('/users/customers');
    return userListSchema.parse(response.data.data);
  },

  createCustomer: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/users/customers', userData);
    return response.data;
  },

  registerCustomer: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/register', userData);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export const staffProfileService = {
  updatePassword: async (passwordData: UpdateStaffPasswordData) => {
    try {
      const response = await api.put('/auth/staff/password', passwordData);
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Password update failed');
      }
      throw new Error(error.message || 'Failed to update password');
    }
  },

updateProfile: async (profileData: FormData) => {
  try {
    const response = await api.post('auth/staff/profile?_method=PUT', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.status === 'success') {
      const userData = response.data.data;
      // Update the auth store with the new user data
      useAuthStore.getState().auth.staff.setUser({
        ...useAuthStore.getState().auth.staff.user,
        ...userData
      });
      
      // Return the complete response
      return response.data;
    }
    
    throw new Error(response.data.message || 'Failed to update profile');
  } catch (error: any) {
    console.error('Staff profile update error:', error?.response?.data || error?.message);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
},

  getProfile: async () => {
    try {
      const response = await api.get('/auth/staff/user');
      return response.data;
    } catch (error: any) {
      console.error('Get staff profile error:', error?.response?.data || error?.message);
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  

};

  export const profileService = {
  updateProfile: async (profileData: FormData) => {
      try {
        const response = await api.post('/user/profile?_method=PUT', profileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('Profile update error:', error?.response?.data || error?.message);
        throw error;
      }
    },

    // Update password
    updatePassword: async (passwordData: UpdatePasswordData) => {
      try {
        const response = await api.put('/user/password', passwordData);
        return response.data;
      } catch (error: any) {
        console.error('Password update error:', error?.response?.data || error?.message);
        throw error;
      }
    },

    // Get current user profile
    getCurrentProfile: async () => {
      try {
        const response = await api.get('/user/profile');
        return response.data;
      } catch (error: any) {
        console.error('Get profile error:', error?.response?.data || error?.message);
        throw error;
      }
    }
  };


    export const categoryService = {
    getCategory: async () => {
      const response = await api.get('/category');
      return categoryListSchema.parse(response.data.data);
    },

    getCategoryBySlug: async (slug: string) => {
      const response = await api.get(`/category/${slug}`);
      return categoryListSchema.parse(response.data.data);
    },

    createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/category', categoryData);
      return response.data;
    },

    updateCategory: async (id: string, categoryData: Partial<Category>) => {
      const response = await api.put(`/category/${id}`, categoryData);
      return response.data;
    },

    deleteCategory: async (id: string) => {
      const response = await api.delete(`/category/${id}`);
      return response.data;
    },
  };

  export const productService = {
    getProduct: async () => {
      const response = await api.get('/product');
      return productListSchema.parse(response.data.data);
    },

  getProductBySlug: async (slug: string) => {
      const response = await api.get(`/product/slug/${slug}`);
      const products = productListSchema.parse(response.data.data);
      if (products.length === 0) {
          throw new Error('Product not found');
      }
      return products[0];
  },

    createProduct: async (productData: FormData) => {
      const response = await api.post('/product', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },

    updateProduct: async (slug: string, productData: FormData) => {
          const response = await api.post(`/product/slug/${slug}?_method=PUT`, productData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          return response.data;
      },

    deleteProduct: async (id: string) => {
      const response = await api.delete(`/product/${id}`);
      return response.data;
    },
    updateProductStock: async (id: string, stock: number) => {
    const response = await api.patch(`/product/${id}/stock`, { stock });
    return response.data;
  },

  updateProductDiscount: async (id: string, discount: number) => {
    const response = await api.patch(`/product/${id}/discount`, { discount });
    return response.data;
  },

  };

  export const cartService = {
    // Get all customer carts
  getAllCustomerCarts: async () => {
      const response = await api.get('/cart/all-customer'); 
      return response.data; 
    },

    // Get cart items for specific user
  getCart: async (userId: number) => {
          const response = await api.get(`/cart/${userId}`);
          return response.data.data;
      },

    // Add item to cart
    addToCart: async (cartData: CartData) => {
      const response = await api.post('/cart', cartData);
      return response.data;
    },

    // Update cart item
    updateCartItem: async (cartId: number, cartData: CartData) => {
      const response = await api.put(`/cart/${cartId}`, cartData);
      return response.data;
    },

    // Remove item from cart
    removeFromCart: async (cartId: number) => {
      const response = await api.delete(`/cart/${cartId}`);
      return response.data;
    },

    // Clear entire cart
    clearCart: async () => {
      const response = await api.delete('/cart');
      return response.data;
    },

    // Get cart total
    getCartTotal: async () => {
      const response = await api.get('/cart/total');
      return response.data.data.total;
    },
  };

  export const orderService = {

      // Get all orders
      getAllOrders: async () => {
        try {
          const response = await api.get('/orders/all');
          return response.data.data;
        } catch (error) {
          console.error('Error fetching orders:', error);
          throw error;
        }
      },

      getOrders: async () => {
        const response = await api.get('/orders');
        return response.data.data;
      },

    // Get single order
    getOrder: async (id: number) => {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    },

    // Create new order
    createOrder: async (orderData: CreateOrderData) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },

    updateOrder: async (orderId: number, orderData: Partial<Order>) => {
      const response = await api.put(`/orders/${orderId}`, orderData);
      return response.data;
    },

    // Cancel order
    cancelOrder: async (orderId: number) => {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data;
    },

    // Update order status
    updateStatus: async (id: number, status: Order['status']) => {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    },

    // Update payment status
    updatePaymentStatus: async (id: number, paymentStatus: Order['payment_status']) => {
      const response = await api.patch(`/orders/${id}/payment-status`, { payment_status: paymentStatus });
      return response.data;
    },

    // Delete order
    deleteOrder: async (id: number) => {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    },
  }

  export const paymentService = {
    // Get all payments
    getPayments: async () => {
      const response = await api.get('/payments');
      return response.data.data;
    },

    // Get single payment
    getPayment: async (id: number) => {
      const response = await api.get(`/payments/${id}`);
      return response.data.data;
    },

  // Create new payment
    createPayment: async (paymentData: CreatePaymentData) => {
      const response = await api.post('/payments', paymentData);
      return response.data;
    },

    createCashPayment: async (paymentData: CreatePaymentData) => {
      const response = await api.post('/payments/midtrans/cash', paymentData);
      return response.data;
    },
    // Update payment
    updatePayment: async (id: number, paymentData: Partial<Payment>) => {
      const response = await api.put(`/payments/${id}`, paymentData);
      return response.data;
    },

    // Delete payment
    deletePayment: async (id: number) => {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    }
  };


  export const midtransService = {
    createPayment: async (data: CreatePaymentData) => {
      try {
        const response = await api.post('/payments/midtrans/create', data);
        
        console.log("✅ Raw Response from API:", response);
        
        if (!response.data?.data?.token) {
          console.error("Invalid response structure:", response.data);
          throw new Error("Invalid response structure from server");
        }
        
        return response.data;
      } catch (error: any) { 
        console.error("API Error:", error?.response?.data || error?.message || "Unknown error occurred");
        throw error;
      }
    },

    handleNotification: async (notificationData: any) => {
      try {
        
        const response = await api.post('/payments/midtrans/notification', notificationData);
        console.log("Notification response:", response.data);
        
        return response.data;
      } catch (error: any) { 
        console.error("Midtrans Notification Error:", error?.response?.data || error?.message || "Unknown error occurred");
        throw error;
      }
    },

    checkPaymentStatus: async (orderId: number) => {
      try {
        const response = await api.get(`/payments/midtrans/status/${orderId}`);
        console.log("Payment status response:", response.data);
        return response.data;
      } catch (error: any) { 
        console.error("Payment Status Check Error:", error?.response?.data || error?.message || "Unknown error occurred");
        throw error;
      }
    }
  };


  export const reviewService = {
    getAllReviews: async () => {
      try {
        const response = await api.get('/reviews');
        return response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
    },
    
    createReview: async (reviewData: {
      product_id: number;
      rating: number;
      review_text: string;
    }) => {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    },

    getUserProductReviews: async () => {
      const response = await api.get('/reviews/user');
      return response.data; 
    },

  addReply: async (reviewId: number, reply: string) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/reply`, { reply });
      return response.data;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  },

    updateReply: async (reviewId: number, reply: string) => {
      try {
        const response = await api.put(`/reviews/${reviewId}/reply`, { reply });
        return response.data;
      } catch (error) {
        console.error('Error updating reply:', error);
        throw error;
      }
    },
    deleteReview: async (reviewId: number) => {
      try {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
      }
    }
  };


export const chatService = {
  getUsers: async (userType?: string): Promise<ChatUser[]> => {
    // Make sure we're passing the userType parameter correctly
    const url = userType ? 
      `/chat/users?user_type=${userType}` : 
      '/chat/users';
      
    const response = await api.get(url);
    
    // Log response for debugging
    console.log('Chat users response:', response.data);
    
    return response.data.users;
  },

  getMessages: async (receiverId: number): Promise<Message[]> => {
    const response = await api.get(`/chat/messages/${receiverId}`);
    return response.data.messages;
  },

  sendMessage: async (receiverId: number, message: string): Promise<Message> => {
    const response = await api.post('/chat/send', {
      receiver_id: receiverId,
      message,
    });
    return response.data.message;
  },

  getUnreadMessages: async (): Promise<number> => {
    const response = await api.get('/chat/unread');
    return response.data.unread_count;
  }
}