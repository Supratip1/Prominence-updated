import React from 'react';
import { motion } from 'framer-motion';

interface ScreenshotCardProps {
  src: string;
  alt: string;
  title: string;
}

export default function ScreenshotCard({ src, alt, title }: ScreenshotCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-[1200px] group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="relative bg-white/5  border-white/10 p-4 overflow-hidden">
        {/* Screenshot Image */}
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={src}
            alt={alt}
            className="w-full h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Content */}
        <div className="text-center">
          <h3 className="text-3xl font-semibold text-white mb-2">{title}</h3>
        </div>
        {/* Hover effect glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#adff2f]/0 via-[#adff2f]/5 to-[#adff2f]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
} 