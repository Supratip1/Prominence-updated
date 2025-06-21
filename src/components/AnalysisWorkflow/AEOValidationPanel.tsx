import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { FrontendAsset } from '../../pages/Analysis';

interface Asset {
  id: string;
  title: string;
  type: string;
}

interface AEOScore {
  assetId: string;
  score: number;
  engine: string;
}

interface ValidationResult {
  assetId: string;
  passed: boolean;
  notes?: string;
  validatedBy: string;
  validatedAt: Date;
}

interface AEOValidationPanelProps {
  scores?: AEOScore[];
  assets?: FrontendAsset[];
  validated?: Record<string, ValidationResult>;
  onValidate?: (assetId: string, passed: boolean, notes?: string) => void;
}

export default function AEOValidationPanel({
  scores = [],
  assets = [],
  validated = {},
  onValidate = () => {}
}: AEOValidationPanelProps) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const handleValidation = (assetId: string, passed: boolean) => {
    onValidate(assetId, passed, notes[assetId] || '');
    setNotes(prev => ({ ...prev, [assetId]: '' }));
    setExpandedNotes(prev => ({ ...prev, [assetId]: false }));
  };

  const toggleNotes = (assetId: string) => {
    setExpandedNotes(prev => ({ ...prev, [assetId]: !prev[assetId] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (assets.length === 0) {
    return <p className="text-gray-400">No assets to validate.</p>;
  }

  return (
    <motion.div 
      className="mb-8 sm:mb-12 max-w-6xl mx-auto px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
            ✅
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              AEO Validation
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Review and validate AI optimization scores
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {scores.map((score, index) => {
            const asset = assets.find(a => a.id === score.assetId);
            const validation = validated[score.assetId];
            
            if (!asset) return null;

            return (
              <motion.div
                key={score.assetId}
                className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm sm:text-base mb-1">
                      {asset.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                      <span className="capitalize">{asset.type}</span>
                      <span className={`font-semibold ${getScoreColor(score.score)}`}>
                        Score: {score.score}
                      </span>
                      <span className="capitalize">{score.engine}</span>
                    </div>
                  </div>
                  
                  {validation ? (
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        validation.passed 
                          ? 'bg-green-500/20 text-green-400 border-green-400/50' 
                          : 'bg-red-500/20 text-red-400 border-red-400/50'
                      }`}>
                        {validation.passed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {validation.passed ? 'Validated' : 'Rejected'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <motion.button
                        onClick={() => handleValidation(score.assetId, true)}
                        className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition-all text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Pass
                      </motion.button>
                      <motion.button
                        onClick={() => handleValidation(score.assetId, false)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/50 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XCircle className="w-4 h-4" />
                        Fail
                      </motion.button>
                      <motion.button
                        onClick={() => toggleNotes(score.assetId)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Notes
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                {expandedNotes[score.assetId] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <textarea
                      value={notes[score.assetId] || ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [score.assetId]: e.target.value }))}
                      placeholder="Add validation notes..."
                      className="w-full h-20 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                    />
                  </motion.div>
                )}

                {/* Validation Info */}
                {validation && validation.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 mb-2">{validation.notes}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {validation.validatedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {validation.validatedAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">
                {Object.values(validated).filter(v => v.passed).length}
              </div>
              <div className="text-xs sm:text-sm text-green-400">Validated</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">
                {Object.values(validated).filter(v => !v.passed).length}
              </div>
              <div className="text-xs sm:text-sm text-red-400">Rejected</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">
                {scores.length - Object.keys(validated).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 