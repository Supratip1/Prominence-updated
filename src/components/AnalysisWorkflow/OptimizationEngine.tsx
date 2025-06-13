import React from 'react';
import { Sparkles, Loader2, Lightbulb, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  title: string;
  type: string;
}

interface OptimizationSuggestion {
  id: string;
  assetId: string;
  type: 'title' | 'description' | 'content' | 'technical' | 'structure';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  implemented: boolean;
}

interface OptimizationEngineProps {
  assets: Asset[];
  suggestions: OptimizationSuggestion[];
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function OptimizationEngine({ assets, suggestions, isGenerating, onGenerate }: OptimizationEngineProps) {
  const getPriorityColor = (priority: OptimizationSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getEffortColor = (effort: OptimizationSuggestion['effort']) => {
    switch (effort) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'title': return '📝';
      case 'description': return '📄';
      case 'content': return '📖';
      case 'technical': return '⚙️';
      case 'structure': return '🏗️';
      default: return '💡';
    }
  };

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const asset = assets.find(a => a.id === suggestion.assetId);
    if (!asset) return acc;
    
    if (!acc[asset.id]) {
      acc[asset.id] = { asset, suggestions: [] };
    }
    acc[asset.id].suggestions.push(suggestion);
    return acc;
  }, {} as Record<string, { asset: Asset; suggestions: OptimizationSuggestion[] }>);

  return (
    <motion.div 
      className="mb-8 sm:mb-12 max-w-6xl mx-auto px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
              🚀
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                AI Optimization Suggestions
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Powered by advanced AI analysis
              </p>
            </div>
          </div>
          
          {!isGenerating && suggestions.length === 0 && (
            <motion.button
              onClick={onGenerate}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl shadow-lg shadow-green-500/30 text-sm sm:text-base whitespace-nowrap flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              Generate Suggestions
            </motion.button>
          )}
        </div>

        {/* Loading State */}
        {isGenerating && (
          <motion.div 
            className="text-center py-8 sm:py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-[#adff2f]" />
            </motion.div>
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Generating AI Suggestions
            </h4>
            <p className="text-sm sm:text-base text-gray-400">
              Analyzing your assets for optimization opportunities...
            </p>
          </motion.div>
        )}

        {/* Results */}
        {!isGenerating && suggestions.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-[#adff2f] mb-1">
                  {suggestions.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Total</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                  {suggestions.filter(s => s.priority === 'high').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">High Priority</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
                  {suggestions.filter(s => s.effort === 'low').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Quick Wins</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
                  {suggestions.filter(s => s.implemented).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Implemented</div>
              </div>
            </div>

            {/* Suggestions by Asset */}
            <div className="space-y-6 sm:space-y-8">
              {Object.values(groupedSuggestions).map(({ asset, suggestions: assetSuggestions }, index) => (
                <motion.div
                  key={asset.id}
                  className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm sm:text-base font-bold text-white">
                      {assetSuggestions.length}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm sm:text-base truncate">
                        {asset.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm capitalize">
                        {asset.type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {assetSuggestions.map((suggestion, suggestionIndex) => (
                      <motion.div
                        key={suggestion.id}
                        className="bg-white/5 rounded-lg border border-white/10 p-3 sm:p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: suggestionIndex * 0.05 }}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                            <span className="text-white font-medium text-sm capitalize">
                              {suggestion.type}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:ml-auto">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority}
                            </span>
                            <span className={`text-xs font-medium ${getEffortColor(suggestion.effort)}`}>
                              {suggestion.effort} effort
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base mb-3 leading-relaxed">
                          {suggestion.suggestion}
                        </p>

                        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                          <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{suggestion.impact}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isGenerating && suggestions.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Ready for AI Optimization
            </h4>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Generate personalized suggestions to improve your assets' AI visibility
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 