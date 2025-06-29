import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  type: 'webpage' | 'video' | 'screenshot' | 'document' | 'social';
  sourceDomain: string;
  status: 'active' | 'inactive' | 'error';
}

interface AssetFilterBarProps {
  filters: string[];
  sources: string[];
  onChange: (filters: any) => void;
  currentFilters: {
    type: string;
    source: string;
    status: string;
  };
}

export default function AssetFilterBar({ filters, sources, onChange, currentFilters }: AssetFilterBarProps) {
  const handleTypeChange = (type: string) => {
    onChange({ ...currentFilters, type });
  };

  const handleSourceChange = (source: string) => {
    onChange({ ...currentFilters, source });
  };

  const handleStatusChange = (status: string) => {
    onChange({ ...currentFilters, status });
  };

  const clearFilters = () => {
    onChange({ type: 'all', source: 'all', status: 'all' });
  };

  const hasActiveFilters = currentFilters.type !== 'all' || currentFilters.source !== 'all' || currentFilters.status !== 'all';

  return (
    <motion.div 
      className="mb-6 sm:mb-8 max-w-6xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-normal text-white flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-purple-400" />
            Filter Assets
          </h3>
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <XMarkIcon className="w-4 h-4" />
              Clear Filters
            </motion.button>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Type Filters */}
          <div>
            <span className="text-sm text-gray-400 mb-3 block">Asset Type:</span>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => handleTypeChange(filter)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                    currentFilters.type === filter
                      ? 'bg-[#adff2f]/20 text-[#adff2f] border-[#adff2f]/50 shadow-lg shadow-green-500/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Source Filters */}
          {sources.length > 0 && (
            <div>
              <span className="text-sm text-gray-400 mb-3 block">Source Domain:</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <motion.button
                  onClick={() => handleSourceChange('all')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                    currentFilters.source === 'all'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-400/50 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Sources
                </motion.button>
                {sources.map((source) => (
                  <motion.button
                    key={source}
                    onClick={() => handleSourceChange(source)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                      currentFilters.source === source
                        ? 'bg-purple-500/20 text-purple-400 border-purple-400/50 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {source}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Status Filters */}
          <div>
            <span className="text-sm text-gray-400 mb-3 block">Status:</span>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['all', 'active', 'inactive', 'error'].map((status) => (
                <motion.button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                    currentFilters.status === status
                      ? 'bg-purple-500/20 text-purple-400 border-purple-400/50 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 