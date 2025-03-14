import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import {
  IconArrowLeft,
  IconMessages,
  IconPaperclip,
  IconPhotoPlus,
  IconSend,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { chatService } from '@/services/api';
import { Message, ChatUser } from '@/services/interface';
import CustomerNavbar from '../components/CustomerNavbar';

const CustomerChat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentUser = useAuthStore(state => state.auth.customer.user);

  // Function to filter chat users based on search query
  const filteredChatUsers = chatUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Load chat users on component mount
    fetchChatUsers();
    
    // Set up polling to refresh the user list every 30 seconds
    const interval = setInterval(fetchChatUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Load messages when a user is selected
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      
      // Set up polling to refresh messages every 5 seconds
      const interval = setInterval(() => fetchMessages(selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchChatUsers = async () => {
    try {
      setLoading(true);
      const users = await chatService.getUsers();
      
      setChatUsers(users);
      
      // If we already had a selected user, update their data
      if (selectedUser) {
        const updatedUser = users.find(u => u.id === selectedUser.id);
        if (updatedUser) {
          setSelectedUser(updatedUser);
        }
      }
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || newMessage.trim() === '') return;

    try {
      const sentMessage = await chatService.sendMessage(selectedUser.id, newMessage);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setMobileView(false);
    setMessages([]);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc: Record<string, Message[]>, message) => {
    const date = format(new Date(message.created_at), 'd MMM, yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return (
    <>
      <CustomerNavbar />
      <section className="flex h-[calc(100vh-4rem)] gap-6 pt-16 bg-gradient-to-br from-pink-50 to-white overflow-hidden">
        {/* Left Side - Users List */}
        <div className={cn(
          "flex w-full flex-col gap-2 sm:w-72 lg:w-80 border-r px-4 shadow-sm",
          mobileView && selectedUser ? "hidden" : "block"
        )}>
          <div className="sticky top-0 z-10 bg-background pb-3 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 items-center">
                <IconMessages size={24} className="text-pink-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Chat Support</h1>
              </div>
            </div>

            {/* Search input */}
            <div className="relative mb-3">
              <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-pink-100 focus-visible:ring-pink-200"
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-16rem)]">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-pink-600 rounded-full border-t-transparent"></div>
              </div>
            ) : filteredChatUsers.length > 0 ? (
              filteredChatUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full rounded-xl p-3 text-left hover:bg-pink-50 transition-all duration-200",
                      selectedUser?.id === user.id && 'bg-pink-100 hover:bg-pink-100'
                    )}
                    onClick={() => {
                      setSelectedUser(user);
                      setMobileView(true);
                    }}
                  >
                    <div className="flex w-full gap-3 items-center">
                      <Avatar className="size-12 ring-2 ring-pink-100 shadow-sm">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                        <span className="block line-clamp-1 text-ellipsis text-muted-foreground text-sm">
                          {user.title || (user.roles ? user.roles.join(', ') : 'Staff')}
                        </span>
                      </div>
                      {user.unreadCount && user.unreadCount > 0 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs text-white shadow-lg shadow-pink-200">
                          {user.unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                  <Separator className="my-2 bg-pink-100/50" />
                </React.Fragment>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {searchQuery ? "No staff matching your search" : "No support staff available"}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Side - Chat */}
        {selectedUser ? (
          <div
            className={cn(
              'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md bg-white shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
              mobileView && 'left-0 flex'
            )}
          >
            {/* Chat Header */}
            <div className="mb-1 flex flex-none justify-between rounded-t-md bg-gradient-to-r from-pink-500 to-purple-500 p-4 shadow-lg">
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="-ml-2 h-full sm:hidden text-white hover:bg-white/20"
                  onClick={() => setMobileView(false)}
                >
                  <IconArrowLeft />
                </Button>
                <div className="flex items-center gap-3 lg:gap-4">
                  <Avatar className="size-10 lg:size-12 ring-2 ring-white/70">
                    <AvatarImage src={selectedUser.image} alt={selectedUser.name} />
                    <AvatarFallback className="bg-white text-pink-500">
                      {selectedUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-base font-medium lg:text-lg text-white">
                      {selectedUser.name}
                    </span>
                    <span className="line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-white/80 lg:max-w-none lg:text-sm">
                      {selectedUser.title || (selectedUser.roles ? selectedUser.roles.join(', ') : 'Staff')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* New Back Button for Desktop */}
              <Button
                variant="ghost"
                onClick={handleBackToUsers}
                className="text-white hover:bg-white/20 hidden sm:flex items-center gap-1"
              >
                <IconX size={18} />
                <span>Close Chat</span>
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-0 overflow-hidden">
              <div className="chat-text-container relative flex flex-1 flex-col h-full overflow-hidden">
                <ScrollArea 
                  ref={chatContainerRef}
                  className="flex-1 pr-3 h-[calc(100vh-16rem)]"
                  viewportRef={messagesEndRef}
                >
                  <div className="flex flex-col justify-start gap-4 py-4">
                    {Object.keys(groupedMessages).length > 0 ? (
                      Object.keys(groupedMessages).map((date) => (
                        <React.Fragment key={date}>
                          <div className="flex justify-center my-3">
                            <span className="rounded-full bg-pink-100 px-4 py-1 text-xs font-medium text-pink-600 shadow-sm">
                              {date}
                            </span>
                          </div>
                          
                          {groupedMessages[date].map((msg: Message, index: number) => (
                            <div 
                              key={`${msg.id}-${index}`} 
                              className="flex flex-col"
                            >
                              <div
                                className={cn(
                                  'chat-box max-w-96 break-words px-4 py-3 shadow-md',
                                  msg.sender_id === currentUser?.id
                                    ? 'ml-auto rounded-[20px_20px_0px_20px] bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'rounded-[20px_20px_20px_0] bg-white border border-gray-100'
                                )}
                              >
                                <p className="mb-2 text-sm leading-relaxed">{msg.message}</p>
                                <p className={cn(
                                  "text-right text-xs",
                                  msg.sender_id === currentUser?.id ? "text-white/80" : "text-gray-400"
                                )}>
                                  {format(new Date(msg.created_at), 'HH:mm')}
                                  {msg.sender_id === currentUser?.id && (
                                    <span className="ml-2">
                                      {msg.is_read ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center py-10">
                        <div className="text-center">
                          <IconMessages size={48} className="mx-auto text-pink-300 mb-3" />
                          <span className="block text-muted-foreground mb-2">
                            No messages yet
                          </span>
                          <span className="text-sm text-pink-600">
                            Start the conversation by sending a message!
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="mt-auto flex gap-2 p-3 bg-white border-t border-pink-100">
              <div className="flex w-full items-center rounded-full border border-pink-200 bg-white px-3 shadow-sm focus-within:ring-1 focus-within:ring-pink-300">
                <Button size="icon" variant="ghost" className="h-9 w-9 text-pink-400 hover:text-pink-600 hover:bg-pink-50">
                  <IconPaperclip size={18} />
                </Button>
                <input
                  type="text"
                  className="h-12 w-full bg-inherit px-2 text-sm focus-visible:outline-none"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button size="icon" variant="ghost" className="h-9 w-9 text-pink-400 hover:text-pink-600 hover:bg-pink-50">
                  <IconPhotoPlus size={18} />
                </Button>
              </div>
              <Button 
                type="submit" 
                size="icon"
                disabled={!newMessage.trim()}
                className="rounded-full h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-pink-200/50"
              >
                <IconSend size={18} />
              </Button>
            </form>
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center sm:flex">
            <div className="flex flex-col items-center gap-3 text-center p-6 bg-white rounded-2xl shadow-sm border border-pink-100 max-w-lg">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <IconMessages size={40} className="text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Chat Support!</h2>
              <p className="text-muted-foreground mb-4 text-base">
                Select a support staff from the list to start a conversation. Our team is here to help you with any questions or concerns.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full mt-2">
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-pink-700 mb-1">Quick Response</h3>
                  <p className="text-xs text-gray-600">Our team typically responds within minutes</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-pink-700 mb-1">24/7 Support</h3>
                  <p className="text-xs text-gray-600">Help is available anytime you need it</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default CustomerChat;