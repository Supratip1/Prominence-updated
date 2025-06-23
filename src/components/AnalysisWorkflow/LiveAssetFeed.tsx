import React, { useRef, useEffect } from 'react';
import { FileText, Video, Camera, File, Globe, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Asset {
  id: string;
  type: 'webpage' | 'video' | 'screenshot' | 'document' | 'social';
  title: string;
  url: string;
  sourceDomain: string;
  thumbnail?: string;
  description?: string;
  createdAt: Date;
  size?: string;
  status: 'active' | 'inactive' | 'error';
}

interface LiveAssetFeedProps {
  assets: Asset[];
}

export default function LiveAssetFeed({ assets }: LiveAssetFeedProps) {
  const getIcon = (type: Asset['type']) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    switch (type) {
      case 'video': return <Video className={iconClass} />;
      case 'screenshot': return <Camera className={iconClass} />;
      case 'webpage': return <FileText className={iconClass} />;
      case 'document': return <File className={iconClass} />;
      case 'social': return <Globe className={iconClass} />;
      default: return <FileText className={iconClass} />;
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

  if (assets.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="mb-8 sm:mb-12 max-w-4xl mx-auto px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-3 h-3 bg-[#adff2f] rounded-full animate-pulse"></div>
          <h3 className="text-lg sm:text-xl font-normal text-white">
            Live Asset Discovery
          </h3>
          <span className="text-sm text-gray-400">
            ({assets.length} found)
          </span>
        </div>
        
        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
          <AnimatePresence>
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className={`p-2 rounded-lg border ${getTypeStyles(asset.type)} flex-shrink-0`}>
                  {getIcon(asset.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white font-normal text-sm sm:text-base truncate">
                        {asset.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">
                        {asset.url}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#adff2f] transition-colors flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeStyles(asset.type)}`}>
                      {asset.type}
                    </span>
                    {asset.size && (
                      <span className="text-xs text-gray-500">
                        {asset.size}
                      </span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${
                      asset.status === 'active' ? 'bg-green-400' : 
                      asset.status === 'inactive' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {assets.length > 5 && (
          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing latest {Math.min(assets.length, 10)} assets discovered...
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 