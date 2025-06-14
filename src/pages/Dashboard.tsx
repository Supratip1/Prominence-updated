import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation, useScroll, useTransform, Variants } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Volume2,
  VolumeX,
  Check,
  Star,
  Zap,
  Shield,
  BarChart,
  Users,
  Sparkles,
  Rocket,
  Target,
  Search,
  BarChart2,
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  Activity,
  Pause,
  BarChart3,
  Globe,
  BookOpen,
  Code,
  ChevronRight,
  ExternalLink,
  Brain,
  Lightbulb,
  MessageSquare,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  Share2,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Lottie from 'lottie-react';
import ConveyorBelt from '../components/ConveyorBelt';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

// Analysis Components
import AnalysisForm from '../components/AnalysisWorkflow/AnalysisForm';
import CrawlProgress from '../components/AnalysisWorkflow/CrawlProgress';
import LiveAssetFeed from '../components/AnalysisWorkflow/LiveAssetFeed';
import AssetFilterBar from '../components/AnalysisWorkflow/AssetFilterBar';
import AssetGrid from '../components/AnalysisWorkflow/AssetGrid';
import AEOScorecard from '../components/AnalysisWorkflow/AEOScorecard';
import AEOValidationPanel from '../components/AnalysisWorkflow/AEOValidationPanel';
import OptimizationEngine from '../components/AnalysisWorkflow/OptimizationEngine';
import ExportCSVButton from '../components/AnalysisWorkflow/ExportCSVButton';
import SendToOptimizationButton from '../components/AnalysisWorkflow/SendToOptimizationButton';
import AssetPreviewModal from '../components/AnalysisWorkflow/AssetPreviewModal';


// Animation variants
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
}

const textReveal: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15,
      delay: 0.3
    } 
  }
}

const buttonHover = {
  scale: 1.05,
  boxShadow: "0 20px 40px rgba(173, 255, 47, 0.4)",
  transition: { type: 'spring', stiffness: 300, damping: 20 }
}

const buttonSecondaryHover = {
  scale: 1.05,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  boxShadow: "0 15px 30px rgba(255, 255, 255, 0.2)",
  borderColor: "rgba(255, 255, 255, 0.3)",
  transition: { type: 'spring', stiffness: 300, damping: 20 }
}

// logos for "Trusted by top teams"
const logos = [
  { src: '/logos/openai.webp',     alt: 'OpenAI'     },
  { src: '/logos/figma.png',      alt: 'Figma'      },
  { src: '/logos/cursor.png',     alt: 'Cursor'     },
  { src: '/logos/headspace.png',  alt: 'Headspace'  },
  { src: '/logos/perplexity.png', alt: 'Perplexity' },
  { src: '/logos/vercel.png',     alt: 'Vercel'     },
];

// Mock data for demo
const mockKeywords = [
  { keyword: "best CRM software", score: 85, trend: "up", citations: 12 },
  { keyword: "project management tools", score: 72, trend: "up", citations: 8 },
  { keyword: "AI writing assistant", score: 91, trend: "down", citations: 15 },
  { keyword: "cloud hosting providers", score: 68, trend: "up", citations: 6 },
  { keyword: "design collaboration", score: 79, trend: "up", citations: 10 }
];

