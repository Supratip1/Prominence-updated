"use client"

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { normalizeUrl } from '../utils/hooks';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Layout/Header';

const impactOrder = ['High', 'Medium', 'Low'];

interface Recommendation {
  description: string;
  category: string;
  impact_level: string;
}

interface AnalysisData {
  optimization_recommendations?: {
    optimizations?: Recommendation[];
  };
  audit_report?: {
    snippet_optimization?: {
      featured_snippet_readiness?: number;
      overall_findings?: {
        readability_score?: number;
      };
    };
    crawlability?: {
      score?: number;
    };
    structured_data?: {
      aeo_schemas_found?: string[];
    };
  };
}

const Optimization = () => {
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const url = normalizeUrl(rawUrl);
  
  const queryClient = useQueryClient();
  const initialData = queryClient.getQueryData(['aeo-analysis', url]);
  const { data: analysisData = initialData } = useQuery({
    queryKey: ['aeo-analysis', url],
    enabled: false,
    initialData
  });
  
  // Debug logs to help diagnose data issues
  console.log('Optimization page - url:', url);
  console.log('Optimization page - analysisData:', analysisData);

  const safeData = analysisData as AnalysisData;
  const recommendations = Array.isArray(safeData?.optimization_recommendations?.optimizations)
    ? safeData.optimization_recommendations.optimizations
    : [];
  console.log('Optimization page - recommendations:', recommendations);

  // Filter state
  const [impactFilter, setImpactFilter] = React.useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [filterOpen, setFilterOpen] = React.useState(false);

  // Categorize recommendations by impact (case-insensitive)
  const categorized = impactOrder.map(level => ({
    level,
    items: recommendations.filter((rec: Recommendation) =>
      (rec.impact_level || '').toLowerCase() === level.toLowerCase()
    )
  }));

  // Filtered recommendations
  const filtered = impactFilter === 'All'
    ? categorized
    : categorized.filter(cat => cat.level === impactFilter);

  // Carousel state for each category (mobile only)
  const [carouselIndexes, setCarouselIndexes] = React.useState<{ [level: string]: number }>({});
  const handlePrev = (level: string, max: number) => {
    setCarouselIndexes(idx => ({
      ...idx,
      [level]: idx[level] > 0 ? idx[level] - 1 : max - 1
    }));
  };
  const handleNext = (level: string, max: number) => {
    setCarouselIndexes(idx => ({
      ...idx,
      [level]: idx[level] < max - 1 ? idx[level] + 1 : 0
    }));
  };

  return (
    <>
      <Header />
      <div className="pt-20">
        <DashboardLayout>
          <div className="max-w-5xl mx-auto mt-16 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                  onClick={() => setFilterOpen(f => !f)}
                  aria-label="Filter by impact"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline text-base">{impactFilter === 'All' ? 'Filter' : impactFilter}</span>
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {['All', ...impactOrder].map(option => (
                      <button
                        key={option}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${impactFilter === option ? 'bg-gray-100 font-semibold' : ''}`}
                        onClick={() => { setImpactFilter(option as any); setFilterOpen(false); }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {filtered.map(cat => (
                <div key={cat.level}>
                  <h2 className="text-xl md:text-2xl font-normal text-black text-center font-display tracking-tight mb-4">
                    {cat.level} Impact
                  </h2>
                  <div className="flex flex-col gap-6">
                    {cat.items.length === 0 ? (
                      <div className="text-gray-400 text-center">
                        {Array.isArray(safeData?.optimization_recommendations?.optimizations)
                          ? `No ${cat.level.toLowerCase()} impact recommendations.`
                          : 'No recommendations found. Please re-run analysis.'}
                      </div>
                    ) : (
                      cat.items.map((rec: Recommendation, idx: number) => (
                        <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow p-6">
                          <div className="font-medium text-black mb-2 break-words">
                            {rec.description}
                          </div>
                          <div className="text-sm text-gray-600 break-words">
                            Category: <span className="font-semibold text-black">{rec.category}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile carousel */}
            <div className="md:hidden flex flex-col gap-8">
              {filtered.map(cat => {
                const idx = carouselIndexes[cat.level] || 0;
                return (
                  <div key={cat.level}>
                    <h2 className="text-xl font-normal text-black text-center font-display tracking-tight mb-4">
                      {cat.level} Impact
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 rounded-full bg-gray-100 border border-gray-200 text-black disabled:opacity-30"
                        onClick={() => handlePrev(cat.level, cat.items.length)}
                        disabled={cat.items.length <= 1}
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        {cat.items.length === 0 ? (
                          <div className="text-gray-400 text-center">
                            {Array.isArray(safeData?.optimization_recommendations?.optimizations)
                              ? `No ${cat.level.toLowerCase()} impact recommendations.`
                              : 'No recommendations found. Please re-run analysis.'}
                          </div>
                        ) : (
                          <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mx-auto max-w-xs">
                            <div className="font-medium text-black mb-2 break-words">
                              {cat.items[idx].description}
                            </div>
                            <div className="text-sm text-gray-600 break-words">
                              Category: <span className="font-semibold text-black">{cat.items[idx].category}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        className="p-2 rounded-full bg-gray-100 border border-gray-200 text-black disabled:opacity-30"
                        onClick={() => handleNext(cat.level, cat.items.length)}
                        disabled={cat.items.length <= 1}
                        aria-label="Next"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Dots indicator */}
                    {cat.items.length > 1 && (
                      <div className="flex justify-center mt-2 gap-1">
                        {cat.items.map((_, i) => (
                          <span
                            key={i}
                            className={`inline-block w-2 h-2 rounded-full ${i === idx ? 'bg-black' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default Optimization;

