import React from 'react';
import { FileText, Video, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FrontendAsset } from '../../pages/Analysis';

interface LiveAssetFeedProps {
  assets: FrontendAsset[];
}

export default function LiveAssetFeed({ assets }: LiveAssetFeedProps) {
  const getIcon = (type: FrontendAsset['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'webpage':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: FrontendAsset['type']) => {
    switch (type) {
      case 'video':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'webpage':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
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
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <motion.span 
          className="w-3 h-3 bg-blue-600 rounded-full mr-3"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
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
                  <div className={`p-2 rounded-lg border ${getTypeColor(asset.type)}`}>
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