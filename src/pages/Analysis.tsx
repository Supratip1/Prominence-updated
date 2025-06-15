import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../contexts/AnalysisContext';
import AssetDiscoveryForm from '../components/Analysis/AssetDiscoveryForm';
import CrawlProgress from '../components/Analysis/CrawlProgress';
import LiveAssetFeed from '../components/Analysis/LiveAssetFeed';
import AssetFilterBar from '../components/Analysis/AssetFilterBar';
import AssetTable from '../components/Analysis/AssetTable';
import AssetPreviewModal from '../components/Analysis/AssetPreviewModal';
import ExportCSVButton from '../components/Analysis/ExportCSVButton';
import SendToOptimizationButton from '../components/Analysis/SendToOptimizationButton';
import debounce from 'lodash/debounce';

// Types from backend
interface ContentBlock {
  id: number;
  type: string;
  content: string;
  data: Record<string, any>;
  parent_id?: number;
  level?: number;
}

interface PageContent {
  url: string;
  title?: string;
  blocks: ContentBlock[];
  metadata: Record<string, any>;
}

interface ScrapeJob {
  job_id: string;
  domain: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  completed_at?: string;
  progress: {
    pages_scraped: number;
    max_pages: number;
    percentage: number;
  };
  error_message?: string;
}

interface ScrapeResults {
  job: ScrapeJob;
  pages: PageContent[];
  summary: Record<string, any>;
}

// Local asset type for frontend
export interface FrontendAsset {
  id: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  sourceDomain: string;
  createdAt: Date;
}

