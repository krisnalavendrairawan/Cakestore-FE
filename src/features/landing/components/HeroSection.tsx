import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useAnimation } from 'framer-motion';
import { Heart, Cake } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const HeroSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const logoAnimation = {
    hover: {
      scale: 1.05,
      rotate: [0, -2, 2, -2, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.3
        }
      }
    },
    float: {
      y: [0, -15, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }
      }
    }
  };

  useEffect(() => {
    controls.start("float");
  }, []);

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20"
        >
          <div className="w-32 h-32 bg-pink-200 rounded-full blur-3xl" />
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -15, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-20"
        >
          <div className="w-40 h-40 bg-purple-200 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="mb-4 bg-pink-100 text-pink-600 hover:bg-pink-100">
                Freshly Baked Daily
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Discover the Magic of{" "}
              <span className="text-pink-600 relative">
                Artisan Cakes
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-1 bg-pink-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Indulge in our handcrafted cakes made with love and premium ingredients. 
              Each bite tells a story of passion and perfection.
            </motion.p>
            
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link to="/landing/catalog">
              <Button className="bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-200/50 transition-all duration-300 transform hover:-translate-y-1">
                View Menu
              </Button>
              </Link>
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 transition-all duration-300 transform hover:-translate-y-1">
                Book Custom Order
              </Button>
            </motion.div>
          </motion.div>
          
          <div className="relative h-[500px] w-full">
            <motion.div
              className="relative z-10 w-full h-full"
              animate={controls}
              whileHover="hover"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              variants={logoAnimation}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-2xl blur-xl"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  opacity: isHovered ? 0.8 : 0.5
                }}
                transition={{ duration: 0.3 }}
              />
              
              <img
                src="src/assets/image/logo/logo.png"
                alt="Salma Bakery Logo"
                className="rounded-2xl object-contain w-full h-full relative z-20 drop-shadow-xl"
              />

              {/* Star emoticon */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </motion.div>

              {/* Heart emoticon */}
              <motion.div
                className="absolute bottom-4 left-4 sm:bottom-0 sm:-left-4 w-12 h-12 text-pink-500"
                animate={{
                  scale: [1, 1.3, 1],
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Heart size={32} fill="currentColor" />
              </motion.div>

              {/* Cake emoticon - Updated for mobile alignment */}
              <motion.div
                className="absolute bottom-4 right-4 sm:top-1/2 sm:-right-6 w-12 h-12 text-purple-500 z-20"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, -5, 0],
                  rotate: [0, -10, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Cake size={32} fill="currentColor" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;