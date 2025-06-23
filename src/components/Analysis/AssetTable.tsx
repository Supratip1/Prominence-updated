import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Tag, Globe, Calendar, Link } from 'lucide-react';
import type { FrontendAsset } from '../../pages/Analysis';

type SortKey = 'title' | 'type' | 'sourceDomain' | 'createdAt' | 'url';
type Direction = 'asc' | 'desc';

interface AssetTableProps {
  assets: FrontendAsset[];
  onNameClick: (asset: FrontendAsset) => void;
}

export default function AssetTable({ assets, onNameClick }: AssetTableProps) {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [dir, setDir] = useState<Direction>('asc');

  // sort
  const sorted = useMemo(() => {
    const copy = [...assets];
    copy.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      // for dates
      if (sortKey === 'createdAt') {
        av = (a.createdAt as any).getTime();
        bv = (b.createdAt as any).getTime();
      }
      // Handle undefined values
      if (av === undefined && bv === undefined) return 0;
      if (av === undefined) return dir === 'asc' ? -1 : 1;
      if (bv === undefined) return dir === 'asc' ? 1 : -1;
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [assets, sortKey, dir]);

  // pagination
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, currentPage]);

  // build page list with ellipsis
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const first = [1, 2, 3, 4, 5];
    const last  = [totalPages - 1, totalPages];
    return [...first, -1, ...last];
  }, [totalPages]);

  // header click
  const onHeader = (key: SortKey) => {
    if (sortKey === key) setDir(dir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setDir('asc');
    }
  };

  if (!assets.length) {
    return <p className="text-gray-400 py-8 text-center">No assets found.</p>;
  }

  const headers: { label: string; key: SortKey; icon: React.ReactNode }[] = [
    { label: 'Name',   key: 'title', icon: <FileText className="w-4 h-4" /> },
    { label: 'Type',   key: 'type', icon: <Tag className="w-4 h-4" /> },
    { label: 'Source', key: 'sourceDomain', icon: <Globe className="w-4 h-4" /> },
    { label: 'Created',key: 'createdAt', icon: <Calendar className="w-4 h-4" /> },
    { label: 'URL',    key: 'url', icon: <Link className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      className="overflow-x-auto rounded-2xl bg-white border border-gray-200 shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <table className="min-w-full border-separate border-spacing-0 text-sm font-sans">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(h => (
              <th
                key={h.key}
                onClick={() => onHeader(h.key)}
                className="px-6 py-3 text-xs font-semibold tracking-wide text-gray-700 uppercase border-r border-gray-200 cursor-pointer select-none"
              >
                <div className="inline-flex items-center space-x-2">
                  {h.icon}
                  <span>{h.label}</span>
                  {sortKey === h.key && (
                    <span className="text-xs">{dir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paged.map((asset, idx) => (
            <tr
              key={asset.id}
              className={`${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-gray-100 cursor-pointer transition-colors`}
            >
              <td
                onClick={() => onNameClick(asset)}
                className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 underline max-w-xs truncate cursor-pointer"
                title={asset.title || 'Untitled'}
              >
                {asset.title || 'Untitled'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200 max-w-xs truncate" title={asset.type}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    asset.type === 'webpage'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : asset.type === 'image'
                      ? 'bg-green-600 text-white border-green-600'
                      : asset.type === 'video'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-gray-600 text-white border-gray-600'
                  }`}
                >
                  {asset.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200 max-w-xs truncate" title={asset.sourceDomain}>
                {asset.sourceDomain}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">
                {new Date(asset.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={asset.url}>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4 mr-1" /> View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium text-gray-900">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * rowsPerPage, sorted.length)}
            </span>{' '}
            of <span className="font-medium text-gray-900">{sorted.length}</span> assets
          </span>
          <nav className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ←
            </button>
            {pages.map((p, i) =>
              p === -1 ? (
                <span key={i} className="px-3 py-1 text-gray-500">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded border ${
                    p === currentPage
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded disabled:opacity-40 hover:bg-gray-50 transition"
            >
              →
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
} 