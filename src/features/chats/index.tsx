// src/features/chat/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import {
  IconArrowLeft,
  IconDotsVertical,
  IconMessages,
  IconPaperclip,
  IconPhotoPlus,
  IconSearch,
  IconSend,
  IconRefresh,
  IconChevronsDown,
  IconMoodSmile,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { chatService } from '@/services/api';
import { Message, ChatUser } from '@/services/interface';

// Remove the nested ChatProvider - this was causing issues
export const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [mobileView, setMobileView] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const currentUser = useAuthStore(state => state.auth.customer?.user || state.auth.staff?.user);
  
  // Filter users by search
  const filteredUsers = chatUsers.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  
  // Group messages by date
  const groupedMessages = messages.reduce((acc: Record<string, Message[]>, message) => {
    const date = format(new Date(message.created_at), 'd MMM, yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  // Load chat users on component mount - similar to CustomerChat
  useEffect(() => {
    fetchChatUsers();
    
    // Refresh users every 30 seconds
    const interval = setInterval(fetchChatUsers, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Load messages when a user is selected - similar to CustomerChat
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      
      // More frequent message polling (5 seconds like CustomerChat)
      const interval = setInterval(() => fetchMessages(selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Detect scroll position to show/hide scroll bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isNearBottom);
    };
    
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

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
      
      // Immediately fetch new messages after sending
      setTimeout(() => fetchMessages(selectedUser.id), 500);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleBackButton = () => {
    setSelectedUser(null);
    setMobileView(false);
  };
  
  return (
    <section className="flex h-[calc(100vh-4rem)] gap-6 overflow-hidden"> {/* Fixed full height */}
      {/* Left Side - Users List */}
      <div className={cn(
        "flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80 border-r border-slate-200 dark:border-slate-800",
        mobileView && selectedUser ? "hidden" : "block"
      )}>
        <div className="sticky top-0 z-10 bg-background pb-3 pt-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Chat</h1>
              <IconMessages size={20} className="text-primary" />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    className="rounded-full hover:bg-primary/10"
                    onClick={fetchChatUsers}
                  >
                    <IconRefresh size={18} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh pengguna</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="relative">
            <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 stroke-slate-500" />
            <input
              type="text"
              className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Cari pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]"> {/* Fixed height for scroll area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Memuat kontak...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-1 px-3">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-secondary/75",
                    selectedUser?.id === user.id && 'bg-muted'
                  )}
                  onClick={() => {
                    setSelectedUser(user);
                    setMobileView(true);
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-muted-foreground/10 shadow-sm">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                      user.online ? "bg-green-500" : "bg-gray-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.lastMessageTime ? format(new Date(user.lastMessageTime), 'HH:mm') : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {user.lastMessage?.message || "Belum ada pesan"}
                      </span>
                      {user.unreadCount && user.unreadCount > 0 && (
                        <Badge variant="primary" className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full text-xs">
                          {user.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <IconSearch size={40} className="text-muted-foreground/50" />
              <p className="text-lg font-medium">Tidak ada pengguna ditemukan</p>
              <p className="text-sm text-muted-foreground">Coba kata kunci lain atau refresh</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Side - Chat */}
      {selectedUser ? (
        <div
          className={cn(
            'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-lg bg-background shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
            mobileView && 'left-0 flex'
          )}
        >
          {/* Chat Header */}
          <div className="sticky top-0 z-10 mb-1 flex flex-none justify-between rounded-t-lg bg-secondary/95 p-4 shadow-md backdrop-blur-sm">
            <div className="flex gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full sm:hidden hover:bg-primary/10"
                onClick={handleBackButton}
              >
                <IconArrowLeft className="text-primary" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-muted-foreground/10 shadow-sm">
                    <AvatarImage src={selectedUser.image} alt={selectedUser.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                      {selectedUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-secondary",
                    selectedUser.online ? "bg-green-500" : "bg-gray-400"
                  )} />
                </div>
                <div>
                  <span className="font-medium">{selectedUser.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {selectedUser.online ? 'Online' : 'Terakhir dilihat ' + selectedUser.lastSeen}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full hover:bg-primary/10"
                      onClick={() => fetchMessages(selectedUser.id)}
                    >
                      <IconRefresh size={18} className="text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh percakapan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full hover:bg-primary/10"
                      onClick={handleBackButton}
                      className="hidden sm:flex"
                    >
                      <IconX size={18} className="text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tutup percakapan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="relative flex-1 px-4 pb-4 pt-0 overflow-hidden">
            <div 
              ref={chatContainerRef}
              className="chat-text-container h-[calc(100vh-16rem)] overflow-y-auto py-4 px-2 space-y-4"
            >
              {Object.keys(groupedMessages).length > 0 ? (
                Object.keys(groupedMessages).map((date) => (
                  <div key={date} className="space-y-4">
                    <div className="sticky top-2 z-10 flex justify-center">
                      <span className="rounded-full bg-secondary/90 backdrop-blur-sm px-4 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        {date}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {groupedMessages[date].map((msg, index) => {
                        const isCurrentUser = msg.sender_id === currentUser?.id;
                        const showAvatar = index === 0 || 
                          groupedMessages[date][index - 1]?.sender_id !== msg.sender_id;
                        
                        return (
                          <div
                            key={`${msg.id}-${index}`}
                            className={cn(
                              'flex items-end gap-2',
                              isCurrentUser ? 'justify-end' : 'justify-start'
                            )}
                          >
                            {!isCurrentUser && showAvatar ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.sender?.image} alt={msg.sender?.name} />
                                <AvatarFallback>
                                  {msg.sender?.name?.substring(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            ) : !isCurrentUser ? (
                              <div className="w-8" />
                            ) : null}
                            
                            <div
                              className={cn(
                                'max-w-md break-words px-4 py-2 text-sm shadow-sm',
                                isCurrentUser 
                                  ? 'rounded-t-lg rounded-bl-lg bg-primary text-primary-foreground' 
                                  : 'rounded-t-lg rounded-br-lg bg-secondary text-secondary-foreground'
                              )}
                            >
                              {!isCurrentUser && showAvatar && (
                                <p className="mb-1 font-medium text-xs text-secondary-foreground/80">
                                  {msg.sender?.name || 'User'}
                                </p>
                              )}
                              <p>{msg.message}</p>
                              <div className={cn(
                                'mt-1 flex justify-end text-[10px]',
                                isCurrentUser ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'
                              )}>
                                {format(new Date(msg.created_at), 'HH:mm')}
                                {isCurrentUser && (
                                  <span className="ml-1">
                                    {msg.is_read ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center">
                  <IconMessages size={48} className="text-muted-foreground/50" />
                  <h2 className="text-xl font-medium">Belum ada percakapan</h2>
                  <p className="text-sm text-muted-foreground">
                    Mulai percakapan dengan {selectedUser.name}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Scroll to bottom button */}
            {showScrollBottom && (
              <Button
                size="icon"
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-lg"
                onClick={scrollToBottom}
              >
                <IconChevronsDown size={20} />
              </Button>
            )}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={handleSendMessage} 
            className="sticky bottom-0 z-10 mt-auto flex items-center gap-2 bg-background p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
          >
            <div className="flex w-full items-center rounded-full border bg-background px-3 shadow-sm focus-within:ring-1 focus-within:ring-primary/40">
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                <IconMoodSmile size={18} className="text-muted-foreground" />
              </Button>
              <input
                type="text"
                className="h-12 w-full bg-inherit px-2 text-sm focus-visible:outline-none"
                placeholder="Tulis pesan..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="flex gap-1">
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                  <IconPaperclip size={18} className="text-muted-foreground" />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                  <IconPhotoPlus size={18} className="text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-full"
              disabled={!newMessage.trim()}
            >
              <IconSend size={18} />
            </Button>
          </form>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 sm:flex">
          <div className="flex flex-col items-center gap-4 px-4 py-12 text-center max-w-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <IconMessages size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Pilih Percakapan</h2>
            <p className="text-muted-foreground">
              Pilih pengguna dari daftar untuk memulai atau melanjutkan percakapan.
              Semua pesan akan diperbarui secara otomatis.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Chat;