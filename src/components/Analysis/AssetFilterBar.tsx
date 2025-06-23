import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AssetFilterBarProps {
  filters: string[];
  sources: string[];
  onFilterChange: (filters: any) => void;
}

export default function AssetFilterBar({ filters, sources, onFilterChange }: AssetFilterBarProps) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onFilterChange({ type, source: selectedSource });
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    onFilterChange({ type: selectedType, source });
  };

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedSource('all');
    onFilterChange({ type: 'all', source: 'all' });
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-normal text-white flex items-center">
          <Filter className="w-5 h-5 mr-3 text-purple-400" />
          Filter Assets
        </h3>
        {(selectedType !== 'all' || selectedSource !== 'all') && (
          <motion.button
            onClick={clearFilters}
            className="flex items-center text-sm text-white hover:text-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-3">
          <span className="text-sm text-white mr-2 self-center">Type:</span>
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => handleTypeChange(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                selectedType === filter
                  ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Source Filters */}
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-white mr-2 self-center">Source:</span>
            <motion.button
              onClick={() => handleSourceChange('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                selectedSource === 'all'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
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
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  selectedSource === source
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {source}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
} 