const mockAnalytics = {
  totalKeywords: 247,
  avgVisibility: 78,
  totalCitations: 1234,
  weeklyGrowth: 12.5
};

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Head of Growth",
    company: "TechFlow",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Prominence.ai transformed how we track our brand visibility. Our AI search rankings improved by 300% in just 3 months.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO",
    company: "DataVault",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The insights we get from AI search tracking are invaluable. We can now optimize our content for LLM responses effectively.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Marketing Director",
    company: "CloudSync",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Finally, a tool that shows us how our brand appears in AI responses. The competitive analysis features are game-changing.",
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    role: "Product Manager",
    company: "InnovateLab",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Prominence.ai helped us understand our AI visibility gaps. We're now mentioned in 80% more AI responses.",
    rating: 5
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "CMO",
    company: "GrowthHack",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The real-time tracking and alerts keep us ahead of the competition. Essential tool for modern marketing teams.",
    rating: 5
  },
  {
    id: 6,
    name: "Alex Johnson",
    role: "Founder",
    company: "StartupX",
    avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "As a startup, visibility is everything. This platform helped us get noticed by AI systems and increased our organic reach.",
    rating: 5
  },
  {
    id: 7,
    name: "Rachel Green",
    role: "SEO Manager",
    company: "DigitalFirst",
    avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The keyword tracking for AI responses is incredibly detailed. We can see exactly how our optimization efforts pay off.",
    rating: 5
  },
  {
    id: 8,
    name: "Michael Brown",
    role: "VP Marketing",
    company: "ScaleUp",
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Prominence.ai gives us the competitive edge we need. The insights are actionable and the interface is beautiful.",
    rating: 5
  },
  {
    id: 9,
    name: "Jennifer Lee",
    role: "Content Director",
    company: "ContentCorp",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Our content strategy is now data-driven thanks to AI search insights. We know exactly what resonates with AI systems.",
    rating: 5
  },
  {
    id: 10,
    name: "Robert Wilson",
    role: "Growth Lead",
    company: "TechNova",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The ROI tracking features help us justify our AI optimization spend. Clear metrics, clear results.",
    rating: 5
  },
  {
    id: 11,
    name: "Amanda Davis",
    role: "Brand Manager",
    company: "BrandForce",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Brand monitoring in AI responses was impossible before this tool. Now we have complete visibility and control.",
    rating: 5
  },
  {
    id: 12,
    name: "James Miller",
    role: "Digital Strategist",
    company: "FutureFlow",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The competitive analysis dashboard shows us exactly where we stand vs competitors in AI search results.",
    rating: 5
  },
  {
    id: 13,
    name: "Sophie Anderson",
    role: "Marketing Lead",
    company: "InnovateCo",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Implementation was seamless and results came quickly. Our AI visibility score improved dramatically in weeks.",
    rating: 5
  },
  {
    id: 14,
    name: "Daniel Garcia",
    role: "Product Lead",
    company: "NextGen",
    avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The API integration made it easy to incorporate AI visibility data into our existing analytics stack.",
    rating: 5
  },
  {
    id: 15,
    name: "Olivia Martinez",
    role: "Head of Digital",
    company: "DigitalEdge",
    avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Real-time alerts help us respond quickly to changes in AI search results. Invaluable for reputation management.",
    rating: 5
  },
  {
    id: 16,
    name: "Thomas White",
    role: "CMO",
    company: "GrowthLab",
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The detailed reporting helps us communicate AI visibility ROI to stakeholders. Clear, professional, actionable.",
    rating: 5
  },
  {
    id: 17,
    name: "Isabella Clark",
    role: "SEO Director",
    company: "SearchPro",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Traditional SEO is evolving, and this tool keeps us ahead of the curve with AI-first optimization strategies.",
    rating: 5
  },
  {
    id: 18,
    name: "Christopher Taylor",
    role: "Founder",
    company: "TechStart",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "As a tech startup, being visible in AI responses is crucial. This platform made it possible and measurable.",
    rating: 5
  },
  {
    id: 19,
    name: "Victoria Adams",
    role: "Marketing Manager",
    company: "BrandBoost",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The keyword suggestion engine helped us discover new opportunities we never would have found otherwise.",
    rating: 5
  },
  {
    id: 20,
    name: "Andrew Lewis",
    role: "Growth Manager",
    company: "ScaleTech",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The user interface is intuitive and the data visualization makes complex AI metrics easy to understand.",
    rating: 5
  },
  {
    id: 21,
    name: "Grace Robinson",
    role: "Content Manager",
    company: "ContentFlow",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Content optimization recommendations are spot-on. Our AI citation rate increased by 250% following their suggestions.",
    rating: 5
  },
  {
    id: 22,
    name: "Nathan Hall",
    role: "Digital Director",
    company: "FutureBrand",
    avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Comprehensive analytics and beautiful reporting. Everything we need to track and improve our AI search presence.",
    rating: 5
  },
  {
    id: 23,
    name: "Zoe Turner",
    role: "VP Growth",
    company: "RapidScale",
    avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The competitive benchmarking features help us stay ahead. We can see exactly how we compare to industry leaders.",
    rating: 5
  },
  {
    id: 24,
    name: "Ryan Cooper",
    role: "Product Manager",
    company: "InnovateNow",
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Historical data tracking helps us understand trends and make informed decisions about our AI optimization strategy.",
    rating: 5
  },
  {
    id: 25,
    name: "Mia Phillips",
    role: "Brand Director",
    company: "BrandVision",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Customer support is exceptional. The team helped us set up custom tracking for our unique industry requirements.",
    rating: 5
  },
  {
    id: 26,
    name: "Kevin Evans",
    role: "Marketing Director",
    company: "GrowthEngine",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "ROI is clear and measurable. We can directly attribute increased leads to improved AI search visibility.",
    rating: 5
  },
  {
    id: 27,
    name: "Chloe Parker",
    role: "SEO Lead",
    company: "SearchFirst",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The platform evolves with the AI landscape. Regular updates ensure we're always optimizing for the latest algorithms.",
    rating: 5
  },
  {
    id: 28,
    name: "Brandon Scott",
    role: "Founder",
    company: "TechPioneer",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Game-changing insights for startups. Understanding AI visibility helped us compete with much larger companies.",
    rating: 5
  },
  {
    id: 29,
    name: "Aria Collins",
    role: "Growth Lead",
    company: "ScaleForward",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The automation features save us hours every week. Set it up once and get continuous insights into AI performance.",
    rating: 5
  },
  {
    id: 30,
    name: "Jordan Reed",
    role: "Digital Manager",
    company: "NextWave",
    avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Excellent value for money. The insights we get far exceed the cost, and the time savings are substantial.",
    rating: 5
  }
];

