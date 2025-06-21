import React from 'react';
import { FileText, Video, Camera, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  type: string;
  title: string;
  url: string;
  sourceDomain: string;
  thumbnail?: string;
  description?: string;
  createdAt: Date;
}

interface AssetGridProps {
  assets: Asset[];
  onCardClick: (asset: Asset) => void;
}

export default function AssetGrid({ assets, onCardClick }: AssetGridProps) {
  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'webpage':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Asset['type']) => {
    switch (type) {
      case 'video':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'webpage':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (assets.length === 0) {
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-gray-400 mb-4">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No assets found matching your criteria</p>
          <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-semibold text-white mb-6">
        Discovered Assets ({assets.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            onClick={() => onCardClick(asset)}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Asset Preview */}
            <div className="aspect-video bg-gray-800/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-white/10">
              {/* Dynamic preview logic for all asset types */}
              {(() => {
                switch(asset.type) {
                  case 'image':
                    return <img src={asset.url} className="object-cover w-full h-full" alt={asset.title ?? ''} onError={e => { e.currentTarget.src = '/no-preview.png'; }} />;
                  case 'video':
                    return <video src={asset.url} controls className="w-full h-full object-cover" />;
                  case 'schema':
                  case 'robots':
                  case 'sitemap':
                    return <pre className="p-4 text-xs overflow-auto w-full h-full">{asset.description}</pre>;
                  case 'paragraph':
                  case 'meta':
                  case 'title':
                  case 'canonical':
                    return <p className="p-4 text-sm w-full h-full">{asset.description}</p>;
                  case 'heading':
                    return <h3 className="p-4 font-bold w-full h-full">{asset.title ?? ''}</h3>;
                  case 'link':
                  case 'og':
                  case 'twitter':
                    return <p className="p-4 text-sm w-full h-full"><a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline">{asset.title ?? ''}</a></p>;
                  default:
                    return <div className="p-4 w-full h-full">No preview</div>;
                }
              })()}
            </div>

            {/* Asset Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="text-white font-semibold text-sm line-clamp-2 flex-1">
                  {asset.title}
                </h4>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#adff2f] transition-colors ml-2 flex-shrink-0" />
              </div>
              
              <p className="text-gray-400 text-xs line-clamp-2">
                {asset.description || asset.url}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(asset.type)}`}>
                  {asset.type}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 