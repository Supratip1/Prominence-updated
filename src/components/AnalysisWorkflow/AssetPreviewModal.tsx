import React from 'react';
import { X, ExternalLink, Calendar, Activity, FileText, Video, Camera, File, Globe } from 'lucide-react';
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

interface AssetPreviewModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetPreviewModal({ asset, onClose }: AssetPreviewModalProps) {
  const getIcon = (type: Asset['type']) => {
    const iconClass = "w-6 h-6";
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${getTypeStyles(asset.type)}`}>
                {getIcon(asset.type)}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-normal text-white">
                  Asset Preview
                </h3>
                <p className="text-sm text-gray-400 capitalize">
                  {asset.type}
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Asset Preview */}
            <div className="aspect-video bg-gray-800/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-white/10 relative">
              {asset.thumbnail ? (
                <img 
                  src={asset.thumbnail} 
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`p-8 rounded-xl ${getTypeStyles(asset.type)}`}>
                  {getIcon(asset.type)}
                </div>
              )}
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(asset.status)}`} />
              </div>
            </div>

            {/* Asset Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-lg sm:text-xl font-normal text-white mb-2">
                  {asset.title}
                </h4>
                {asset.description && (
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {asset.description}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-400 mb-1">URL</div>
                      <a 
                        href={asset.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 transition-colors"
                      >
                        <p className="text-sm text-gray-600 break-all">{asset.url}</p>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Source Domain</div>
                      <div className="text-white text-sm">{asset.sourceDomain}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Created</div>
                      <div className="text-white text-sm">
                        {asset.createdAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {asset.size && (
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Size</div>
                        <div className="text-white text-sm">{asset.size}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeStyles(asset.type)}`}>
                  {asset.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  asset.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                  asset.status === 'inactive' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                  'text-red-400 bg-red-400/10 border-red-400/20'
                }`}>
                  {asset.status}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6 border-t border-white/10">
            <div className="text-xs text-gray-400">
              Asset ID: {asset.id}
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
              <motion.a
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                Open Asset
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 