// Pricing plans data
const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    period: "month",
    description: "Perfect for individuals and small projects",
    features: [
      "5 keywords tracked",
      "Weekly AI crawls",
      "Basic visibility dashboard",
      "Email notifications",
      "Community support"
    ],
    buttonText: "Get Started Free",
    popular: false
  },
  {
    name: "Professional",
    price: 49,
    period: "month",
    description: "Ideal for growing businesses and teams",
    features: [
      "100 keywords tracked",
      "Daily AI crawls",
      "Advanced analytics & insights",
      "API access",
      "Custom reports",
      "Priority support",
      "Competitor analysis",
      "Historical data (12 months)"
    ],
    buttonText: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited keywords",
      "Real-time AI crawls",
      "White-label reports",
      "Team collaboration",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security",
      "Custom training & onboarding"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
];

// Utility to randomly select one of the three animation URLs in public/lottie
const lottieAnimations = [
  '/lottie/Animation2.json',
  '/lottie/Animation3.json',
];

// Space-themed floating orbs/stars
const FloatingOrb = ({ delay = 0, duration = 4, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} rounded-full bg-white/60 blur-[0.5px]`}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -60, 40, 0],
        opacity: [0.3, 1, 0.5, 0.3],
        scale: [1, 1.5, 0.8, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  );
};

// Multiple floating stars for space effect
const SpaceStars = () => (
  <>
    <FloatingOrb delay={0} duration={8} size="sm" />
    <FloatingOrb delay={1} duration={6} size="md" />
    <FloatingOrb delay={2} duration={10} size="lg" />
    <FloatingOrb delay={3} duration={7} size="sm" />
    <FloatingOrb delay={4} duration={9} size="xl" />
    <FloatingOrb delay={5} duration={5} size="md" />
    <FloatingOrb delay={6} duration={11} size="sm" />
    <FloatingOrb delay={7} duration={8} size="lg" />
  </>
);

const PremiumGradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);



// Analysis interfaces
interface Asset {
  id: string;
  type: 'webpage' | 'video' | 'screenshot' | 'document' | 'social';
  title: string;
  url: string;
  sourceDomain: string;
  thumbnail?: string;
  description?: string;
  createdAt: Date;
  size?: string;
  status: 'active' | 'inactive' | 'error';
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

export default function Dashboard() {
  const location = typeof window !== 'undefined' ? window.location : { hash: '' };
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // slight delay to ensure DOM is ready
    }
  }, [location.hash]);

  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Analysis workflow state
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [assetsSoFar, setAssetsSoFar] = useState<Asset[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | Asset['type'],
    source: 'all' as string,
    status: 'all' as 'all' | Asset['status']
  });
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  
  // AEO Scorecard state
  const [scores, setScores] = useState<AEOScore[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  
  // Validation state
  const [validated, setValidated] = useState<Record<string, ValidationResult>>({});
  
  // Optimization suggestions state
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const [domain, setDomain] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const validateDomain = async (url: string): Promise<boolean> => {
    setIsValidating(true);
    setError('');

    const tryUrl = (prefix: 'https://' | 'http://') => {
      const full = url.startsWith('http') ? url : prefix + url;
      return fetch(full, { method: 'HEAD', mode: 'no-cors', cache: 'no-cache' });
    };

    try {
      // 1. Try HTTPS
      await tryUrl('https://');
      setIsValidating(false);
      return true;
    } catch {
      // 2. Fallback to HTTP
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

  const debouncedValidate = useMemo(
    () => debounce((url: string) => {
      if (url) {
        validateDomain(url);
      }
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    setError('');
    if (value) {
      debouncedValidate(value);
    }
  };

  const handleBlur = () => {
    if (domain) {
      validateDomain(domain);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    const isValid = await validateDomain(domain);
    if (!isValid) return;

    navigate(`/analysis?domain=${encodeURIComponent(domain)}`);
  };

  useEffect(() => {
    const randomLottieUrl = lottieAnimations[Math.floor(Math.random() * lottieAnimations.length)];
    fetch(randomLottieUrl)
      .then(res => res.json())
      .then(setAnimationData);
  }, []);

  // Demo automation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setDemoStep(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Analysis workflow handlers
  const filteredAssets = assets.filter(asset => {
    if (filters.type !== 'all' && asset.type !== filters.type) return false;
    if (filters.source !== 'all' && asset.sourceDomain !== filters.source) return false;
    if (filters.status !== 'all' && asset.status !== filters.status) return false;
    return true;
  });

  const handleScoreComplete = async (engine: 'perplexity' | 'chatgpt' | 'claude') => {
    setIsScoring(true);
    
    // Simulate AEO scoring
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newScores: AEOScore[] = filteredAssets.map(asset => ({
      assetId: asset.id,
      engine,
      score: Math.floor(Math.random() * 40 + 60), // 60-100 score
      factors: {
        relevance: Math.floor(Math.random() * 30 + 70),
        authority: Math.floor(Math.random() * 40 + 60),
        freshness: Math.floor(Math.random() * 50 + 50),
        engagement: Math.floor(Math.random() * 35 + 65)
      },
      lastUpdated: new Date()
    }));
    
    setScores(newScores);
    setIsScoring(false);
  };

  const handleValidation = (assetId: string, passed: boolean, notes?: string) => {
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

  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    
    // Simulate AI suggestion generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const suggestionTypes: OptimizationSuggestion['type'][] = ['title', 'description', 'content', 'technical', 'structure'];
    const priorities: OptimizationSuggestion['priority'][] = ['high', 'medium', 'low'];
    const efforts: OptimizationSuggestion['effort'][] = ['low', 'medium', 'high'];
    
    const newSuggestions: OptimizationSuggestion[] = filteredAssets.flatMap(asset => {
      const numSuggestions = Math.floor(Math.random() * 3 + 1);
      return Array.from({ length: numSuggestions }, (_, i) => {
        const type = suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)];
        return {
          id: `suggestion-${asset.id}-${i}`,
          assetId: asset.id,
          type,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          suggestion: getSuggestionText(type, asset),
          impact: getImpactText(type),
          effort: efforts[Math.floor(Math.random() * efforts.length)],
          implemented: false
        };
      });
    });
    
    setSuggestions(newSuggestions);
    setIsGeneratingSuggestions(false);
  };

  const getSuggestionText = (type: OptimizationSuggestion['type'], asset: Asset): string => {
    const suggestions = {
      title: `Optimize title for "${asset.title}" to include primary keywords and stay under 60 characters`,
      description: `Add compelling meta description highlighting unique value proposition`,
      content: `Enhance content structure with H2/H3 headings and improve readability score`,
      technical: `Optimize image alt tags and implement structured data markup`,
      structure: `Improve internal linking and add breadcrumb navigation`
    };
    return suggestions[type];
  };

  const getImpactText = (type: OptimizationSuggestion['type']): string => {
    const impacts = {
      title: 'High - Directly affects click-through rates',
      description: 'Medium - Improves search snippet appeal',
      content: 'High - Enhances user engagement and dwell time',
      technical: 'Medium - Improves accessibility and SEO signals',
      structure: 'Low - Supports overall site architecture'
    };
    return impacts[type];
  };



  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Space Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SpaceStars />
        
        {/* Animated space particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.8)]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.5, 1.2, 0.5],
                y: [0, -15, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Subtle grid pattern for space depth */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-all duration-500"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              boxShadow: '0 0 15px rgba(255,255,255,0.2)',
              filter: 'blur(0.5px)',
              maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            }}
          />
        </div>
        
        {/* Cosmic glow effects */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-900/30 via-transparent to-transparent" />
      </div>

      <div id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-12 relative z-10 mt-0 sm:mt-8 md:mt-16">
        {/* Hero Section */}
        <motion.div
          className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-2 sm:gap-3 lg:gap-1 mb-2 sm:mb-3 lg:mb-4"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Animation */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end w-full mb-4 lg:mb-0 mt-8 lg:mt-0"
            variants={item}
          >
            <div className="w-full max-w-md overflow-hidden">
              {animationData && (
                <Lottie 
                  animationData={animationData}
                  loop 
                  autoplay 
                  className="w-full h-auto" 
                />
              )}
            </div>
          </motion.div>

          {/* Enhanced Horizontal Divider for mobile/tablet */}
          <motion.div 
            className="order-2 lg:hidden w-full"
            variants={item}
          >
            <div className="relative flex justify-center my-6">
              <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-full max-w-sm" />
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            </div>
          </motion.div>

          {/* Premium Enhanced Headline/Text with Space Theme */}
          <motion.div
            className="order-3 lg:order-1 flex flex-col w-full text-center lg:text-left max-w-5xl mx-auto lg:mx-0 lg:ml-16 relative"
            variants={item}
          >
            {/* Cosmic glow behind text */}
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20 rounded-3xl blur-3xl opacity-50" />
            
            <motion.div className="relative z-10">
              <motion.h1
                className="
                  text-4xl sm:text-5xl md:text-6xl lg:text-5xl
                  font-bold text-white
                  mb-3 leading-tight tracking-[-2px]
                  drop-shadow-2xl
                "
                variants={textReveal}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.7), 0 0 60px rgba(255, 255, 255, 0.5)',
                  filter: 'brightness(1.2)'
                }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Increase your Ranking
                </motion.span>
                <br/>
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
                  style={{
                    background: 'linear-gradient(135deg, #adff2f 0%, #7cfc00 50%, #32cd32 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 20px rgba(173, 255, 47, 0.5)',
                  }}
                >
                  in LLM Searches
                </motion.span>
              </motion.h1>
              
              <motion.p
                className="
                  text-lg sm:text-xl lg:text-3xl
                  text-gray-300 mb-8 leading-relaxed
                  max-w-2xl mx-auto lg:mx-0 text-center lg:text-left
                  font-medium
                "
                variants={textReveal}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segue UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '-0.01em',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  Rise to the top in AI-powered search.
                </motion.span>
              </motion.p>
              


              {/* Premium Start Analysis Section in Hero */}
              <motion.div
                className="mt-12 max-w-2xl mx-auto lg:mx-0"
                variants={textReveal}
              >
                <motion.div
                  className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(173, 255, 47, 0.15)" }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#adff2f]/10 to-[#7cfc00]/10 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Start Your Analysis
                      </h3>
                      <p className="text-sm text-white/60">
                        Discover hidden opportunities in seconds
                      </p>
                    </div>
                    <form 
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <p className="text-center text-white/60 text-sm mb-8">
                        Get instant insights into your digital assets and SEO performance
                      </p>
                      <div className="relative">
                        <div className="flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-center">
                          <input
                            type="text"
                            name="domain"
                            placeholder="Enter your domain (e.g., yourcompany.com)"
                            required
                            onBlur={handleBlur}
                            onChange={handleInputChange}
                            className="flex-1 w-full h-14 pl-6 pr-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#adff2f]/50 focus:border-[#adff2f]/50 text-lg"
                          />
                          {isValidating && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            </div>
                          )}
                          <motion.button
                            type="submit"
                            className="h-10 px-6 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-lg transition-all shadow-lg shadow-green-500/30 w-full sm:w-auto mt-2 sm:mt-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Analyze →
                          </motion.button>
                        </div>
                        {error && (
                          <p className="text-sm text-red-400 mt-2">{error}</p>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Premium Demo Video Section */}
        <motion.section 
          id="demo" 
          className="py-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4">
            {/* Bold white line above video mock */}
            <div className="text-2xl font-bold text-white text-center mb-8">
              Watch us leapfrog the market's biggest names—site after site—inside ChatGPT & Perplexity
            </div>
            {/* Premium Video Container */}
            <motion.div
              className="relative max-w-6xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#adff2f]/20 via-[#7cfc00]/20 to-[#adff2f]/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Video Container */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="aspect-video relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10">
                  {/* Placeholder for future video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <motion.div
                        className="w-28 h-28 sm:w-24 sm:h-24 mx-auto bg-gradient-to-r from-[#adff2f] to-[#7cfc00] rounded-full flex items-center justify-center shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          boxShadow: [
                            "0 0 20px rgba(173, 255, 47, 0.3)",
                            "0 0 40px rgba(173, 255, 47, 0.6)",
                            "0 0 20px rgba(173, 255, 47, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <svg className="w-12 h-12 sm:w-10 sm:h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Demo Video Coming Soon</h3>
                        <p className="text-gray-400 text-sm sm:text-base">Experience the full power of our AI search optimization platform</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Footer below video: keep small and blank */}
                <div className="mt-8" />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Trust Indicators with Space Theme */}
        <motion.div className="mb-16">
          <div className="flex flex-col md:flex-row items-center md:justify-start gap-4 md:gap-8 py-6 opacity-95 md:h-24">
            <div className="flex items-center gap-4 mb-2 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white/20 shadow-lg"></div>
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-white/20 shadow-lg"></div>
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white/20 shadow-lg"></div>
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-white/20 shadow-lg"></div>
              </div>
              <motion.p 
                className="text-base md:text-2xl font-bold text-white/80 whitespace-nowrap leading-none tracking-[-0.02em]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
              >
                Trusted by <span className="text-[#adff2f]">10,000+</span> teams
              </motion.p>
            </div>
            
            <div className="relative w-full overflow-hidden h-14 md:h-24 flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
              <ConveyorBelt logos={logos} />
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our Customers Say
            </motion.h2>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <PricingCards plans={pricingPlans} />
          </div>
        </motion.section>


      </div>

      {/* Footer Section */}
      <footer className="relative z-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center gap-6 border-t border-white/10 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium mb-2">
            <button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-white/70 hover:text-green-300 transition">Dashboard</button>
            <button onClick={() => window.location.href = '/analysis'} className="text-white/70 hover:text-green-300 transition">Asset Discovery</button>
            <button onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-white/70 hover:text-green-300 transition">Testimonials</button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-white/70 hover:text-green-300 transition">Pricing</button>
          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

          {/* Socials */}
          <div className="flex gap-4 mb-2">
            <a href="#" className="text-white/60 hover:text-green-300 transition" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.77c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.9 3.99 2.93A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg>
            </a>
            <a href="#" className="text-white/60 hover:text-green-300 transition" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 mt-2">
            &copy; {new Date().getFullYear()} Prominence.ai. All rights reserved.
          </div>
          {/* Subtle space effect */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="w-full h-full bg-gradient-to-t from-green-400/5 via-transparent to-transparent blur-2xl opacity-60" />
          </div>
        </div>
      </footer>
    </div>
  );
}

// Features Grid Component
function FeaturesGrid() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Engine Tracking",
      description: "Monitor your brand across ChatGPT, Claude, Perplexity, and more",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Keyword Intelligence",
      description: "Track thousands of keywords and their AI search performance",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Get instant insights into your AI visibility metrics",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Competitor Analysis",
      description: "See how you stack up against competitors in AI responses",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Get notified when your visibility changes significantly",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Coverage",
      description: "Track your brand visibility across different regions",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="relative group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-full">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 text-white`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Content Analyzer Section
function ContentAnalyzerSection() {
  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
        }}
      >
        Content Analyzer
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}
      >
        Optimize your content for AI search engines with our advanced analysis tools
      </motion.p>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">AI-Optimized Content</h3>
              </div>
              <p className="text-gray-300">
                Analyze your content to see how well it performs in AI search results. Get recommendations for improvement.
              </p>
              <ul className="space-y-2">
                {[
                  "Content structure analysis",
                  "AI citation potential scoring",
                  "Keyword density optimization",
                  "Readability improvements"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold w-full sm:w-auto mt-2 sm:mt-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Content Analyzer
              </motion.button>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">AI Citation Score</span>
                  <span className="text-green-400 font-bold">87/100</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Structure</span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Keywords</span>
                    <span className="text-yellow-400">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Readability</span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Keyword Research Section
function KeywordResearchSection() {
  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
        }}
      >
        Keyword Research
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}
      >
        Discover high-impact keywords that perform well in AI search engines
      </motion.p>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">AI Keyword Discovery</h3>
                </div>
                <p className="text-gray-300">
                  Find keywords that AI engines love. Our research tool analyzes millions of AI responses to identify trending topics.
                </p>
                
                {/* Mock keyword suggestions */}
                <div className="space-y-3">
                  {[
                    { keyword: "best project management software", difficulty: "Medium", volume: "12K", aiScore: 92 },
                    { keyword: "AI writing tools comparison", difficulty: "High", volume: "8.5K", aiScore: 88 },
                    { keyword: "cloud hosting providers", difficulty: "Low", volume: "15K", aiScore: 85 }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{item.keyword}</div>
                        <div className="text-white/60 text-sm">Volume: {item.volume} • Difficulty: {item.difficulty}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{item.aiScore}</div>
                        <div className="text-white/60 text-xs">AI Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">Research Features</h4>
                <ul className="space-y-3">
                  {[
                    "AI trend analysis",
                    "Competitor keyword gaps",
                    "Search volume predictions",
                    "Citation opportunity scoring"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <motion.button
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Research
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// API Docs Section
function ApiDocsSection() {
  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
        }}
      >
        API Documentation
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}
      >
        Integrate AI visibility data into your applications with our powerful API
      </motion.p>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Developer-First API</h3>
              </div>
              <p className="text-gray-300">
                RESTful API with comprehensive documentation, SDKs, and real-time webhooks for seamless integration.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Endpoints", value: "50+" },
                  { title: "Rate Limit", value: "10K/hour" },
                  { title: "Uptime", value: "99.9%" },
                  { title: "Response Time", value: "<100ms" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.title}</div>
                  </div>
                ))}
              </div>
              
              <motion.button
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Documentation
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 font-mono text-sm">
              <div className="text-green-400 mb-2">// Get keyword visibility data</div>
              <div className="text-white">
                <span className="text-blue-400">GET</span> /api/v1/keywords/visibility
              </div>
              <div className="text-gray-400 mt-4">
                {`{
  "keyword": "best CRM software",
  "visibility_score": 85,
  "citations": 12,
  "trend": "up",
  "engines": {
    "chatgpt": 92,
    "claude": 78,
    "perplexity": 89
  }
}`}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Blog Section
function BlogSection() {
  const blogPosts = [
    {
      title: "The Future of AI Search: What Marketers Need to Know",
      excerpt: "Explore how AI search engines are changing the digital marketing landscape and what you can do to stay ahead.",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Strategy"
    },
    {
      title: "Optimizing Content for AI Citations: A Complete Guide",
      excerpt: "Learn the best practices for creating content that AI engines love to cite and reference.",
      date: "Dec 12, 2024",
      readTime: "8 min read",
      category: "Tutorial"
    },
    {
      title: "Case Study: How TechCorp Increased AI Visibility by 300%",
      excerpt: "A deep dive into the strategies that helped TechCorp dominate AI search results in their industry.",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Case Study"
    }
  ];

  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
        }}
      >
        Latest Insights
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}
      >
        Stay updated with the latest trends and strategies in AI search optimization
      </motion.p>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">{post.category}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <motion.button
                className="mt-4 text-green-400 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                whileHover={{ x: 5 }}
              >
                Read more
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Posts
        </motion.button>
      </div>
    </div>
  );
}

