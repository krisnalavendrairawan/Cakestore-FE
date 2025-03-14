import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Package, User, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Auth } from '@/services/api';
import { getCustomerProfileImageUrl } from '@/utils/fileUpload';

const CustomerNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthStore().auth.customer;
  const [activePath, setActivePath] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Set active path based on current location
    const path = window.location.pathname;
    setActivePath(path);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await Auth.customerLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/landing">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Salma Bakery
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/landing">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${
                  activePath === '/landing' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            
            <Link to="/landing/catalog">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${
                  activePath === '/landing/catalog' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Catalog</span>
              </Button>
            </Link>
            
            <Link to="/landing/customer-orders">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${
                  activePath === '/landing/customer-orders' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </Button>
            </Link>
            
            {/* New Chat Button */}
            {user && (
              <Link to="/landing/customer-chats">
                <Button 
                  variant="ghost" 
                  className={`flex items-center space-x-1 ${
                    activePath === '/landing/customer-chats' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </Button>
              </Link>
            )}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar>
                      <AvatarImage 
                        src={user.image ? getCustomerProfileImageUrl(user.image) : ''} 
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-pink-100 text-pink-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-800">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/landing/customer/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/landing/customer-orders" className="w-full">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/landing/reviews" className="w-full">
                      My Reviews
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/landing/customer-chats" className="w-full">
                      Chat Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-700 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login-customer">
                  <Button variant="ghost" className="text-gray-700 hover:text-pink-600 hover:bg-pink-50">
                    Login
                  </Button>
                </Link>
                <Link to="/register-customer">
                  <Button className="bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-200/50">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Menu */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="w-5 h-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="flex items-center p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={user.image ? getCustomerProfileImageUrl(user.image) : ''} 
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium truncate">{user.name}</div>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link to="/login-customer" className="w-full">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/register-customer" className="w-full">
                        Register
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {/* Navigation Links */}
                <DropdownMenuItem>
                  <Link to="/landing" className="w-full flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Link to="/landing/catalog" className="w-full flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Catalog
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Link to="/landing/customer-orders" className="w-full flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Order History
                  </Link>
                </DropdownMenuItem>
                
                {/* Add Chat to Mobile Menu */}
                {user && (
                  <DropdownMenuItem>
                    <Link to="/landing/customer-chats" className="w-full flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat Support
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/landing/customer/profile" className="w-full">
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-700 cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default CustomerNavbar;