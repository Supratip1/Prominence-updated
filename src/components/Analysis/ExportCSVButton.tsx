import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type { FrontendAsset } from '../../pages/Analysis';

interface ExportCSVButtonProps {
  assets: FrontendAsset[];
}

export default function ExportCSVButton({ assets }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    if (assets.length === 0) return;

    const headers = ['ID', 'Type', 'Title', 'URL', 'Source Domain', 'Description', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...assets.map(asset => [
        asset.id,
        asset.type,
        `"${asset.title.replace(/"/g, '""')}"`,
        asset.url,
        asset.sourceDomain,
        `"${(asset.description || '').replace(/"/g, '""')}"`,
        asset.createdAt.toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.button
      onClick={exportToCSV}
      disabled={assets.length === 0}
      className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-colors border border-purple-600 shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
      Export CSV ({assets.length})
    </motion.button>
  );
} 