import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import AssetDiscoveryForm from '../components/Analysis/AssetDiscoveryForm';
import CrawlProgress from '../components/Analysis/CrawlProgress';
import LiveAssetFeed from '../components/Analysis/LiveAssetFeed';
import AssetFilterBar from '../components/Analysis/AssetFilterBar';
import AssetGrid from '../components/Analysis/AssetGrid';
import AssetPreviewModal from '../components/Analysis/AssetPreviewModal';
import ExportCSVButton from '../components/Analysis/ExportCSVButton';
import SendToOptimizationButton from '../components/Analysis/SendToOptimizationButton';

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
  const [searchParams] = useSearchParams();
  const initialDomain = searchParams.get('domain') || '';
  
  const [analysisQuery, setAnalysisQuery] = useState(initialDomain);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    type: 'all' as 'all' | Asset['type'],
    source: 'all' as string
  });

  // Auto-start analysis if domain is provided in URL
  useEffect(() => {
    if (initialDomain && !isAnalyzing && assets.length === 0) {
      handleAnalysisSubmit(initialDomain);
    }
  }, [initialDomain]);

  const handleAnalysisSubmit = async (query: string) => {
    setAnalysisQuery(query);
    setIsAnalyzing(true);
    setCrawlProgress(0);
    setAssets([]);

    // Simulate crawling progress
    const progressInterval = setInterval(() => {
      setCrawlProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          // Generate mock assets
          generateMockAssets(query);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const generateMockAssets = (domain: string) => {
    const mockAssets: Asset[] = [
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
        createdAt: new Date('2024-01-05')
      },
      {
        id: '4',
        type: 'video',
        title: 'Product Demo Video',
        url: `https://${domain}/videos/demo.mp4`,
        sourceDomain: domain,
        description: 'Product demonstration and feature overview',
        createdAt: new Date('2024-01-12')
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
        createdAt: new Date('2024-01-14')
      }
    ];
    setAssets(mockAssets);
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
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
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
          {/* Asset Discovery Form */}
          <motion.div variants={itemVariants}>
            <AssetDiscoveryForm 
              value={analysisQuery}
              onChange={setAnalysisQuery}
              onSubmit={() => handleAnalysisSubmit(analysisQuery)}
              disabled={isAnalyzing}
            />
          </motion.div>

          {/* Crawl Progress */}
          {isAnalyzing && (
            <motion.div variants={itemVariants}>
              <CrawlProgress 
                percent={crawlProgress} 
                message="Discovering digital assets..." 
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
                  filters={['all', 'video', 'screenshot', 'webpage']}
                  sources={Array.from(new Set(assets.map(a => a.sourceDomain)))}
                  onFilterChange={setFilterOptions}
                />
              </motion.div>

              {/* Asset Grid */}
              <motion.div variants={itemVariants}>
                <AssetGrid 
                  assets={filteredAssets}
                  onCardClick={setPreviewAsset}
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