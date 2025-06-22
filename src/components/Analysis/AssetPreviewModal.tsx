import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Download, FileText, Video, Camera, File, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FrontendAsset as BaseFrontendAsset } from '../../pages/Analysis';

// helpers for YouTube
function isYouTubeURL(url: string) {
  return /youtu(?:\.be|be\.com)\/(watch\?v=)?/.test(url)
}

function getYouTubeID(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// helpers for Vimeo
function isVimeoURL(url: string) {
  return /vimeo\.com\/\d+/.test(url)
}

function getVimeoID(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

// Extend FrontendAsset locally to add optional description for preview
interface FrontendAsset extends BaseFrontendAsset {
  description?: string;
}

interface AssetPreviewModalProps {
  asset: FrontendAsset;
  onClose: () => void;
}

// Video player component with HLS support
function VideoPlayer({ url, onLoad }: { url: string, onLoad: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && url.endsWith('.m3u8')) {
      // If it's an HLS stream, we'll need to implement HLS.js here
      console.log('HLS stream detected:', url);
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-cover"
      crossOrigin="anonymous"
      onLoad={onLoad}
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default function AssetPreviewModal({ asset, onClose }: AssetPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Debug logging
  console.log('⚙️  AssetPreviewModal got type=', asset.type, 'url=', asset.url);

  const getIcon = (type: FrontendAsset['type']) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'video': return <Video className={iconClass} />;
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
          className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl border ${getTypeStyles(asset.type)}`}>
                {getIcon(asset.type)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{asset.title}</h2>
                <p className="text-gray-600 text-sm">{asset.sourceDomain}</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Preview */}
            <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-200 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
                  <p className="text-gray-600 mt-4">Loading asset preview...</p>
                </div>
              )}

              {asset.type === 'video' ? (
                (() => {
                  // YouTube?
                  if (isYouTubeURL(asset.url)) {
                    const id = getYouTubeID(asset.url)
                    return id
                      ? <iframe
                          className="w-full h-full object-cover"
                          src={`https://www.youtube.com/embed/${id}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={() => setIsLoading(false)}
                        />
                      : <p className="text-gray-700">Invalid YouTube URL</p>
                  }

                  // Vimeo?
                  if (isVimeoURL(asset.url)) {
                    const id = getVimeoID(asset.url)
                    return id
                      ? <iframe
                          className="w-full h-full object-cover"
                          src={`https://player.vimeo.com/video/${id}`}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          onLoad={() => setIsLoading(false)}
                        />
                      : <p className="text-gray-700">Invalid Vimeo URL</p>
                  }

                  // Direct video file?
                  if (/\.(mp4|webm|ogg)$/i.test(asset.url)) {
                    return <VideoPlayer url={asset.url} onLoad={() => setIsLoading(false)} />
                  }

                  // Any other "video" type—fall back to screenshot
                  return (
                    <img
                      src={`http://localhost:3001/api/screenshot?url=${encodeURIComponent(asset.url)}`}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                      onLoad={() => setIsLoading(false)}
                      onError={e => {
                        e.currentTarget.src = '/no-preview.png';
                        setIsLoading(false);
                      }}
                    />
                  )
                })()
              ) : (
                // EVERY non‐video asset now shows a screenshot
                <img
                  src={`http://localhost:3001/api/screenshot?url=${encodeURIComponent(asset.url)}`}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setIsLoading(false)}
                  onError={e => {
                    e.currentTarget.src = '/no-preview.png';
                    setIsLoading(false);
                  }}
                />
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">{asset.title}</h3>
              </div>
              {asset.description && (
                <p className="text-gray-700 text-sm">{asset.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ExternalLink className="w-4 h-4" />
                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                  {asset.url}
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
            <motion.button
              onClick={() => window.open(asset.url, '_blank')}
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors border border-gray-200"
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
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/30"
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