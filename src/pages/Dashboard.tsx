import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Play, Pause } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Layout/Header';
import AEOApiService from '../services/aeoApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { normalizeUrl } from '../utils/hooks';
import Player from 'lottie-react';
import animationData from '../../public/lottie/Animation2.json';
import Lottie from 'lottie-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [isInputAnalyzing, setIsInputAnalyzing] = useState(false);
  const [spiderAnimation, setSpiderAnimation] = useState(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Dynamic witty loading messages
  const loadingMessages = [
    "Teaching AI to find your content...",
    "Analyzing your digital footprint...",
    "Cracking the SEO code...",
    "Making you discoverable...",
    "Optimizing for AI search...",
    "Preparing your competitive edge...",
    "Unleashing your online potential...",
    "Crafting your AI visibility...",
    "Decoding search algorithms...",
    "Building your digital presence...",
    "Mapping your content strategy...",
    "Elevating your search ranking...",
    "Optimizing for the future of search...",
    "Making you the answer AI finds...",
    "Preparing your competitive analysis..."
  ];

  // Update loading message every 3 seconds
  useEffect(() => {
    if (isInputAnalyzing) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInputAnalyzing, loadingMessages.length]);

  // Set initial loading message
  useEffect(() => {
    if (isInputAnalyzing) {
      setLoadingMessage(loadingMessages[0]);
    }
  }, [isInputAnalyzing]);

  // Update current message when index changes
  useEffect(() => {
    setLoadingMessage(loadingMessages[loadingMessageIndex]);
  }, [loadingMessageIndex, loadingMessages]);

  // Load spider animation data
  useEffect(() => {
    const loadSpiderAnimation = async () => {
      try {
        const response = await fetch('/lottie/Robot.json');
        const data = await response.json();
        setSpiderAnimation(data);
      } catch (error) {
        console.error('Failed to load spider animation:', error);
      }
    };
    loadSpiderAnimation();
  }, []);

  // Reset animation state when analysis starts
  useEffect(() => {
    if (isInputAnalyzing) {
      setHasPlayedOnce(false);
    }
  }, [isInputAnalyzing]);

  // Auto-trigger analysis if analyzeUrl is present in query params
  useEffect(() => {
    const analyzeUrl = searchParams.get('analyzeUrl');
    if (analyzeUrl && !isInputAnalyzing) {
      setInputUrl(analyzeUrl);
      setIsInputAnalyzing(true);
      setError(null);
      (async () => {
        try {
          const isServerRunning = await AEOApiService.isServerRunning();
          if (!isServerRunning) {
            throw new Error('AEO analysis server is not running. Please start the backend server first.');
          }
          await analyzeMutation.mutateAsync(analyzeUrl);
          // Remove analyzeUrl from query params after triggering
          searchParams.delete('analyzeUrl');
          setSearchParams(searchParams, { replace: true });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
          setIsInputAnalyzing(false);
        }
      })();
    }
  }, [searchParams, setSearchParams, isInputAnalyzing]);

  const analyzeMutation = useMutation({
    mutationFn: (url: string) => AEOApiService.analyzeWebsite({ url, max_pages: 10 }),
    onSuccess: (data, variables) => {
      if (data?.success && data?.data) {
        const normUrl = normalizeUrl(variables);
        queryClient.setQueryData(['aeo-analysis', normUrl], data.data);
        localStorage.setItem('lastAnalyzedUrl', normUrl);
        try {
          localStorage.setItem(`aeo-analysis-${normUrl}`, JSON.stringify(data.data));
        } catch (err) {
          console.error('Failed saving analysis to localStorage', err);
        }
        
        // Ensure animation plays fully at least once before navigating
        setTimeout(() => {
          setIsInputAnalyzing(false); // Hide animation
          navigate(`/aeo-analysis?url=${encodeURIComponent(normUrl)}`);
        }, 1000); // Give animation time to complete
      }
    },
    onError: (err: any) => {
      setError(err?.message || 'An unexpected error occurred');
      setIsInputAnalyzing(false); // Hide animation on error
    },
  });

  const handleTryBeta = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Check if server is running
      const isServerRunning = await AEOApiService.isServerRunning();
      
      if (!isServerRunning) {
        throw new Error('AEO analysis server is not running. Please start the backend server first.');
      }

      // Run analysis on a default URL (you can make this configurable)
      const analysisRequest = {
        url: 'https://healthline.com/',
        max_pages: 10
      };

      const response = await AEOApiService.analyzeWebsite(analysisRequest);
      
      if (response.success && response.data) {
        const normUrl = normalizeUrl(analysisRequest.url);
        queryClient.setQueryData(['aeo-analysis', normUrl], response.data);
        localStorage.setItem('lastAnalyzedUrl', normUrl);
        try {
          localStorage.setItem(`aeo-analysis-${normUrl}`, JSON.stringify(response.data));
        } catch (err) {
          console.error('Failed saving analysis to localStorage', err);
        }
        navigate(`/aeo-analysis?url=${encodeURIComponent(normUrl)}`);
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsInputAnalyzing(true);
    try {
      const isServerRunning = await AEOApiService.isServerRunning();
      if (!isServerRunning) {
        throw new Error('AEO analysis server is not running. Please start the backend server first.');
      }
      await analyzeMutation.mutateAsync(inputUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsInputAnalyzing(false); // Only set to false on error
    }
  };

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, #d1d5db 1px, transparent 1.2px)',
          backgroundSize: '14px 14px',
          opacity: 0.2,
          backgroundColor: '#fff',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 80%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 80%, transparent 100%)',
        }}
      />
      <Header />
      <main id="hero" className="flex flex-col items-center justify-center min-h-[90vh] px-4 pt-24 pb-2 md:pt-32 md:pb-8 relative z-10">
        <motion.h1
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-black text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Be the answer that AI finds
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-3xl text-gray-600 text-center mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Instant visibility in AI-powered search.
        </motion.p>
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-md text-center"
          >
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleInputAnalyze} className="flex flex-col items-center gap-3 mb-20 w-full max-w-2xl">
          <input
            id="analyze-input"
            type="url"
            className="border border-gray-300 rounded-full px-6 py-4 text-lg font-normal focus:outline-none focus:ring-2 focus:ring-black bg-white text-black placeholder-gray-400 w-full"
            placeholder="Enter your website URL (e.g. https://yourdomain.com)"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            required
            disabled={isInputAnalyzing}
          />
          <button
            type="submit"
            className={`bg-black text-white rounded-full px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition flex items-center gap-2 ${isInputAnalyzing ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={isInputAnalyzing}
          >
            {isInputAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Analyze
          </button>
        </form>

        {/* Straddling line and video card */}
        <div className="relative w-full py-20 md:py-32">
          {/* 1px line, centered vertically */}
          <div
            className="absolute inset-x-0 top-1/2 h-px bg-gray-200 opacity-60 dark:hidden"
            style={{ transform: 'translateY(-50%)' }}
          />

          {/* Video card, straddling the line */}
          <motion.div
            className="relative z-10 mx-auto w-full max-w-5xl aspect-[16/6] md:aspect-video rounded-2xl overflow-hidden shadow-lg"
            style={{ marginTop: '-4rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-white w-full h-full">
              <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src="/herovideo.mp4"
                  loop
                  playsInline
                  preload="metadata"
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                />
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl" />
                
                {/* Custom Play/Pause Button */}
                <button
                  onClick={handleVideoToggle}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                >
                  <div className="relative">
                    {/* White outer circle */}
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                      {/* Black inner circle */}
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                        {/* White play/pause icon */}
                        {isVideoPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      {isInputAnalyzing && spiderAnimation && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white">
          <div className="w-80 h-80">
            <Lottie 
              animationData={spiderAnimation}
              loop={!hasPlayedOnce}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
              onComplete={() => {
                setHasPlayedOnce(true);
              }}
            />
          </div>
          <div className="mt-6 text-lg font-semibold text-black">Analyzing...</div>
          <div className="mt-2 text-sm text-gray-600 max-w-md text-center px-4">
            {loadingMessage}
          </div>
        </div>
      )}
    </div>
  );
}