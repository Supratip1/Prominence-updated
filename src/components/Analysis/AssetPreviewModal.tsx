import React from 'react';
import { X, ExternalLink, Download, FileText, Video, Camera } from 'lucide-react';
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

interface AssetPreviewModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetPreviewModal({ asset, onClose }: AssetPreviewModalProps) {
  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'screenshot':
        return <Camera className="w-5 h-5" />;
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
      case 'screenshot':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'webpage':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${getTypeColor(asset.type)}`}>
                {getIcon(asset.type)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{asset.title}</h2>
                <p className="text-gray-400 text-sm">{asset.sourceDomain}</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Preview */}
            <div className="aspect-video bg-gray-800/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-white/10">
              {asset.thumbnail ? (
                <img 
                  src={asset.thumbnail} 
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`p-12 rounded-xl ${getTypeColor(asset.type)}`}>
                  {getIcon(asset.type)}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Asset Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Type</label>
                    <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border ${getTypeColor(asset.type)}`}>
                      {getIcon(asset.type)}
                      <span className="ml-2 capitalize">{asset.type}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Created</label>
                    <p className="text-white">{asset.createdAt.toLocaleString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-400 block mb-2">URL</label>
                    <p className="text-white break-all bg-white/5 p-3 rounded-lg border border-white/10">{asset.url}</p>
                  </div>
                  {asset.description && (
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 block mb-2">Description</label>
                      <p className="text-white bg-white/5 p-3 rounded-lg border border-white/10">{asset.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/10">
            <motion.button
              onClick={() => window.open(asset.url, '_blank')}
              className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Original
            </motion.button>
            <motion.button
              onClick={() => {
                const link = document.createElement('a');
                link.href = asset.url;
                link.download = asset.title;
                link.click();
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl transition-colors shadow-lg shadow-green-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 