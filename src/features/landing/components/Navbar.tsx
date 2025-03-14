import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router'
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { user } = useAuthStore().auth.customer;

  // Handle scroll effect
 useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of the navbar
      const targetPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      setIsMobileMenuOpen(false);
    }
  };

  // Logout function
const handleLogout = async () => {
  try {
    await Auth.customerLogout(); // Only call customer logout, regardless of roles
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
  const menuItems = [
    {
      label: "Products",
      subItems: [
        { href: "news", label: "What News" },
        { href: "products", label: "Ours Products" },
      ]
    },
    {
      label: "Information",
      subItems: [
        { href: "stats", label: "Stats" },
        { href: "about", label: "About Us" },
        { href: "testimonials", label: "Testimonials" }
      ]
    },
    { href: "contact", label: "Contact" }
  ];

  return (
    <>
      {/* Top info bar */}

      {/* Main navbar */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Salma Bakery
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.subItems ? (
                    <>
                      <button className="text-gray-700 hover:text-pink-600 transition-colors">
                        {item.label}
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        {item.subItems.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => scrollToSection(subItem.href)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600 transition-colors ${
                              activeSection === subItem.href ? 'text-pink-600' : 'text-gray-700'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={`text-gray-700 hover:text-pink-600 transition-colors ${
                        activeSection === item.href ? 'text-pink-600' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              
{user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center focus:outline-none">
          <Avatar>
            <AvatarImage 
              src={user.image ? getCustomerProfileImageUrl(user.image) : ''} 
              alt={user.name}
            />
            <AvatarFallback className="bg-pink-100 text-pink-600">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
              <Link to="/favorites" className="w-full">
                Favorites
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
      
      {user && (
        <Link to="/landing/catalog">
        <Button className="bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-200/50">
          Order Now
        </Button>
        </Link>
      )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none mr-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={user.image ? getCustomerProfileImageUrl(user.image) : ''} 
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 mr-4">
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
                      <Link to="/favorites" className="w-full">
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-700 cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login-customer" className="mr-4">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-pink-600 hover:bg-pink-50">
                    Login
                  </Button>
                </Link>
              )}
              
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-pink-600" />
                ) : (
                  <Menu className="w-6 h-6 text-pink-600" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {menuItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    {item.subItems ? (
                      <>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="pl-4 space-y-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => scrollToSection(subItem.href)}
                              className={`block w-full text-left py-1 text-sm ${
                                activeSection === subItem.href ? 'text-pink-600' : 'text-gray-700'
                              }`}
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className={`block w-full text-left py-2 ${
                          activeSection === item.href ? 'text-pink-600' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Authentication buttons for mobile */}
                {!user && (
                  <div className="flex flex-col space-y-2">
                    <Link to="/register-customer" className="w-full">
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
                
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  Order Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;