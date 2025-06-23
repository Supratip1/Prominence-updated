import React from 'react';
import { Search, Sparkles, Eye } from 'lucide-react';
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
        <div className="flex flex-col items-center justify-center mb-6">
          {/* AI Robot Mascot */}
          <div className="relative mb-4">
            <motion.div
              className="relative flex flex-col items-center"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Robot Head */}
              <div className="w-24 h-20 bg-gradient-to-b from-gray-100 to-gray-300 rounded-3xl border-4 border-purple-400 shadow-lg flex flex-col items-center justify-center relative">
                {/* Eyes */}
                <div className="flex justify-center items-center mt-6 space-x-4">
                  <motion.div
                    className="w-4 h-4 bg-purple-500 rounded-full shadow-lg"
                    animate={{ scale: [1, 1.3, 1], boxShadow: [
                      '0 0 8px #a855f7',
                      '0 0 16px #a855f7',
                      '0 0 8px #a855f7'
                    ] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                  />
                  <motion.div
                    className="w-4 h-4 bg-purple-500 rounded-full shadow-lg"
                    animate={{ scale: [1, 1.3, 1], boxShadow: [
                      '0 0 8px #a855f7',
                      '0 0 16px #a855f7',
                      '0 0 8px #a855f7'
                    ] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  />
                </div>
                {/* Digital Smile */}
                <motion.div
                  className="w-10 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mt-3"
                  animate={{ scaleX: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Antenna */}
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-1 h-6 bg-purple-400 rounded-full mx-auto" />
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mx-auto mt-1 shadow-md" />
                </motion.div>
                {/* Side Ears */}
                <div className="absolute -left-4 top-8 w-4 h-8 bg-gray-300 rounded-full border-2 border-purple-300" />
                <div className="absolute -right-4 top-8 w-4 h-8 bg-gray-300 rounded-full border-2 border-purple-300" />
              </div>
              {/* Robot Body */}
              <div className="w-16 h-10 bg-gradient-to-b from-gray-200 to-gray-400 rounded-2xl border-2 border-purple-200 mt-2 flex items-center justify-center relative">
                {/* Magnifying Glass */}
                <motion.div
                  className="absolute -right-8 top-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Search className="w-8 h-8 text-purple-500 drop-shadow-lg" />
                </motion.div>
                {/* Digital Chest Light */}
                <motion.div
                  className="w-4 h-4 bg-purple-400 rounded-full shadow-lg border-2 border-white"
                  animate={{ scale: [1, 1.2, 1], boxShadow: [
                    '0 0 8px #a855f7',
                    '0 0 16px #a855f7',
                    '0 0 8px #a855f7'
                  ] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
            {/* Sparkles and Effects */}
            <motion.div
              className="absolute -top-6 -right-6"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -left-6"
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Eye className="w-4 h-4 text-purple-500" />
            </motion.div>
            <motion.div
              className="absolute top-4 -left-8"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
            </motion.div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{message}</span>
            <span className="font-semibold text-purple-600">{percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
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