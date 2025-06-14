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
import { fetchAEOAssets, Asset } from '../utils/aeoCrawler';

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
  // always strip protocol + trailing slash right away
  const rawParam = searchParams.get('domain') || '';
  const initialDomain = normalizeDomain(rawParam);
  const { assets, setAssets, getCachedAssets, setCachedAssets, clearCache } = useAnalysis();
  
  const [analysisQuery, setAnalysisQuery] = useState(initialDomain);
  const [inputValue, setInputValue] = useState(initialDomain);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    type: 'all' as 'all' | Asset['type'],
    source: 'all' as string
  });
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [lastDomain, setLastDomain] = useState<string|null>(null);

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
          // If no cache exists, start a new analysis
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
    const domain = normalizeDomain(rawInput);
    setAnalysisQuery(domain); // so progress bar and UI are correct
    clearCache(domain); // drop any old results
    navigate(`/analysis?domain=${encodeURIComponent(domain)}`); // update the URL to exactly your host
    setIsAnalyzing(true);
    setCrawlProgress(0);
    setAssets([]);

    // 1) cache?
    const cached = getCachedAssets(domain);
    if (cached) {
      setAssets(cached);
      setIsAnalyzing(false);
      setCrawlProgress(100);
      return;
    }

    // 2) show "fake" progress up to 95%
    let progress = 0;
    const progIv = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 95);
      setCrawlProgress(progress);
    }, 400);

    try {
      // actual fetch & parse
      let scraped = await fetchAEOAssets(domain);
      // Add a screenshot asset using Thum.io
      const thumbUrl = `https://image.thum.io/get/width/800/crop/600/${encodeURIComponent('https://' + domain)}`;
      scraped = [
        {
          id: 'screenshot-home',
          type: 'screenshot',
          title: 'Homepage Screenshot',
          url: thumbUrl,
          thumbnail: thumbUrl,
          sourceDomain: domain,
          createdAt: new Date()
        },
        ...scraped
      ];
      clearInterval(progIv);

      // finalize
      setCrawlProgress(100);
      setAssets(scraped);
      setCachedAssets(domain, scraped);
    } catch (err) {
      clearInterval(progIv);
      setError('Failed to fetch or parse site.');
      setAssets([]);
    } finally {
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

          {/* Move AssetDiscoveryForm here, under the header and subtext */}
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