function normalizeDomain(raw: string): string {
  try {
    const withProto = raw.match(/^https?:\/\//) ? raw : `https://${raw}`;
    return new URL(withProto).host;
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}

const Analysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawParam = searchParams.get('domain') || '';
  const initialDomain = normalizeDomain(rawParam);
  const { assets, setAssets, getCachedAssets, setCachedAssets, clearCache } = useAnalysis() as {
    assets: FrontendAsset[];
    setAssets: (assets: FrontendAsset[]) => void;
    getCachedAssets: (domain: string) => FrontendAsset[] | null;
    setCachedAssets: (domain: string, assets: FrontendAsset[]) => void;
    clearCache: (domain: string) => void;
  };
  
  const [analysisQuery, setAnalysisQuery] = useState(initialDomain);
  const [inputValue, setInputValue] = useState(initialDomain);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<FrontendAsset | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    type: 'all' as string,
    source: 'all' as string
  });
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [lastDomain, setLastDomain] = useState<string|null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Debounced validation
  const debouncedValidate = React.useMemo(
    () => debounce((val: string) => {
      if (val) validateDomain(val);
    }, 2000),
    []
  );

  const handleClearAnalysis = () => {
    setAnalysisQuery('');
    setAssets([]);
    setCrawlProgress(0);
    setIsAnalyzing(false);
    clearCache(analysisQuery);
    setCurrentJobId(null);
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const domain = searchParams.get('domain');
      if (domain) {
        const cachedAssets = getCachedAssets(domain);
        if (cachedAssets) {
          setAssets(cachedAssets);
        } else {
          handleAnalysisSubmit(domain);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams, getCachedAssets, setAssets]);

  // Auto-start analysis if domain is provided in URL
  useEffect(() => {
    if (initialDomain && !isAnalyzing && assets.length === 0) {
      handleAnalysisSubmit(initialDomain);
    }
  }, [initialDomain]);

  // Sync inputValue with initialDomain when URL changes
  useEffect(() => {
    setInputValue(initialDomain);
  }, [initialDomain]);

  // Clear old cache and auto-run analysis when normalized domain changes
  useEffect(() => {
    if (!initialDomain || initialDomain === lastDomain) return;
    if (lastDomain) {
      clearCache(lastDomain);
    }
    setLastDomain(initialDomain);
    handleAnalysisSubmit(initialDomain);
  }, [initialDomain]);

  // Poll job status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollJobStatus = async () => {
      if (!currentJobId || !isAnalyzing) return;

      try {
        const response = await fetch(`http://localhost:8000/status/${currentJobId}`);
        const data: ScrapeJob = await response.json();

        setCrawlProgress(data.progress.percentage);

        if (data.status === 'completed') {
          const resultsResponse = await fetch(`http://localhost:8000/results/${currentJobId}`);
          const results: ScrapeResults = await resultsResponse.json();
          
          // Improved asset type classification
          const convertedAssets = results.pages.flatMap(page =>
            page.blocks.map(block => {
              const src = block.data.src || page.url;
              let type = block.type.toLowerCase();

              // 1) keep any bucket we already know
              const buckets = ['video','screenshot','webpage','heading','meta','schema','image','link'];
              if (!buckets.includes(type)) {
                // 2) classify via file extension
                if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(src)
                    || src.includes('youtube.com')
                    || src.includes('vimeo.com')
                ) {
                  type = 'video';
                }
                else if (/\.(jpe?g|png|gif|svg)(\?.*)?$/i.test(src)) {
                  type = 'image';
                }
                // 3) if it really is just a link to another page
                else if (type === 'link') {
                  type = 'link';
                }
                // 4) anything else that isn't exactly the same as the page URL, treat as link
                else if (src !== page.url) {
                  type = 'link';
                }
                // 5) everything left is just the page itself
                else {
                  type = 'webpage';
                }
              }

              return {
                id:           `${page.url}-${block.id}`,
                type,
                title:        block.content,
                description: block.content,
                url:          src,
                sourceDomain: new URL(page.url).host,
                createdAt:    new Date(page.metadata.timestamp || Date.now())
              };
            })
          );

          setAssets(convertedAssets);
          setCachedAssets(initialDomain, convertedAssets);
          setFilterOptions({ type: 'all', source: 'all' });

          setIsAnalyzing(false);
          clearInterval(intervalId);
        } else if (data.status === 'failed') {
          setError(data.error_message || 'Analysis failed');
          setIsAnalyzing(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        setError('Failed to check analysis status');
        setIsAnalyzing(false);
        clearInterval(intervalId);
      }
    };

    if (currentJobId && isAnalyzing) {
      intervalId = setInterval(pollJobStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentJobId, isAnalyzing, initialDomain, setAssets, setCachedAssets]);

  const validateDomain = async (url: string): Promise<boolean> => {
    setIsValidating(true);
    setError(null);
    const domain = normalizeDomain(url);
    const tryUrl = (prefix: 'https://' | 'http://') => `${prefix}${domain}`;
    try {
      await tryUrl('https://');
      setIsValidating(false);
      return true;
    } catch {
      try {
        await tryUrl('http://');
        setIsValidating(false);
        return true;
      } catch {
        setIsValidating(false);
        setError('Unable to reach this domain. Please check the URL and try again.');
        return false;
      }
    }
  };

  const handleAnalysisSubmit = async (rawInput: string) => {
    // Ensure we send a full URL to the backend
    const fullUrl = rawInput.startsWith('http') ? rawInput : `https://${rawInput}`;
    const domain = normalizeDomain(rawInput);
    setAnalysisQuery(domain);
    clearCache(domain);
    navigate(`/analysis?domain=${encodeURIComponent(domain)}`);
    setIsAnalyzing(true);
    setCrawlProgress(0);
    setAssets([]);
    setError(null);

    // Check cache first
    const cached = getCachedAssets(domain);
    if (cached) {
      setAssets(cached);
      setIsAnalyzing(false);
      setCrawlProgress(100);
      return;
    }

    try {
      // Start backend scraping with full URL
      const response = await fetch('http://localhost:8000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: fullUrl, // send full URL
          max_pages: 50,
          options: {
            extract_media: true,
            include_metadata: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const data = await response.json();
      setCurrentJobId(data.job_id);
    } catch (err) {
      console.error('Error starting analysis:', err);
      setError('Failed to start analysis');
      setIsAnalyzing(false);
    }
  };

  // Filter assets based on selected options
  const filteredAssets = assets.filter(asset => {
    if (filterOptions.type !== 'all' && asset.type !== filterOptions.type) return false;
    if (filterOptions.source !== 'all' && asset.sourceDomain !== filterOptions.source) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Premium Header */}
      <motion.div 
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#adff2f]/5 via-transparent to-[#7cfc00]/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#adff2f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7cfc00]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={itemVariants}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #adff2f 50%, #7cfc00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Asset Discovery & Analysis
            </motion.h1>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <AssetDiscoveryForm 
              value={inputValue}
              onChange={(val) => {
                setInputValue(val);
                setError(null);
                debouncedValidate(val);
              }}
              onSubmit={async () => {
                const isValid = await validateDomain(inputValue);
                if (!isValid) return;
                handleAnalysisSubmit(inputValue);
              }}
              disableSubmit={isAnalyzing || isValidating || !inputValue.trim()}
              isAnalyzing={isAnalyzing}
            />
            {isValidating && (
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></span>
                Validating URL...
              </div>
            )}
            {error && (
              <div className="text-sm text-red-400 mt-2">{error}</div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Analysis Interface */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Crawl Progress */}
          {isAnalyzing && (
            <motion.div variants={itemVariants}>
              <CrawlProgress 
                percent={Math.round(crawlProgress)} 
                message={`Analyzing ${analysisQuery} - Fetching assets relevant to ${analysisQuery}...`} 
              />
            </motion.div>
          )}

          {/* Live Asset Feed */}
          {isAnalyzing && (
            <motion.div variants={itemVariants}>
              <LiveAssetFeed assets={assets.slice(0, Math.floor(crawlProgress / 20))} />
            </motion.div>
          )}

          {/* Results Section */}
          {!isAnalyzing && assets.length > 0 && (
            <>
              {/* Filter Bar */}
              <motion.div variants={itemVariants}>
                <AssetFilterBar 
                  filters={['all', 'video', 'screenshot', 'webpage', 'heading', 'meta', 'schema', 'image', 'link']}
                  sources={Array.from(new Set(assets.map(a => a.sourceDomain)))}
                  onFilterChange={setFilterOptions}
                />
              </motion.div>

              {/* Asset Grid */}
              <motion.div variants={itemVariants}>
                <AssetTable
                  assets={filteredAssets}
                  onNameClick={setPreviewAsset}
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                <ExportCSVButton assets={filteredAssets} />
                <SendToOptimizationButton assets={filteredAssets} />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <AssetPreviewModal 
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      )}
    </div>
  );
};

export default Analysis; 