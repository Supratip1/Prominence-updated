import React from 'react';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  type: string;
  title: string;
  url: string;
  sourceDomain: string;
  description?: string;
  createdAt: Date;
  size?: string;
  status: string;
}

interface ExportCSVButtonProps {
  assets: Asset[];
}

export default function ExportCSVButton({ assets }: ExportCSVButtonProps) {
  const handleExport = () => {
    if (assets.length === 0) return;

    // Create CSV content
    const headers = ['ID', 'Type', 'Title', 'URL', 'Source Domain', 'Description', 'Created At', 'Size', 'Status'];
    const csvContent = [
      headers.join(','),
      ...assets.map(asset => [
        asset.id,
        asset.type,
        `"${asset.title.replace(/"/g, '""')}"`,
        asset.url,
        asset.sourceDomain,
        `"${(asset.description || '').replace(/"/g, '""')}"`,
        asset.createdAt.toISOString(),
        asset.size || '',
        asset.status
      ].join(','))
    ].join('\n');

    // Create and download file
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
      onClick={handleExport}
      disabled={assets.length === 0}
      className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base font-medium"
      whileHover={{ scale: assets.length > 0 ? 1.05 : 1 }}
      whileTap={{ scale: assets.length > 0 ? 0.95 : 1 }}
    >
      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden sm:inline">Export to CSV</span>
      <span className="sm:hidden">Export</span>
      {assets.length > 0 && (
        <span className="bg-[#adff2f]/20 text-[#adff2f] px-2 py-1 rounded-full text-xs font-bold">
          {assets.length}
        </span>
      )}
    </motion.button>
  );
} 