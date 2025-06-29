import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Play, Pause, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { mockKeywords } from '../data/mockData';
import type { Keyword } from '../types';

export default function Keywords() {
  const [keywords] = useState<Keyword[]>(mockKeywords);
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusBadge = (status: Keyword['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'paused':
        return <Badge variant="warning">Paused</Badge>;
      case 'crawling':
        return <Badge variant="default">Crawling</Badge>;
      case 'error':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-graphite tracking-tight">
            Keyword Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Track how your keywords perform in AI responses
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Run Crawl
        </Button>
      </div>

      {/* Keywords Table */}
      {keywords.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-platinum">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Keyword
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Target Domain
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Last Crawl
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Visibility Score
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Citations
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword, index) => (
                  <tr
                    key={keyword.id}
                    className={`${
                      index !== keywords.length - 1 ? 'border-b border-platinum' : ''
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-graphite">
                        {keyword.keyword}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {keyword.targetDomain}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {keyword.lastCrawl}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(keyword.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-graphite">
                          {keyword.visibilityScore}%
                        </span>
                        {/* Mini sparkline placeholder */}
                        <div className="w-12 h-6 bg-primary/10 rounded flex items-end justify-center space-x-0.5">
                          <div className="w-1 h-2 bg-primary/40 rounded-full"></div>
                          <div className="w-1 h-4 bg-primary/60 rounded-full"></div>
                          <div className="w-1 h-3 bg-primary/80 rounded-full"></div>
                          <div className="w-1 h-5 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {keyword.citations}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        // Empty State
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-normal text-graphite mb-2">
            No keywords yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start tracking your first keyword to see how it performs in AI responses.
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Keyword
          </Button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-elevation-2 hover:shadow-elevation-1 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Keyword Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black dark:text-black rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-normal text-graphite mb-4">
              Add Keyword
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-graphite mb-2">
                  Keyword
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="best project management tool"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite mb-2">
                  Target Domain
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="yourcompany.com"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setShowAddModal(false)}>
                  Add Keyword
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}