import React from 'react';
import { FileText, Video, Camera, File, Globe, ExternalLink, Calendar, Activity, Loader2, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface AssetGridProps {
  assets: Asset[];
  onCardClick: (asset: Asset) => void;
}

export default function AssetGrid({ assets, onCardClick }: AssetGridProps) {
  const getIcon = (type: Asset['type']) => {
    const iconClass = "w-5 h-5";
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

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'inactive': return 'bg-yellow-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  if (assets.length === 0) {
    return (
      <motion.div 
        className="text-center py-12 sm:py-16 max-w-4xl mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 sm:p-12 shadow-2xl">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-lg sm:text-xl font-normal text-white mb-2">No Assets Found</h3>
          <p className="text-sm sm:text-base text-gray-400">
            Try adjusting your filters or search terms to find more assets
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="mb-8 sm:mb-12 max-w-6xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-normal text-white mb-2">
          Discovered Assets
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          {assets.length} asset{assets.length !== 1 ? 's' : ''} found and ready for analysis
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            onClick={() => onCardClick(asset)}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Asset Thumbnail/Icon */}
            <div className="aspect-video bg-gray-800/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-white/10 relative">
              {asset.thumbnail ? (
                <img 
                  src={asset.thumbnail} 
                  alt={asset.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.src = '/no-preview.png'; }}
                />
              ) : (
                <div className="text-gray-400 opacity-50">
                  {getIcon(asset.type)}
                </div>
              )}
              
              {/* Status indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(asset.status)}`} />
            </div>

            {/* Asset Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeStyles(asset.type)}`}>
                  {asset.type}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h4 className="font-normal text-white text-sm sm:text-base line-clamp-2">
                {asset.title || 'Untitled Asset'}
              </h4>
              
              <p className="text-xs text-gray-400 line-clamp-2">
                {asset.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
                {asset.size && (
                  <span>{asset.size}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}