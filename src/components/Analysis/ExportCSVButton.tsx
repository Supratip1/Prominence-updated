import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface ExportCSVButtonProps {
  assets: Asset[];
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
      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-colors border border-blue-600 shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Download className="w-4 h-4 mr-2" />
      Export CSV ({assets.length})
    </motion.button>
  );
} 