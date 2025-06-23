// src/pages/Optimization.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AEOScorecard from './AEOScorecard';
import AEOValidationPanel from './AEOValidationPanel';
import OptimizationEngine from './OptimizationEngine';
import { FrontendAsset } from '../../pages/Analysis';

// ——— Types ———————————————————————————————————————————————

interface LocationState {
  assets?: FrontendAsset[]
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

interface ValidationResult {
  assetId: string;
  passed: boolean;
  notes?: string;
  validatedBy: string;
  validatedAt: Date;
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

// ——— Component ——————————————————————————————————————————

export default function Optimization() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const assets = state.assets || [];

  // 1) AEO Scoring state
  const [scores, setScores] = useState<AEOScore[]>([]);
  const [isScoring, setIsScoring] = useState(false);

  const handleScoreComplete = async (engine: 'perplexity'|'chatgpt'|'claude') => {
    if (!assets.length) return;
    setIsScoring(true);

    // simulate API delay
    await new Promise(r => setTimeout(r, 2000));

    // fake scores
    const newScores: AEOScore[] = assets.map(a => ({
      assetId: a.id,
      engine,
      score: Math.floor(Math.random()*40+60),
      factors: {
        relevance: Math.floor(Math.random()*30+70),
        authority: Math.floor(Math.random()*40+60),
        freshness: Math.floor(Math.random()*50+50),
        engagement: Math.floor(Math.random()*35+65),
      },
      lastUpdated: new Date()
    }));

    setScores(newScores);
    setIsScoring(false);
  };

  // 2) Validation state
  const [validated, setValidated] = useState<Record<string,ValidationResult>>({});
  const handleValidate = (assetId: string, passed: boolean, notes?: string) => {
    setValidated(prev => ({
      ...prev,
      [assetId]: {
        assetId,
        passed,
        notes,
        validatedBy: 'Current User',
        validatedAt: new Date()
      }
    }));
  };

  // 3) Suggestions state
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!assets.length) return;
    setIsGenerating(true);

    // simulate API delay
    await new Promise(r => setTimeout(r, 2000));

    const types: OptimizationSuggestion['type'][] = ['title','description','content','technical','structure'];
    const priorities: OptimizationSuggestion['priority'][] = ['high','medium','low'];
    const efforts: OptimizationSuggestion['effort'][] = ['low','medium','high'];

    const newSugs: OptimizationSuggestion[] = assets.flatMap(a => {
      const count = Math.floor(Math.random()*3+1);
      return Array.from({length:count}).map((_,i) => {
        const type = types[Math.floor(Math.random()*types.length)];
        return {
          id: `sug-${a.id}-${i}`,
          assetId: a.id,
          type,
          priority: priorities[Math.floor(Math.random()*priorities.length)],
          suggestion: `Improve ${type} of "${a.title}"`,
          impact: `${Math.floor(Math.random()*30+20)}% uplift`,
          effort: efforts[Math.floor(Math.random()*efforts.length)],
          implemented: false
        };
      });
    });

    setSuggestions(newSugs);
    setIsGenerating(false);
  };

  // --- no assets guard ---
  if (assets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center space-y-4">
          <p>No assets to optimize.</p>
          <button
            onClick={() => navigate('/analysis')}
            className="underline text-green-400"
          >
            Go back to Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-12">
      <header>
        <h1 className="text-4xl font-normal mb-2">Optimization Workflow</h1>
        <p className="text-gray-400">
          Step through AEO scoring, validation, and AI-powered suggestions.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-normal mb-4">1. AEO Scoring</h2>
        <AEOScorecard
          engine="chatgpt"
          assets={assets}
          scores={scores}
          isScoring={isScoring}
          onScoreComplete={handleScoreComplete}
        />
      </section>

      <section>
        <h2 className="text-2xl font-normal mb-4">2. Validate Results</h2>
        <AEOValidationPanel
          assets={assets}
          scores={scores}
          validated={validated}
          onValidate={handleValidate}
        />
      </section>

      <section>
        <h2 className="text-2xl font-normal mb-4">3. Generate Suggestions</h2>
        <OptimizationEngine
          assets={assets}
          suggestions={suggestions}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      </section>

      <footer className="flex gap-4">
        <button
          onClick={() => {/* export logic here */}}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md"
        >
          Export Optimized Assets
        </button>
        <button
          onClick={() => navigate('/analysis')}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-md"
        >
          Back to Analysis
        </button>
      </footer>
      </div>
  );
} 
