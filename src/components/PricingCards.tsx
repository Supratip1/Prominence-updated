import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

interface PricingCardsProps {
  plans: Plan[];
}

const PricingCards: React.FC<PricingCardsProps> = ({ plans }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.name}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          )}
          <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 h-full ${plan.popular ? 'border-purple-500/50' : ''}`}>
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">${plan.price}</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-300 mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <motion.button
              className={`w-full py-3 rounded-xl font-semibold ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingCards; 