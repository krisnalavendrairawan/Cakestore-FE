import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";



const AboutUs = () => {
  return (
    <section className="py-16" id="about">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] w-full"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl" />
            
            {/* Dotted pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle, #FF69B4 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            
            {/* Main image */}
            <div className="relative z-10 h-full w-full flex items-center justify-center p-8">
              <img
                src="src/assets/image/products/mc-redvelvet.png"
                alt="Our Store"
                className="object-contain max-h-full max-w-full"
              />
            </div>
            
            {/* Info badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20">
              <p className="text-pink-600 font-medium">Est. 2020</p>
              <p className="text-sm text-gray-600">Crafting Sweet Memories</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold mb-6">
              About Us
              <span className="block text-pink-600">Creating Sweet Moments For Every Occasion</span>
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Salma Bakery began with a simple passion for creating extraordinary desserts. 
              Today, we're proud to be one of the most beloved bakeries in the city, known 
              for our artisanal cakes and commitment to quality.
            </p>

            <ul className="space-y-4">
              {[
                "Premium ingredients sourced locally",
                "Custom cake design services",
                "Professional pastry chefs",
                "Nationwide delivery available"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <ChevronRight className="text-pink-600 w-5 h-5" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-4 pt-4">
              <Button className="bg-pink-600 hover:bg-pink-700">
                Our Story
              </Button>
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;