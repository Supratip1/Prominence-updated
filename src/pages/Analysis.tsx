import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { validateUrl, extractDomain } from '../utils/validation';

// Lazy load components for better performance
const AssetDiscoveryForm = lazy(() => import('../components/Analysis/AssetDiscoveryForm'));
const CrawlProgress = lazy(() => import('../components/Analysis/CrawlProgress'));
const LiveAssetFeed = lazy(() => import('../components/Analysis/LiveAssetFeed'));
const AssetFilterBar = lazy(() => import('../components/Analysis/AssetFilterBar'));
const AssetGrid = lazy(() => import('../components/Analysis/AssetGrid'));
const AssetPreviewModal = lazy(() => import('../components/Analysis/AssetPreviewModal'));
const ExportCSVButton = lazy(() => import('../components/Analysis/ExportCSVButton'));
const SendToOptimizationButton = lazy(() => import('../components/Analysis/SendToOptimizationButton'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-[#adff2f] border-t-transparent rounded-full"
    />
  </div>
);

interface Asset {
  id: string;
  type: 'video' | 'screenshot' | 'webpage';
  title: string;
  url: string;
  sourceDomain: string;
  thumbnail?: string;
  description?: string;
  createdAt: Date;
}

const Analysis: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDomain = searchParams.get('domain') || '';
  const isDemo = searchParams.get('demo') === 'true';
  
  const [analysisQuery, setAnalysisQuery] = useState(initialDomain);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    type: 'all' as 'all' | Asset['type'],
    source: 'all' as string
  });
  const [error, setError] = useState<string | null>(null);

  // Auto-start analysis if domain is provided in URL or demo mode
  useEffect(() => {
    if ((initialDomain || isDemo) && !isAnalyzing && assets.length === 0) {
      const domain = isDemo ? 'example.com' : initialDomain;
      handleAnalysisSubmit(domain);
    }
  }, [initialDomain, isDemo]);

  const handleAnalysisSubmit = async (query: string = analysisQuery) => {
    if (!query.trim()) return;

    // Validate URL
    if (!validateUrl(query)) {
      setError('Please enter a valid domain name or URL');
      return;
    }

    setError(null);
    setAnalysisQuery(query);
    setIsAnalyzing(true);
    setCrawlProgress(0);
    setAssets([]);

    // Update URL params
    const domain = extractDomain(query);
    setSearchParams({ domain });

    try {
      // Simulate crawling progress with realistic timing
      const progressSteps = [10, 25, 40, 55, 70, 85, 100];
      const messages = [
        'Initializing analysis...',
        'Discovering web pages...',
        'Scanning media files...',
        'Analyzing documents...',
        'Processing social content...',
        'Finalizing results...',
        'Analysis complete!'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        setCrawlProgress(progressSteps[i]);
        
        // Add assets progressively
        if (i > 1) {
          generateMockAssets(domain, Math.floor((i - 1) * 2));
        }
      }

      setIsAnalyzing(false);
      generateMockAssets(domain); // Generate all assets
    } catch (err) {
      setError('Failed to analyze the domain. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const generateMockAssets = (domain: string, count?: number) => {
    const allAssets: Asset[] = [
      {
        id: '1',
        type: 'webpage',
        title: `${domain} - Homepage`,
        url: `https://${domain}`,
        sourceDomain: domain,
        description: 'Main landing page with company overview and services',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        type: 'webpage',
        title: `About Us - ${domain}`,
        url: `https://${domain}/about`,
        sourceDomain: domain,
        description: 'Company information and team details',
        createdAt: new Date('2024-01-10')
      },
      {
        id: '3',
        type: 'screenshot',
        title: 'Homepage Screenshot',
        url: `https://${domain}/screenshots/homepage.png`,
        sourceDomain: domain,
        description: 'Visual capture of the main landing page',
        createdAt: new Date('2024-01-05'),
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
      },
      {
        id: '4',
        type: 'video',
        title: 'Product Demo Video',
        url: `https://${domain}/videos/demo.mp4`,
        sourceDomain: domain,
        description: 'Product demonstration and feature overview',
        createdAt: new Date('2024-01-12'),
        thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
      },
      {
        id: '5',
        type: 'webpage',
        title: 'Product Documentation',
        url: `https://${domain}/docs`,
        sourceDomain: domain,
        description: 'Technical documentation and specifications',
        createdAt: new Date('2024-01-08')
      },
      {
        id: '6',
        type: 'screenshot',
        title: 'Contact Page Screenshot',
        url: `https://${domain}/screenshots/contact.png`,
        sourceDomain: domain,
        description: 'Visual capture of the contact page',
        createdAt: new Date('2024-01-14'),
        thumbnail: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300&fit=crop'
      },
      {
        id: '7',
        type: 'video',
        title: 'Customer Testimonials',
        url: `https://${domain}/videos/testimonials.mp4`,
        sourceDomain: domain,
        description: 'Customer success stories and testimonials',
        createdAt: new Date('2024-01-20'),
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
      },
      {
        id: '8',
        type: 'webpage',
        title: 'Blog Articles',
        url: `https://${domain}/blog`,
        sourceDomain: domain,
        description: 'Latest blog posts and industry insights',
        createdAt: new Date('2024-01-18')
      }
    ];

    const assetsToShow = count !== undefined ? allAssets.slice(0, count) : allAssets;
    setAssets(assetsToShow);
  };

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
        className="relative py-16 sm:py-20 overflow-hidden"
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
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
            <motion.p 
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Comprehensive analysis of your digital presence across all platforms and channels
            </motion.p>
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
          {/* Error Display */}
          {error && (
            <motion.div 
              className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Asset Discovery Form */}
          <motion.div variants={itemVariants}>
            <Suspense fallback={<LoadingSpinner />}>
              <AssetDiscoveryForm 
                value={analysisQuery}
                onChange={setAnalysisQuery}
                onSubmit={() => handleAnalysisSubmit()}
                disabled={isAnalyzing}
              />
            </Suspense>
          </motion.div>

          {/* Crawl Progress */}
          {isAnalyzing && (
            <motion.div variants={itemVariants}>
              <Suspense fallback={<LoadingSpinner />}>
                <CrawlProgress 
                  percent={crawlProgress} 
                  message="Discovering digital assets..." 
                />
              </Suspense>
            </motion.div>
          )}

          {/* Live Asset Feed */}
          {isAnalyzing && assets.length > 0 && (
            <motion.div variants={itemVariants}>
              <Suspense fallback={<LoadingSpinner />}>
                <LiveAssetFeed assets={assets} />
              </Suspense>
            </motion.div>
          )}

          {/* Results Section */}
          {!isAnalyzing && assets.length > 0 && (
            <>
              {/* Filter Bar */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LoadingSpinner />}>
                  <AssetFilterBar 
                    filters={['all', 'video', 'screenshot', 'webpage']}
                    sources={Array.from(new Set(assets.map(a => a.sourceDomain)))}
                    onFilterChange={setFilterOptions}
                  />
                </Suspense>
              </motion.div>

              {/* Asset Grid */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LoadingSpinner />}>
                  <AssetGrid 
                    assets={filteredAssets}
                    onCardClick={setPreviewAsset}
                  />
                </Suspense>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <ExportCSVButton assets={filteredAssets} />
                  <SendToOptimizationButton assets={filteredAssets} />
                </Suspense>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <Suspense fallback={<LoadingSpinner />}>
          <AssetPreviewModal 
            asset={previewAsset}
            onClose={() => setPreviewAsset(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Analysis;