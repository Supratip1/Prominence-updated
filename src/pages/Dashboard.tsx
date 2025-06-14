import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Star,
  DollarSign,
  Clock,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Lazy load components for better performance
const TestimonialCarousel = lazy(() => import('../components/TestimonialCarousel'));
const PricingCards = lazy(() => import('../components/PricingCards'));
const ConveyorBelt = lazy(() => import('../components/ConveyorBelt'));

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const demoInView = useInView(demoRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // URL validation function
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (no error state)
    
    // Remove protocol if present for validation
    const cleanUrl = url.replace(/^https?:\/\//, '');
    
    // Basic domain validation regex
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    return domainRegex.test(cleanUrl) || ipRegex.test(cleanUrl);
  };

  const handleAnalysisSubmit = async () => {
    if (!analysisQuery.trim()) return;
    
    if (!validateUrl(analysisQuery)) {
      setIsValidUrl(false);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    navigate(`/analysis?domain=${encodeURIComponent(analysisQuery)}`);
  };

  const handleInputChange = (value: string) => {
    setAnalysisQuery(value);
    if (!isValidUrl) {
      setIsValidUrl(validateUrl(value));
    }
  };

  // Mock data
  const logos = [
    { src: '/logos/openai.webp', alt: 'OpenAI' },
    { src: '/logos/perplexity.png', alt: 'Perplexity' },
    { src: '/logos/figma.png', alt: 'Figma' },
    { src: '/logos/vercel.png', alt: 'Vercel' },
    { src: '/logos/cursor.png', alt: 'Cursor' },
    { src: '/logos/headspace.png', alt: 'Headspace' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Head of Marketing',
      company: 'TechFlow',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'GEO Analytics transformed how we track our AI visibility. We saw a 300% increase in AI-driven traffic within 3 months.',
      rating: 5
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'CEO',
      company: 'DataVault',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The insights we get from GEO Analytics are incredible. We can now optimize our content specifically for AI search engines.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Growth Lead',
      company: 'StartupX',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Finally, a tool that helps us understand how AI sees our brand. The competitive analysis features are game-changing.',
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for small businesses getting started with AI visibility',
      features: [
        '10 keywords tracked',
        'Weekly AI crawls',
        'Basic visibility dashboard',
        'Email notifications',
        'Standard support'
      ],
      color: 'blue'
    },
    {
      name: 'Professional',
      price: 99,
      description: 'Ideal for growing companies serious about AI optimization',
      features: [
        '100 keywords tracked',
        'Daily AI crawls',
        'Advanced analytics & insights',
        'Competitor tracking',
        'API access',
        'Priority support',
        'Custom reports'
      ],
      popular: true,
      color: 'purple'
    },
    {
      name: 'Enterprise',
      price: 299,
      description: 'For large organizations with complex AI visibility needs',
      features: [
        'Unlimited keywords',
        'Real-time AI monitoring',
        'White-label reports',
        'Team collaboration tools',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      color: 'green'
    }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'AI Search Monitoring',
      description: 'Track how your brand appears across ChatGPT, Claude, Perplexity, and other AI engines in real-time.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Visibility Analytics',
      description: 'Get detailed insights into your AI visibility score, citation frequency, and competitive positioning.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Competitor Analysis',
      description: 'See how you stack up against competitors in AI search results and identify optimization opportunities.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Smart Optimization',
      description: 'AI-powered recommendations to improve your content for better visibility in AI search results.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Brand Protection',
      description: 'Monitor and protect your brand reputation across AI platforms with automated alerts.',
      gradient: 'from-red-500 to-rose-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Coverage',
      description: 'Track your AI visibility across different regions and languages for comprehensive insights.',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { number: '500K+', label: 'AI Queries Analyzed', icon: <Search className="w-6 h-6" /> },
    { number: '98%', label: 'Accuracy Rate', icon: <Target className="w-6 h-6" /> },
    { number: '2.5x', label: 'Average Visibility Increase', icon: <TrendingUp className="w-6 h-6" /> },
    { number: '1000+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#adff2f]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7cfc00]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </motion.div>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-[#adff2f]" />
              <span className="text-sm sm:text-base text-white font-medium">AI Visibility Platform</span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white via-[#adff2f] to-[#7cfc00] bg-clip-text text-transparent">
                Master Your AI
              </span>
              <br />
              <span className="text-white">Visibility</span>
            </motion.h1>

            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Track, analyze, and optimize how your brand appears in AI search results across ChatGPT, Claude, Perplexity, and more.
            </motion.p>

            {/* Demo Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 sm:p-6 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#adff2f]/10 to-[#7cfc00]/10 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="text"
                        value={analysisQuery}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Enter your domain (e.g., yourcompany.com)"
                        className={`w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-4 rounded-xl bg-white/10 backdrop-blur-sm border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#adff2f]/50 text-base sm:text-lg transition-all ${
                          !isValidUrl ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' : 'border-white/30 focus:border-[#adff2f]/50'
                        }`}
                        onKeyPress={(e) => e.key === 'Enter' && handleAnalysisSubmit()}
                      />
                      {!isValidUrl && (
                        <motion.p 
                          className="absolute -bottom-6 left-0 text-red-400 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          Please enter a valid domain name
                        </motion.p>
                      )}
                    </div>
                    <motion.button
                      onClick={handleAnalysisSubmit}
                      disabled={isLoading || !analysisQuery.trim() || !isValidUrl}
                      className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        />
                      ) : (
                        <>
                          <span className="hidden sm:inline">Analyze Now</span>
                          <span className="sm:hidden">Analyze</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 text-center"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex justify-center mb-2 text-[#adff2f]">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 sm:py-16 lg:py-20 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Join thousands of companies optimizing their AI visibility
            </p>
          </motion.div>
          
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <ConveyorBelt logos={logos} />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[#adff2f] to-[#7cfc00] bg-clip-text text-transparent">
                Powerful Features
              </span>{' '}
              for AI Optimization
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to dominate AI search results and stay ahead of the competition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" ref={demoRef} className="py-16 sm:py-20 lg:py-28 bg-gradient-to-r from-[#adff2f]/5 to-[#7cfc00]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={demoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              See It In Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Watch how GEO Analytics transforms your AI visibility strategy
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={demoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sm:p-8 lg:p-12 shadow-2xl">
              <div className="aspect-video bg-gray-800/50 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#adff2f]/20 to-[#7cfc00]/20" />
                <motion.button
                  className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/analysis?demo=true')}
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 group-hover:scale-110 transition-transform" />
                </motion.button>
                
                {/* Floating elements for visual appeal */}
                <motion.div
                  className="absolute top-4 left-4 bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-green-400 text-sm font-medium"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +127% Visibility
                </motion.div>
                <motion.div
                  className="absolute bottom-4 right-4 bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-blue-400 text-sm font-medium"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  AI Optimized
                </motion.div>
              </div>
              
              <div className="mt-6 sm:mt-8 text-center">
                <motion.button
                  onClick={() => navigate('/analysis')}
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl shadow-lg shadow-green-500/30 text-base sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-5 h-5" />
                  Try Live Demo
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              What Our Customers Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who've transformed their AI visibility
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={testimonialsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <TestimonialCarousel testimonials={testimonials} />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-16 sm:py-20 lg:py-28 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[#adff2f] to-[#7cfc00] bg-clip-text text-transparent">
                Simple Pricing
              </span>{' '}
              for Every Business
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan to boost your AI visibility and stay ahead of the competition
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <PricingCards plans={plans} />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Dominate AI Search?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed">
              Join thousands of companies already optimizing their AI visibility with GEO Analytics
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <motion.button
                onClick={() => navigate('/analysis')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl shadow-lg shadow-green-500/30 text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-5 h-5" />
                Start Free Analysis
              </motion.button>
              
              <motion.button
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="w-5 h-5" />
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}