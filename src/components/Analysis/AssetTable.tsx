import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
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

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Name',   key: 'title' },
    { label: 'Type',   key: 'type' },
    { label: 'Source', key: 'sourceDomain' },
    { label: 'Created',key: 'createdAt' },
    { label: 'URL',    key: 'url' },
  ];

  return (
    <motion.div
      className="overflow-x-auto rounded-lg bg-gray-900 border border-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <table className="min-w-full border-separate border-spacing-0">
        <thead className="bg-gray-800">
          <tr>
            {headers.map(h => (
              <th
                key={h.key}
                onClick={() => onHeader(h.key)}
                className="px-6 py-3 text-xs font-medium tracking-wider text-gray-300 border-r border-white cursor-pointer select-none"
              >
                <div className="inline-flex items-center space-x-1">
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
              className={`${idx % 2 === 0 ? 'bg-gray-850' : 'bg-gray-800'} hover:bg-gray-700 cursor-pointer`}
            >
              <td
                onClick={() => onNameClick(asset)}
                className="px-6 py-4 text-sm font-medium text-white border-r border-white underline"
              >
                {asset.title || 'Untitled'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-200 border-r border-white">{asset.type}</td>
              <td className="px-6 py-4 text-sm text-gray-200 border-r border-white">
                {asset.sourceDomain}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400 border-r border-white">
                {new Date(asset.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-200">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-white"
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
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-white">
          <span className="text-sm text-gray-300">
            Showing{' '}
            <span className="font-medium text-white">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-white">
              {Math.min(currentPage * rowsPerPage, sorted.length)}
            </span>{' '}
            of <span className="font-medium text-white">{sorted.length}</span> assets
          </span>
          <nav className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              ←
            </button>
            {pages.map((p, i) =>
              p === -1 ? (
                <span key={i} className="px-3 py-1 text-gray-300">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded ${
                    p === currentPage
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              →
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
} 