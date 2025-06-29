import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface AssetDiscoveryFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disableSubmit?: boolean;
  isAnalyzing?: boolean;
}

export default function AssetDiscoveryForm({ value, onChange, onSubmit, disableSubmit, isAnalyzing }: AssetDiscoveryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disableSubmit) {
      onSubmit();
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
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
          <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter domain or URL (e.g., example.com)"
            className="w-full h-12 sm:h-16 pl-14 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 text-lg"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={disableSubmit}
          className="h-12 sm:h-16 px-8 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/30 w-full sm:w-auto mt-2 sm:mt-0"
        >
          {isAnalyzing ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
    </motion.form>
  );
} 