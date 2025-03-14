import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { chatService } from '@/services/api';
import { ChatUser, Message } from '@/services/interface';
import { useAuthStore } from '@/stores/authStore';

interface ChatContextType {
  chatUsers: ChatUser[];
  selectedUser: ChatUser | null;
  messages: Message[];
  loading: boolean;
  selectUser: (user: ChatUser) => void;
  sendMessage: (message: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = useAuthStore(state => state.auth.customer.user || state.auth.staff.user);
  
  // Make sure we correctly identify staff/admin users
  const isStaffOrAdmin = currentUser?.roles?.some(role => 
    role === 'admin' || role === 'staff'
  );

  const fetchChatUsers = async () => {
    try {
      setLoading(true);
      
      // For staff/admin, fetch only customers
      // For customers, fetch only staff/admin
      const userType = isStaffOrAdmin ? 'customer' : 'staff';
      
      console.log('Current user role:', currentUser?.roles);
      console.log('Fetching users of type:', userType);
      
      const users = await chatService.getUsers(userType);
      
      // Filter out any staff/admin users if we're logged in as staff/admin
      // This is a double-check in case the backend doesn't filter correctly
      const filteredUsers = isStaffOrAdmin 
        ? users.filter(user => {
            // If user has roles property and it's an array
            if (user.roles && Array.isArray(user.roles)) {
              // Check if user has only customer role and no staff/admin roles
              return user.roles.includes('customer') && 
                     !user.roles.some(r => r === 'admin' || r === 'staff');
            }
            // If we can't determine roles, trust the backend filtering
            return true;
          })
        : users;
      
      setChatUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching chat users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      const messageList = await chatService.getMessages(userId);
      setMessages(messageList);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchChatUsers();
    
    // Set up polling to refresh users and unread counts
    const interval = setInterval(fetchChatUsers, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, [currentUser]); // Add currentUser as dependency to refetch when user changes

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const selectUser = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const sendMessage = async (messageText: string) => {
    if (!selectedUser || messageText.trim() === '') return;

    try {
      const sentMessage = await chatService.sendMessage(selectedUser.id, messageText);
      setMessages(prev => [...prev, sentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const refreshUsers = async () => {
    await fetchChatUsers();
  };

  return (
    <ChatContext.Provider
      value={{
        chatUsers,
        selectedUser,
        messages,
        loading,
        selectUser,
        sendMessage,
        refreshUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};