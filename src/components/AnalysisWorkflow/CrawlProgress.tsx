import React from 'react';
import { Loader2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface CrawlProgressProps {
  percent: number;
  message: string;
}

export default function CrawlProgress({ percent, message }: CrawlProgressProps) {
  return (
    <motion.div 
      className="mb-8 sm:mb-12 max-w-4xl mx-auto px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex-shrink-0"
          >
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#adff2f]" />
          </motion.div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Analyzing Your Digital Assets
            </h3>
            <p className="text-sm sm:text-base text-gray-300">{message}</p>
          </div>
          <div className="flex items-center gap-2 text-[#adff2f] font-bold text-lg sm:text-xl">
            <Activity className="w-5 h-5" />
            {percent}%
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs sm:text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span className="font-semibold text-[#adff2f]">{percent}% Complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 sm:h-4 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-[#adff2f] to-[#7cfc00] h-full rounded-full shadow-lg shadow-green-500/30 relative"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          {[
            { label: 'Pages', icon: '📄', active: percent >= 25 },
            { label: 'Media', icon: '🎬', active: percent >= 50 },
            { label: 'Docs', icon: '📋', active: percent >= 75 },
            { label: 'Social', icon: '🌐', active: percent >= 90 }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`p-2 sm:p-3 rounded-lg border transition-all ${
                item.active 
                  ? 'bg-[#adff2f]/20 border-[#adff2f]/50 text-[#adff2f]' 
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
              animate={{ 
                scale: item.active ? [1, 1.05, 1] : 1,
                opacity: item.active ? 1 : 0.6
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-lg sm:text-xl mb-1">{item.icon}</div>
              <div className="text-xs sm:text-sm font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-4">
          This may take a few moments depending on the size of your digital presence
        </p>
      </div>
    </motion.div>
  );
} 