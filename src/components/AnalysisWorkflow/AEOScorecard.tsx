import React from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, AcademicCapIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { FrontendAsset } from '../../pages/Analysis';

interface Asset {
  id: string;
  title: string;
  type: string;
}

interface AEOScore {
  assetId: string;
  engine: 'perplexity' | 'chatgpt' | 'claude';
  score: number;
  factors: {
    relevance: number;
    authority: number;
    freshness: number;
    engagement: number;
  };
  lastUpdated: Date;
}

interface AEOScorecardProps {
  engine: 'perplexity' | 'chatgpt' | 'claude';
  assets?: FrontendAsset[];
  scores?: AEOScore[];
  isScoring?: boolean;
  onScoreComplete?: (engine: 'perplexity' | 'chatgpt' | 'claude') => void;
}

export default function AEOScorecard({
  engine,
  assets = [],
  scores = [],
  isScoring = false,
  onScoreComplete = () => {}
}: AEOScorecardProps) {
  if (assets.length === 0) {
    return <p className="text-gray-400">No assets to score.</p>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const getEngineIcon = () => {
    switch (engine) {
      case 'perplexity': return '🔮';
      case 'chatgpt': return '🤖';
      case 'claude': return '🧠';
      default: return '🔍';
    }
  };

  const getEngineColor = () => {
    switch (engine) {
      case 'perplexity': return 'from-purple-500 to-pink-500';
      case 'chatgpt': return 'from-green-500 to-blue-500';
      case 'claude': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length)
    : 0;

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
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${getEngineColor()} flex items-center justify-center text-2xl sm:text-3xl shadow-lg`}>
              {getEngineIcon()}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-normal text-white mb-1">
                AEO Scorecard
              </h3>
              <p className="text-sm sm:text-base text-gray-400 capitalize">
                {engine} AI Engine Analysis
              </p>
            </div>
          </div>
          
          {!isScoring && scores.length === 0 && (
            <motion.button
              onClick={() => onScoreComplete(engine)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl shadow-lg shadow-green-500/30 text-sm sm:text-base whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Scores
            </motion.button>
          )}
        </div>

        {/* Loading State */}
        {isScoring && (
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
              <ArrowPathIcon className="w-8 h-8 sm:w-12 sm:h-12 text-[#adff2f]" />
            </motion.div>
            <h4 className="text-lg sm:text-xl font-normal text-white mb-2">
              Analyzing with {engine.charAt(0).toUpperCase() + engine.slice(1)}
            </h4>
            <p className="text-sm sm:text-base text-gray-400">
              Evaluating AEO factors for each asset...
            </p>
          </motion.div>
        )}

        {/* Results */}
        {!isScoring && scores.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-normal text-[#adff2f] mb-1">
                  {averageScore}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Avg Score</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-normal text-blue-400 mb-1">
                  {scores.filter(s => s.score >= 80).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">High Scores</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-normal text-yellow-400 mb-1">
                  {scores.filter(s => s.score >= 60 && s.score < 80).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Medium</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-normal text-red-400 mb-1">
                  {scores.filter(s => s.score < 60).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Needs Work</div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-4">
              <h4 className="text-lg sm:text-xl font-normal text-white flex items-center gap-3">
                <ChartBarIcon className="w-6 h-6 text-[#adff2f]" />
                Asset Scores
              </h4>
              
              <div className="space-y-3 sm:space-y-4">
                {scores.map((score, index) => {
                  const asset = assets.find(a => a.id === score.assetId);
                  if (!asset) return null;
                  
                  return (
                    <motion.div
                      key={score.assetId}
                      className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white font-normal text-sm sm:text-base truncate">
                            {asset.title}
                          </h5>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {asset.type}
                          </p>
                        </div>
                        <div className={`px-3 sm:px-4 py-2 rounded-xl border font-normal text-lg sm:text-xl ${getScoreColor(score.score)}`}>
                          {score.score}
                        </div>
                      </div>
                      
                      {/* Factor Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {Object.entries(score.factors).map(([factor, value]) => (
                          <div key={factor} className="text-center">
                            <div className="text-sm sm:text-base font-normal text-white mb-1">
                              {value}
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {factor}
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1 sm:h-2 mt-2">
                              <div 
                                className="bg-gradient-to-r from-[#adff2f] to-[#7cfc00] h-full rounded-full transition-all duration-500"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isScoring && scores.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <AcademicCapIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h4 className="text-lg sm:text-xl font-normal text-white mb-2">
              Ready for AEO Analysis
            </h4>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Generate AI Engine Optimization scores for your discovered assets
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 