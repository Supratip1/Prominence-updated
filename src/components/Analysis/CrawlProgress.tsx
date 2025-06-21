import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CrawlProgressProps {
  percent: number;
  message: string;
}

export default function CrawlProgress({ percent, message }: CrawlProgressProps) {
  return (
    <motion.div 
      className="mb-12 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-blue-600 mr-4" />
          </motion.div>
          <span className="text-gray-900 font-semibold text-xl">Analyzing Assets...</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{message}</span>
            <span className="font-semibold text-blue-600">{percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-lg shadow-blue-500/30"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-sm">
          This may take a few moments depending on the size of the domain
        </p>
      </div>
    </motion.div>
  );
} 