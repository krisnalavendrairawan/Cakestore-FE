import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from '@tanstack/react-router'

const CatalogNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/src/assets/image/logo/logo.png" 
              alt="Salma Bakery" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="text-pink-600 font-medium">Products</Link>
            <Link to="/categories" className="text-gray-600 hover:text-pink-600 transition-colors">Categories</Link>
            <Link to="/about" className="text-gray-600 hover:text-pink-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-pink-600 transition-colors">Contact</Link>
            <Button className="bg-pink-600 hover:bg-pink-700">
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                <Link
                  to="/catalog"
                  className="block px-3 py-2 text-pink-600 font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  className="block px-3 py-2 text-gray-600 hover:text-pink-600"
                >
                  Categories
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-gray-600 hover:text-pink-600"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 text-gray-600 hover:text-pink-600"
                >
                  Contact
                </Link>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 mt-4">
                  Order Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default CatalogNavbar;