import React, { useEffect, useRef } from 'react';
import { DocumentTextIcon, VideoCameraIcon, CameraIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import type { FrontendAsset } from '../../pages/Analysis';

interface LiveAssetFeedProps {
  assets: FrontendAsset[];
}

export default function LiveAssetFeed({ assets }: LiveAssetFeedProps) {
  const getIcon = (type: FrontendAsset['type']) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />;
      case 'webpage':
        return <DocumentTextIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case 'webpage': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'image': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'video': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'document': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (assets.length === 0) return null;

  return (
    <motion.div 
      className="mb-12 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-normal text-gray-900 mb-6 flex items-center">
        <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
        Live Asset Feed ({assets.length} discovered)
      </h3>
      
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-h-80 overflow-y-auto shadow-lg">
        <AnimatePresence>
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <motion.div 
                key={asset.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg border ${getTypeStyles(asset.type)}`}>
                    {getIcon(asset.type)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{asset.title}</p>
                    <p className="text-gray-600 text-xs truncate max-w-md">{asset.url}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {asset.createdAt.toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 