import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "src/assets/image/avatars/1.png",
      content: "The cakes here are absolutely amazing! Every celebration becomes more special with Salma Bakery. The attention to detail and taste is unmatched.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Food Blogger",
      image: "src/assets/image/avatars/2.png",
      content: "As a food critic, I've tried many bakeries, but Salma Bakery stands out. Their innovative flavors and consistent quality make them the best in town.",
      rating: 5
    },
    {
      name: "Amanda Roberts",
      role: "Event Planner",
      image: "src/assets/image/avatars/3.png",
      content: "Working with Salma Bakery for events is always a pleasure. They're professional, reliable, and their cakes never fail to impress my clients.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Reseller Partner",
      image: "src/assets/image/avatars/4.png",
      content: "The quality and service are exceptional. My customers always ask for more, and the team is incredibly supportive of their reseller partners.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 to-white overflow-hidden" id='testimonials'>
      <div className="container mx-auto px-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear what our valued customers have to say about their Salma Bakery experience.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 text-pink-200">
            <Quote size={48} />
          </div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 text-pink-200 transform rotate-180">
            <Quote size={48} />
          </div>

          {/* Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative"
                >
                <Card className="p-8 shadow-lg bg-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-pink-200">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-600 mb-6 italic">
                      "{testimonials[currentIndex].content}"
                    </p>

                    <h3 className="font-semibold text-lg">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-pink-600 text-sm">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-pink-600 w-4' : 'bg-pink-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;