// Testimonial Carousel Component
function TestimonialCarousel({ testimonials }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const cardWidth = 320; // Width of each testimonial card
  const gap = 24; // Gap between cards
  const totalWidth = testimonials.length * (cardWidth + gap);
  const duration = totalWidth / 30; // Adjust speed as needed

  return (
    <div className="relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div
        ref={containerRef}
        className="flex"
        style={{
          width: totalWidth * 2,
          animation: `testimonial-scroll ${duration}s linear infinite`,
        }}
      >
        {/* First set */}
        <div className="flex" style={{ gap: `${gap}px` }}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex" style={{ gap: `${gap}px`, marginLeft: `${gap}px` }}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`dup-${testimonial.id}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Testimonial Card
function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      className="flex-shrink-0 w-80 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Rating Stars */}
      <div className="flex mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-white/90 mb-6 leading-relaxed text-sm">
        "{testimonial.content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <div className="text-white font-medium text-sm">{testimonial.name}</div>
          <div className="text-gray-400 text-xs">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Pricing Cards Component
function PricingCards({ plans }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  return (
    <div className="relative">
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {plans.map((plan, index) => (
              <div key={plan.name} className="w-full flex-shrink-0 px-4">
                <PricingCard plan={plan} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
          aria-label="Previous pricing plan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
          aria-label="Next pricing plan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {plans.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`Go to pricing plan ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Pricing Card Component
function PricingCard({ plan, index }) {
  return (
    <motion.div
      className={`relative p-8 pt-12 md:pt-8 rounded-2xl border ${
        plan.popular 
          ? 'border-green-400/50 bg-gradient-to-b from-green-400/10 to-green-400/5' 
          : 'border-white/10 bg-white/5'
      } backdrop-blur-sm`}
      style={{
        background: plan.popular 
          ? 'linear-gradient(135deg, rgba(173,255,47,0.1) 0%, rgba(173,255,47,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: plan.popular
          ? '0 8px 32px rgba(173,255,47,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: plan.popular
          ? '0 12px 40px rgba(173,255,47,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        delay: index * 0.1 
      }}
    >
      {plan.popular && (
        <div className="absolute top-2 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
        <div className="mb-2">
          <span className="text-4xl font-bold text-white">
            ${plan.price}
          </span>
          <span className="text-gray-400">/{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
          plan.popular
            ? 'bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-300 hover:to-green-400'
            : 'border-2 border-white/20 text-white hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {plan.buttonText}
        {plan.popular && (
          <ArrowRight className="w-4 h-4 inline-block ml-2" />
        )}
      </motion.button>
    </motion.div>
  );
}// Enhanced CSS animations
const style = document.createElement('style');
style.innerHTML = `
@keyframes conveyor-seamless {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes testimonial-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 3s ease-in-out infinite;
  animation-delay: 1.5s;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile responsive improvements */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-responsive {
    font-size: clamp(0.875rem, 2.5vw, 1rem);
  }
  
  .heading-responsive {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
  }
}
`;

if (!document.head.querySelector('style[data-premium-animations]')) {
  style.setAttribute('data-premium-animations', 'true');
  document.head.appendChild(style);
}

