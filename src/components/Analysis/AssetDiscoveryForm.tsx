import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface AssetDiscoveryFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AssetDiscoveryForm({ value, onChange, onSubmit, disabled }: AssetDiscoveryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  return (
    <motion.section 
      id="analysis" 
      className="py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#adff2f] to-[#7cfc00] bg-clip-text text-transparent">
              Asset Discovery
            </span>{' '}
            & Analysis
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and analyze digital assets from any domain or competitor
          </p>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter domain or URL (e.g., example.com)"
                disabled={disabled}
                className="w-full h-16 pl-14 pr-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#adff2f]/50 focus:border-[#adff2f]/50 disabled:opacity-50 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="h-12 sm:h-16 px-8 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 w-full sm:w-auto mt-2 sm:mt-0"
            >
              Analyze
            </button>
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
} 