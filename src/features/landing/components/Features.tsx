// src/components/cake-store/Features.tsx
import React from 'react';
import { Leaf, Cake, Truck } from 'lucide-react';
import {motion} from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Fresh Ingredients",
      description: "We use only the finest, natural ingredients in all our cakes",
      icon: <Leaf className="h-12 w-12 mb-4 text-green-600" />,
      bgColor: "bg-green-50"
    },
    {
      title: "Custom Orders",
      description: "Create your dream cake with our expert bakers",
      icon: <Cake className="h-12 w-12 mb-4 text-pink-600" />,
      bgColor: "bg-pink-50"
    },
    {
      title: "Same Day Delivery",
      description: "Available for orders placed before 12 PM",
      icon: <Truck className="h-12 w-12 mb-4 text-blue-600" />,
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <section className="py-16 bg-pink-100">
      <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-12"
      >
        Why Choose Us
      </motion.h2>
              <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
            <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`${feature.bgColor} p-8 rounded-2xl transition-transform duration-300 hover:shadow-lg hover:-translate-y-2 text-center`}
          >
              <div className="flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;