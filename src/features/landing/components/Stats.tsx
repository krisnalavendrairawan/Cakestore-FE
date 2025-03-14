import { motion } from 'framer-motion';
import { Users, Store, UserCheck } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "10,000+",
      label: "Happy Customers",
      description: "Serving smiles since 2020"
    },
    {
      icon: <Store className="w-8 h-8" />,
      value: "25+",
      label: "Professional Staff",
      description: "Expert bakers & decorators"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      value: "150+",
      label: "Active Resellers",
      description: "Nationwide network"
    }
  ];

  return (
    <section className="py-16 bg-pink-50" id="stats">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-pink-600">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-pink-600 font-medium">{stat.label}</p>
                </div>
              </div>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;