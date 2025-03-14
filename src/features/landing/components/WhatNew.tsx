import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NewsItem {
  title: string;
  description: string;
  date: string;
  tag: string;
  tagColor: string;
}

const WhatsNew: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const newsItems: NewsItem[] = [
    {
      title: "New Summer Collection",
      description: "Introducing our refreshing summer collection featuring tropical fruit cakes, light coconut frosting, and vibrant mango mousse. Perfect for your summer celebrations!",
      date: "June 2024",
      tag: "New Collection",
      tagColor: "bg-blue-100 text-blue-600"
    },
    {
      title: "Baking Workshop Series",
      description: "Join our master bakers every weekend for hands-on workshops. Learn the secrets of perfect cake decoration, bread making, and pastry techniques!",
      date: "Starting July 2024",
      tag: "Workshop",
      tagColor: "bg-green-100 text-green-600"
    },
    {
      title: "Custom Wedding Cakes",
      description: "Celebrate your special day with our award-winning wedding cake designs. Book a tasting session and consultation with our wedding cake specialists.",
      date: "Booking Now",
      tag: "Wedding Special",
      tagColor: "bg-pink-100 text-pink-600"
    }
  ];

// Update only the Modal component inside WhatsNew:
const Modal = ({ imageIndex }: { imageIndex: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    onClick={() => setSelectedImage(null)}
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      className="relative w-[90vh] h-[90vh] bg-white rounded-lg overflow-hidden flex items-center justify-center"
      onClick={e => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white/90"
        onClick={() => setSelectedImage(null)}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="w-full h-full flex items-center justify-center p-4">
        <img
          src={`src/assets/image/pamflet/pamflet${imageIndex + 1}.jpg`}
          alt={newsItems[imageIndex].title}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </motion.div>
  </motion.div>
);  

  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-50" id='news'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">What's New at Salma Bakery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest collections, events, and special announcements
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={`src/assets/image/pamflet/pamflet${index + 1}.jpg`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Initial View - Just Title and Tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
                  <Badge className={`mb-2 w-fit ${item.tagColor}`}>
                    {item.tag}
                  </Badge>
                  <h3 className="text-white text-lg font-semibold">
                    {item.title}
                  </h3>
                </div>

                {/* Hover View - Full Description */}
                <div className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div>
                    <Badge className={`mb-2 w-fit ${item.tagColor}`}>
                      {item.tag}
                    </Badge>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-white/80 text-sm">{item.date}</span>
                    <Button 
                      variant="outline" 
                      className="text-black border-white hover:bg-pink-100 hover:text-pink-500 transition-colors"
                      onClick={() => setSelectedImage(index)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage !== null && <Modal imageIndex={selectedImage} />}
      </AnimatePresence>
    </section>
  );
};

export default WhatsNew;