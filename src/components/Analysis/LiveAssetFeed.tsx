import React from 'react';
import { FileText, Video, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Asset {
  id: string;
  type: 'video' | 'screenshot' | 'webpage';
  title: string;
  url: string;
  sourceDomain: string;
  thumbnail?: string;
  description?: string;
  createdAt: Date;
}

interface LiveAssetFeedProps {
  assets: Asset[];
}

export default function LiveAssetFeed({ assets }: LiveAssetFeedProps) {
  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'screenshot':
        return <Camera className="w-4 h-4" />;
      case 'webpage':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Asset['type']) => {
    switch (type) {
      case 'video':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'screenshot':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'webpage':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
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
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <motion.span 
          className="w-3 h-3 bg-[#adff2f] rounded-full mr-3"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        Live Asset Feed ({assets.length} discovered)
      </h3>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 max-h-80 overflow-y-auto">
        <AnimatePresence>
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <motion.div 
                key={asset.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg border ${getTypeColor(asset.type)}`}>
                    {getIcon(asset.type)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{asset.title}</p>
                    <p className="text-gray-400 text-xs truncate max-w-md">{asset.url}</p>
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