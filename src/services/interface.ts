import { Product } from '@/features/products/data/schema';
import { userListSchema } from '@/features/users/staff/data/schema';


export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  gender?: string;
}

export interface UpdatePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface OrderItem {
  id : number;
  product_id: number;
  qty: number;
  price: number;
  discount: number;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: number;
  order_date: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'partially_paid' | 'paid';
  order_items: OrderItem[];
}

export interface MidtransResponse {
  snap_token: string;
  payment_id: number;
  order_id: string;
  redirect_url: string;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  gateway_token?: string;    
  gateway_response?: any;    
  snap_token?: string;       
  transaction_id?: string;    
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  qty: number;
  price: number;
  subtotal: number;
  created_by: number;  // Pastikan field ini ada
  product?: Product;
  user?: User;
}

export interface CreateOrderData {
  user_id: number;
  order_date: string;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'partially_paid' | 'paid';
  order_items: Array<{
    product_id: number;
    qty: number;
    price: number;
    subtotal: number;
  }>;
}

export interface CreatePaymentData {
  user_id: number;   
  order_id: number;
  payment_date: string;  
  amount: number;
payment_method?: string;
  status: string;
  endpoint?: string; // Add this optional property

}

export interface CartData {
  user_id: number;
  product_id: number;
  qty: number;
  price: number;
  subtotal: number;
  created_by: number;
}

export interface UpdateStaffPasswordData {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  roles: string[];
  title?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    name: string;
    image?: string;
  };
  receiver?: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface ChatUser {
  id: number;
  name: string;
  email: string;
  image?: string;
  title?: string;
  lastMessage?: Message;
  unreadCount?: number;
  roles: [];
}