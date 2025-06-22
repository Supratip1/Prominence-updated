"use client"

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react"
import { motion, useScroll, useTransform, type Variants, useInView } from "framer-motion"
import {
  ArrowRight,
  Check,
  Star,
  Zap,
  Target,
  Search,
  FileText,
  Eye,
  Activity,
  BarChart3,
  Globe,
  BookOpen,
  Code,
  ChevronRight,
  ExternalLink,
  Brain,
  Lightbulb,
  Users,
  TrendingUp,
  Loader2,
  Calendar,
  Download,
  X,
} from "lucide-react"
import Lottie from "lottie-react"
import { useNavigate } from "react-router-dom"
import debounce from "lodash/debounce"
import Button from "../components/UI/Button"
import ConveyorBelt from "../components/ConveyorBelt"
import PortfolioScreenshotsSection from "../components/PortfolioScreenshotsSection"
import ProminenceWorkflow from "../components/ProminenceWorkflow"
import Header from "../components/Layout/Header"


// Animation variants
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
}

const textReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.3,
    },
  },
}

const buttonHover = {
  scale: 1.05,
  boxShadow: "0 20px 40px rgba(173, 255, 47, 0.4)",
  transition: { type: "spring", stiffness: 300, damping: 20 },
}

const buttonSecondaryHover = {
  scale: 1.05,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  boxShadow: "0 15px 30px rgba(255, 255, 255, 0.2)",
  borderColor: "rgba(255, 255, 255, 0.3)",
  transition: { type: "spring", stiffness: 300, damping: 20 },
}

// logos for "Trusted by top teams"
const logos = [
  { src: "/logos/openai.webp", alt: "OpenAI" },
  { src: "/logos/figma.png", alt: "Figma" },
  { src: "/logos/cursor.png", alt: "Cursor" },
  { src: "/logos/headspace.png", alt: "Headspace" },
  { src: "/logos/perplexity.png", alt: "Perplexity" },
  { src: "/logos/vercel.png", alt: "Vercel" },
]

// Mock data for demo
const mockKeywords = [
  { keyword: "best CRM software", score: 85, trend: "up", citations: 12 },
  { keyword: "project management tools", score: 72, trend: "up", citations: 8 },
  { keyword: "AI writing assistant", score: 91, trend: "down", citations: 15 },
  { keyword: "cloud hosting providers", score: 68, trend: "up", citations: 6 },
  { keyword: "design collaboration", score: 79, trend: "up", citations: 10 },
]

const mockAnalytics = {
  totalKeywords: 247,
  avgVisibility: 78,
  totalCitations: 1234,
  weeklyGrowth: 12.5,
}

// Testimonials data
interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
}
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Head of Growth",
    company: "TechFlow",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Prominence.ai transformed how we track our brand visibility. Our AI search rankings improved by 300% in just 3 months.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO",
    company: "DataVault",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The insights we get from AI search tracking are invaluable. We can now optimize our content for LLM responses effectively.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Marketing Director",
    company: "CloudSync",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Finally, a tool that shows us how our brand appears in AI responses. The competitive analysis features are game-changing.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Product Manager",
    company: "InnovateLab",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Prominence.ai helped us understand our AI visibility gaps. We're now mentioned in 80% more AI responses.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "CMO",
    company: "GrowthHack",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The real-time tracking and alerts keep us ahead of the competition. Essential tool for modern marketing teams.",
    rating: 5,
  },
  {
    id: 6,
    name: "Alex Johnson",
    role: "Founder",
    company: "StartupX",
    avatar:
      "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "As a startup, visibility is everything. This platform helped us get noticed by AI systems and increased our organic reach.",
    rating: 5,
  },
  {
    id: 7,
    name: "Rachel Green",
    role: "SEO Manager",
    company: "DigitalFirst",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The keyword tracking for AI responses is incredibly detailed. We can see exactly how our optimization efforts pay off.",
    rating: 5,
  },
  {
    id: 8,
    name: "Michael Brown",
    role: "VP Marketing",
    company: "ScaleUp",
    avatar:
      "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Prominence.ai gives us the competitive edge we need. The insights are actionable and the interface is beautiful.",
    rating: 5,
  },
  {
    id: 9,
    name: "Jennifer Lee",
    role: "Content Director",
    company: "ContentCorp",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Our content strategy is now data-driven thanks to AI search insights. We know exactly what resonates with AI systems.",
    rating: 5,
  },
  {
    id: 10,
    name: "Robert Wilson",
    role: "Growth Lead",
    company: "TechNova",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The ROI tracking features help us justify our AI optimization spend. Clear metrics, clear results.",
    rating: 5,
  },
  {
    id: 11,
    name: "Amanda Davis",
    role: "Brand Manager",
    company: "BrandForce",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Brand monitoring in AI responses was impossible before this tool. Now we have complete visibility and control.",
    rating: 5,
  },
  {
    id: 12,
    name: "James Miller",
    role: "Digital Strategist",
    company: "FutureFlow",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The competitive analysis dashboard shows us exactly where we stand vs competitors in AI search results.",
    rating: 5,
  },
  {
    id: 13,
    name: "Sophie Anderson",
    role: "Marketing Lead",
    company: "InnovateCo",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Implementation was seamless and results came quickly. Our AI visibility score improved dramatically in weeks.",
    rating: 5,
  },
  {
    id: 14,
    name: "Daniel Garcia",
    role: "Product Lead",
    company: "NextGen",
    avatar:
      "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The API integration made it easy to incorporate AI visibility data into our existing analytics stack.",
    rating: 5,
  },
  {
    id: 15,
    name: "Olivia Martinez",
    role: "Head of Digital",
    company: "DigitalEdge",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Real-time alerts help us respond quickly to changes in AI search results. Invaluable for reputation management.",
    rating: 5,
  },
  {
    id: 16,
    name: "Thomas White",
    role: "CMO",
    company: "GrowthLab",
    avatar:
      "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The detailed reporting helps us communicate AI visibility ROI to stakeholders. Clear, professional, actionable.",
    rating: 5,
  },
  {
    id: 17,
    name: "Isabella Clark",
    role: "SEO Director",
    company: "SearchPro",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Traditional SEO is evolving, and this tool keeps us ahead of the curve with AI-first optimization strategies.",
    rating: 5,
  },
  {
    id: 18,
    name: "Christopher Taylor",
    role: "Founder",
    company: "TechStart",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "As a tech startup, being visible in AI responses is crucial. This platform made it possible and measurable.",
    rating: 5,
  },
  {
    id: 19,
    name: "Victoria Adams",
    role: "Marketing Manager",
    company: "BrandBoost",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The keyword suggestion engine helped us discover new opportunities we never would have found otherwise.",
    rating: 5,
  },
  {
    id: 20,
    name: "Andrew Lewis",
    role: "Growth Manager",
    company: "ScaleTech",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "The user interface is intuitive and the data visualization makes complex AI metrics easy to understand.",
    rating: 5,
  },
  {
    id: 21,
    name: "Grace Robinson",
    role: "Content Manager",
    company: "ContentFlow",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Content optimization recommendations are spot-on. Our AI citation rate increased by 250% following their suggestions.",
    rating: 5,
  },
  {
    id: 22,
    name: "Nathan Hall",
    role: "Digital Director",
    company: "FutureBrand",
    avatar:
      "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Comprehensive analytics and beautiful reporting. Everything we need to track and improve our AI search presence.",
    rating: 5,
  },
  {
    id: 23,
    name: "Zoe Turner",
    role: "VP Growth",
    company: "RapidScale",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The competitive benchmarking features help us stay ahead. We can see exactly how we compare to industry leaders.",
    rating: 5,
  },
  {
    id: 24,
    name: "Ryan Cooper",
    role: "Product Manager",
    company: "InnovateNow",
    avatar:
      "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Historical data tracking helps us understand trends and make informed decisions about our AI optimization strategy.",
    rating: 5,
  },
  {
    id: 25,
    name: "Mia Phillips",
    role: "Brand Director",
    company: "BrandVision",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Customer support is exceptional. The team helped us set up custom tracking for our unique industry requirements.",
    rating: 5,
  },
  {
    id: 26,
    name: "Kevin Evans",
    role: "Marketing Director",
    company: "GrowthEngine",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "ROI is clear and measurable. We can directly attribute increased leads to improved AI search visibility.",
    rating: 5,
  },
  {
    id: 27,
    name: "Chloe Parker",
    role: "SEO Lead",
    company: "SearchFirst",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The platform evolves with the AI landscape. Regular updates ensure we're always optimizing for the latest algorithms.",
    rating: 5,
  },
  {
    id: 28,
    name: "Brandon Scott",
    role: "Founder",
    company: "TechPioneer",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Game-changing insights for startups. Understanding AI visibility helped us compete with much larger companies.",
    rating: 5,
  },
  {
    id: 29,
    name: "Aria Collins",
    role: "Growth Lead",
    company: "ScaleForward",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The automation features save us hours every week. Set it up once and get continuous insights into AI performance.",
    rating: 5,
  },
  {
    id: 30,
    name: "Jordan Reed",
    role: "Digital Manager",
    company: "NextWave",
    avatar:
      "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Excellent value for money. The insights we get far exceed the cost, and the time savings are substantial.",
    rating: 5,
  },
]

// Pricing plans data
interface PricingPlan {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  buttonText: string
  popular: boolean
}
const pricingPlans: PricingPlan[] = [
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
      "Community support",
    ],
    buttonText: "Get Started Free",
    popular: false,
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
      "Historical data (12 months)",
    ],
    buttonText: "Start Free Trial",
    popular: true,
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
      "Custom training & onboarding",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
]

// Utility to randomly select one of the three animation URLs in public/lottie
const lottieAnimations = ["/lottie/Animation2.json", "/lottie/Animation3.json"]

// Space-themed floating orbs/stars
const FloatingOrb = ({
  delay = 0,
  duration = 4,
  size = "md",
}: { delay?: number; duration?: number; size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  }

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
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}

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
)

const PremiumGradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
)

// Analysis interfaces
interface Asset {
  id: string
  type: "webpage" | "video" | "screenshot" | "document" | "social"
  title: string
  url: string
  sourceDomain: string
  thumbnail?: string
  description?: string
  createdAt: Date
  size?: string
  status: "active" | "inactive" | "error"
}

interface AEOScore {
  assetId: string
  engine: "perplexity" | "chatgpt" | "claude"
  score: number
  factors: {
    relevance: number
    authority: number
    freshness: number
    engagement: number
  }
  lastUpdated: Date
}

interface ValidationResult {
  assetId: string
  passed: boolean
  notes?: string
  validatedBy: string
  validatedAt: Date
}

interface OptimizationSuggestion {
  id: string
  assetId: string
  type: "title" | "description" | "content" | "technical" | "structure"
  priority: "high" | "medium" | "low"
  suggestion: string
  impact: string
  effort: "low" | "medium" | "high"
  implemented: boolean
}

const footerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const footerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" } },
}
export default function Dashboard() {
  const location = typeof window !== "undefined" ? window.location : { hash: "" }
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "")
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100) // slight delay to ensure DOM is ready
    }
  }, [location.hash])

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const demoRef = useRef(null)
  const { scrollYProgress: demoScrollYProgress } = useScroll({
    target: demoRef,
    offset: ["start end", "end start"],
  })
  const demoTextY = useTransform(demoScrollYProgress, [0, 1], ["-20%", "20%"])
  const demoTextOpacity = useTransform(demoScrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0])

  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d")
  const [animationData, setAnimationData] = React.useState<any>(null)
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0)
  const [demoStep, setDemoStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  // Analysis workflow state
  const [query, setQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isCrawling, setIsCrawling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [assetsSoFar, setAssetsSoFar] = useState<Asset[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [filters, setFilters] = useState({
    type: "all" as "all" | Asset["type"],
    source: "all" as string,
    status: "all" as "all" | Asset["status"],
  })
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)

  // AEO Scorecard state
  const [scores, setScores] = useState<AEOScore[]>([])
  const [isScoring, setIsScoring] = useState(false)

  // Validation state
  const [validated, setValidated] = useState<Record<string, ValidationResult>>({})

  // Optimization suggestions state
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)

  const [domain, setDomain] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()

  const [isGridVisible, setIsGridVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [mobileActiveTab, setMobileActiveTab] = useState<'animation' | 'video'>('video')

  // Lottie animation rotation system
  const lottieAnimations = ["/lottie/Animation1.json", "/lottie/Animation2.json", "/lottie/Animation3.json"]
  const animationIntervals = [240000, 300000, 270000] // 4 min, 5 min, 4.5 min intervals

  // Load and rotate Lottie animations
  useEffect(() => {
    const loadAnimation = async (index: number) => {
      try {
        const response = await fetch(lottieAnimations[index])
        const data = await response.json()
        setAnimationData(data)
      } catch (error) {
        console.error('Failed to load animation:', error)
      }
    }

    // Load initial animation
    loadAnimation(currentAnimationIndex)

    // Set up rotation interval
    const interval = setInterval(() => {
      setCurrentAnimationIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % lottieAnimations.length
        loadAnimation(nextIndex)
        return nextIndex
      })
    }, animationIntervals[currentAnimationIndex])

    return () => clearInterval(interval)
  }, [currentAnimationIndex])

  // Mouse movement detection for grid visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setIsGridVisible(true)
      
      // Clear existing timeout
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
      
      // Hide grid after 2 seconds of no mouse movement
      mouseTimeoutRef.current = setTimeout(() => {
        setIsGridVisible(false)
      }, 2000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
    }
  }, [])

  const validateDomain = async (url: string): Promise<boolean> => {
    setIsValidating(true)
    setError("")

    const tryUrl = (prefix: "https://" | "http://") => {
      const full = url.startsWith("http") ? url : prefix + url
      return fetch(full, { method: "HEAD", mode: "no-cors", cache: "no-cache" })
    }

    try {
      // 1. Try HTTPS
      await tryUrl("https://")
      setIsValidating(false)
      return true
    } catch {
      // 2. Fallback to HTTP
      try {
        await tryUrl("http://")
        setIsValidating(false)
        return true
      } catch {
        setIsValidating(false)
        setError("Unable to reach this domain. Please check the URL and try again.")
        return false
      }
    }
  }

  const debouncedValidate = useMemo(
    () =>
      debounce((url: string) => {
        if (url) {
          validateDomain(url)
        }
      }, 500),
    [],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDomain(value)
    setError("")
    if (value) {
      debouncedValidate(value)
    }
  }

  const handleBlur = () => {
    if (domain) {
      validateDomain(domain)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain) return

    const isValid = await validateDomain(domain)
    if (!isValid) return

    navigate(`/analysis?domain=${encodeURIComponent(domain)}`)
  }

  // Demo automation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setDemoStep((prev) => (prev + 1) % 4)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  // Analysis workflow handlers
  const filteredAssets = assets.filter((asset) => {
    if (filters.type !== "all" && asset.type !== filters.type) return false
    if (filters.source !== "all" && asset.sourceDomain !== filters.source) return false
    if (filters.status !== "all" && asset.status !== filters.status) return false
    return true
  })

  const handleScoreComplete = async (engine: "perplexity" | "chatgpt" | "claude") => {
    setIsScoring(true)

    // Simulate AEO scoring
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newScores: AEOScore[] = filteredAssets.map((asset) => ({
      assetId: asset.id,
      engine,
      score: Math.floor(Math.random() * 40 + 60), // 60-100 score
      factors: {
        relevance: Math.floor(Math.random() * 30 + 70),
        authority: Math.floor(Math.random() * 40 + 60),
        freshness: Math.floor(Math.random() * 50 + 50),
        engagement: Math.floor(Math.random() * 35 + 65),
      },
      lastUpdated: new Date(),
    }))

    setScores(newScores)
    setIsScoring(false)
  }

  const handleValidation = (assetId: string, passed: boolean, notes?: string) => {
    setValidated((prev) => ({
      ...prev,
      [assetId]: {
        assetId,
        passed,
        notes,
        validatedBy: "Current User",
        validatedAt: new Date(),
      },
    }))
  }

  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true)

    // Simulate AI suggestion generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const suggestionTypes: OptimizationSuggestion["type"][] = [
      "title",
      "description",
      "content",
      "technical",
      "structure",
    ]
    const priorities: OptimizationSuggestion["priority"][] = ["high", "medium", "low"]
    const efforts: OptimizationSuggestion["effort"][] = ["low", "medium", "high"]

    const newSuggestions: OptimizationSuggestion[] = filteredAssets.flatMap((asset) => {
      const numSuggestions = Math.floor(Math.random() * 3 + 1)
      return Array.from({ length: numSuggestions }, (_, i) => {
        const type = suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)]
        return {
          id: `suggestion-${asset.id}-${i}`,
          assetId: asset.id,
          type,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          suggestion: getSuggestionText(type, asset),
          impact: getImpactText(type),
          effort: efforts[Math.floor(Math.random() * efforts.length)],
          implemented: false,
        }
      })
    })

    setSuggestions(newSuggestions)
    setIsGeneratingSuggestions(false)
  }

  const getSuggestionText = (type: OptimizationSuggestion["type"], asset: Asset): string => {
    const suggestions = {
      title: `Optimize title for "${asset.title}" to include primary keywords and stay under 60 characters`,
      description: `Add compelling meta description highlighting unique value proposition`,
      content: `Enhance content structure with H2/H3 headings and improve readability score`,
      technical: `Optimize image alt tags and implement structured data markup`,
      structure: `Improve internal linking and add breadcrumb navigation`,
    }
    return suggestions[type]
  }

  const getImpactText = (type: OptimizationSuggestion["type"]): string => {
    const impacts = {
      title: "High - Directly affects click-through rates",
      description: "Medium - Improves search snippet appeal",
      content: "High - Enhances user engagement and dwell time",
      technical: "Medium - Improves accessibility and SEO signals",
      structure: "Low - Supports overall site architecture",
    }
    return impacts[type]
  }

  return (
    <div className="relative overflow-x-hidden overflow-y-visible bg-black text-white">
      {/* Header */}
      <Header />
      
      {/* Main content wrapper with higher z-index */}
      <div className="relative z-10">
        {/* New Hero Section */}
        <div className="relative overflow-hidden bg-black text-white">
          <div
            className="absolute -inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)",
            }}
          />

          <div id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Mobile Layout - Only applies to mobile */}
            <div className="lg:hidden">
              <div className="text-center pt-16 pb-8">
                <motion.h1
                  className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Increase your Ranking
                  <br />
                  in LLM Searches
                </motion.h1>
                <motion.p
                  className="text-lg sm:text-xl font-medium text-gray-400 max-w-xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Rise to the top in AI-powered search.
                </motion.p>
                <motion.div
                  className="flex flex-row justify-center items-center gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <button
                    onClick={() => navigate('/analysis')}
                    className="bg-white text-black font-semibold rounded-lg px-3 py-1.5 sm:px-6 sm:py-3 text-xs sm:text-base transition-transform hover:scale-105 shadow-lg"
                  >
                    Start with AI
                  </button>
                  <button
                    onClick={() => smoothScrollTo('pricing')}
                    className="bg-transparent text-white font-semibold rounded-lg px-3 py-1.5 sm:px-6 sm:py-3 text-xs sm:text-base transition-transform hover:scale-105 border border-white/30 hover:bg-white/10"
                  >
                    Start for free
                  </button>
                </motion.div>
              </div>
              
              {/* Mobile: Tabbed Interface */}
              <div className="mt-8">
                {/* Tab Navigation */}
                <div className="flex border-b border-white/20 mb-6">
                  <button 
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      mobileActiveTab === 'video' 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setMobileActiveTab('video')}
                  >
                    Demo Video
                  </button>
                  <button 
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      mobileActiveTab === 'animation' 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setMobileActiveTab('animation')}
                  >
                    Animation
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="relative">
                  {mobileActiveTab === 'animation' && (
                    <motion.div
                      key="animation"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center"
                    >
                      {animationData && <Lottie animationData={animationData} loop={true} />}
                    </motion.div>
                  )}
                  
                  {mobileActiveTab === 'video' && (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-purple-500/20">
                        <video
                          className="w-full h-full object-cover"
                          src="/16296848-uhd_3840_2160_24fps.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout - Original unchanged */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center pt-24 pb-8">
              {/* Left: Text Content */}
              <div className="text-left">
                <motion.h1
                  className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Increase your Ranking
                  <br />
                  in LLM Searches
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl font-medium text-gray-400 max-w-xl mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Rise to the top in AI-powered search.
                </motion.p>
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <button
                    onClick={() => navigate('/analysis')}
                    className="bg-white text-black font-semibold rounded-lg px-6 py-3 transition-transform hover:scale-105 shadow-lg"
                  >
                    Start with AI
                  </button>
                  <button
                    onClick={() => smoothScrollTo('pricing')}
                    className="bg-transparent text-white font-semibold rounded-lg px-6 py-3 transition-transform hover:scale-105 border border-white/30 hover:bg-white/10"
                  >
                    Start for free
                  </button>
                </motion.div>
              </div>

              {/* Right: Lottie Animation */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {animationData && <Lottie animationData={animationData} loop={true} />}
              </motion.div>
            </div>
            
            {/* Desktop: Video below heading and animation */}
            <motion.div
              className="hidden lg:block relative mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/20">
                <video
                  className="w-full h-full object-cover"
                  src="/16296848-uhd_3840_2160_24fps.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* end main content wrapper */}
    </div>
  )
}

// Stacked Screenshot Card Component (Desktop)
function StackedScreenshotCard({
  icon,
  title,
  description,
  imageSrc,
  index,
}: {
  icon: React.ReactNode
  title: string
  description: string
  imageSrc: string
  index: number
}) {
  return (
    /* 1 — STICKY CONTAINER (no transform anywhere above it) */
    <div
      className="sticky top-24 mx-auto w-[90%] lg:w-3/4"
      style={{ zIndex: index + 1 }}
    >
      {/* 2 — animated layer lives *inside* the sticky box */}
      <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, delay: index * 0.2, type: 'spring' }}
      whileHover={{
        scale: 1.02,
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      }}
    >
      {/* Glassmorphic Card Container */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden">
        {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-green-400/10 via-purple-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-60" />

        {/* Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-400/20 to-purple-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-green-400">
                {icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-purple-500 rounded-full" />
              </div>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">{description}</p>
          </div>

          {/* Screenshot */}
          <div className="relative">
              <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-purple-500/20">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt={`${title} feature screenshot`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Floating elements for depth */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-purple-500 rounded-full opacity-60 blur-sm" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-40 blur-sm" />
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  )
}

// Mobile Screenshot Card Component (No Overlap)
function MobileScreenshotCard({
  icon,
  title,
  description,
  imageSrc,
  index,
}: {
  icon: React.ReactNode
  title: string
  description: string
  imageSrc: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
    >
      {/* Light Theme Card Container */}
      <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg overflow-hidden">
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-green-500">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">{title}</h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-purple-500 rounded-full mt-1" />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{description}</p>

          {/* Screenshot */}
          <div className="aspect-video relative rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-purple-500/20 bg-gray-100 shadow-inner">
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={`${title} feature screenshot`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Features Grid Component
function FeaturesGrid() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Engine Tracking",
      description: "Monitor your brand across ChatGPT, Claude, Perplexity, and more",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Keyword Intelligence",
      description: "Track thousands of keywords and their AI search performance",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Get instant insights into your AI visibility metrics",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Competitor Analysis",
      description: "See how you stack up against competitors in AI responses",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Get notified when your visibility changes significantly",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Coverage",
      description: "Track your brand visibility across different regions",
    },
  ]

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
            <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-white`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Content Analyzer Section
function ContentAnalyzerSection() {
  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
        }}
      >
        Content Analyzer
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.2)" }}
      >
        Optimize your content for AI search engines with our advanced analysis tools
      </motion.p>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">AI-Optimized Content</h3>
              </div>
              <p className="text-gray-300">
                Analyze your content to see how well it performs in AI search results. Get recommendations for
                improvement.
              </p>
              <ul className="space-y-2">
                {[
                  "Content structure analysis",
                  "AI citation potential scoring",
                  "Keyword density optimization",
                  "Readability improvements",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <motion.button
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold w-full sm:w-auto mt-2 sm:mt-0"
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
                  <div
                    className="bg-gradient-to-r from-green-400 to-purple-400 h-2 rounded-full"
                    style={{ width: "87%" }}
                  ></div>
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
  )
}

// Keyword Research Section
function KeywordResearchSection() {
  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
        }}
      >
        Keyword Research
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.2)" }}
      >
        Discover high-impact keywords that perform well in AI search engines
      </motion.p>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">AI Keyword Discovery</h3>
                </div>
                <p className="text-gray-300">
                  Find keywords that AI engines love. Our research tool analyzes millions of AI responses to identify
                  trending topics.
                </p>

                {/* Mock keyword suggestions */}
                <div className="space-y-3">
                  {[
                    { keyword: "best project management software", difficulty: "Medium", volume: "12K", aiScore: 92 },
                    { keyword: "AI writing tools comparison", difficulty: "High", volume: "8.5K", aiScore: 88 },
                    { keyword: "cloud hosting providers", difficulty: "Low", volume: "15K", aiScore: 85 },
                  ].map((item, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{item.keyword}</div>
                        <div className="text-white/60 text-sm">
                          Volume: {item.volume} • Difficulty: {item.difficulty}
                            </div>
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
                    "Citation opportunity scoring",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                        </div>

              <motion.button
                className="w-full bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
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
  )
}

// API Docs Section
function ApiDocsSection() {
  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
        }}
      >
        API Documentation
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.2)" }}
      >
        Integrate AI visibility data into your applications with our powerful API
      </motion.p>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
                  { title: "Response Time", value: "<100ms" },
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
                <span className="text-purple-400">GET</span> /api/v1/keywords/visibility
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
  )
}

// Blog Section
function BlogSection() {
  const blogPosts = [
    {
      title: "The Future of AI Search: What Marketers Need to Know",
      excerpt:
        "Explore how AI search engines are changing the digital marketing landscape and what you can do to stay ahead.",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Strategy",
    },
    {
      title: "Optimizing Content for AI Citations: A Complete Guide",
      excerpt: "Learn the best practices for creating content that AI engines love to cite and reference.",
      date: "Dec 12, 2024",
      readTime: "8 min read",
      category: "Tutorial",
    },
    {
      title: "Case Study: How TechCorp Increased AI Visibility by 300%",
      excerpt: "A deep dive into the strategies that helped TechCorp dominate AI search results in their industry.",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Case Study",
    },
  ]

  return (
    <div className="text-center">
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
        }}
      >
        Latest Insights
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.2)" }}
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
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">{post.category}</span>
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
          className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Posts
        </motion.button>
      </div>
    </div>
  )
}

// Testimonial Carousel Component
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useLayoutEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const cardWidth = 320 // Width of each testimonial card
  const gap = 24 // Gap between cards
  const totalWidth = testimonials.length * (cardWidth + gap)
  const duration = totalWidth / 30 // Adjust speed as needed

  return (
    <div className="relative">
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
  )
}

// Individual Testimonial Card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      className="flex-shrink-0 w-80 p-6 rounded-2xl border border-white/10 bg-white/5 shadow-lg"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Rating Stars */}
      <div className="flex mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-300 mb-6 leading-relaxed text-sm">"{testimonial.content}"</p>

      {/* Author */}
      <div className="flex items-center">
        <img
          src={testimonial.avatar || "/placeholder.svg"}
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
  )
}

// Pricing Cards Component
function PricingCards({ plans }: { plans: PricingPlan[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length)
  }

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
          aria-label="Next pricing plan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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
                currentIndex === index ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to pricing plan ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Individual Pricing Card Component
function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      className={`relative p-8 pt-12 md:pt-8 rounded-2xl border ${
        plan.popular ? "border-green-400 bg-green-900/20" : "border-white/10 bg-white/5"
      } shadow-lg`}
      whileHover={{
        scale: 1.02,
        y: -8,
        boxShadow: plan.popular ? "0 20px 40px rgba(124, 252, 0, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
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
        <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
        <div className="mb-2">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-400">/{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
          plan.popular
            ? "bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-300 hover:to-green-400"
            : "border-2 border-white/30 text-white hover:bg-white/10"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {plan.buttonText}
        {plan.popular && <ArrowRight className="w-4 h-4 inline-block ml-2" />}
      </motion.button>
    </motion.div>
  )
}

// Enhanced CSS animations
const style = document.createElement("style")
style.innerHTML = `
@keyframes conveyor-seamless {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes testimonial-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scroll-screenshots {
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

.animate-scroll-screenshots {
  animation: scroll-screenshots 60s linear infinite;
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
`

if (!document.head.querySelector("style[data-premium-animations]")) {
  style.setAttribute("data-premium-animations", "true")
  document.head.appendChild(style)
}

// Screenshot Card Component
function ScreenshotCard({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  return (
    <motion.div
      className="flex-shrink-0 w-full max-w-6xl group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 p-8 shadow-2xl">
        {/* Screenshot Image Container - matching demo video structure */}
        <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-900 border border-white/20">
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Footer below screenshot: keep small and blank like demo video */}
        <div className="mt-8" />

        {/* Hover effect glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}

// Horizontal Screenshots Component with Pinned Scrolling
function HorizontalScreenshots({ cards }: { cards: React.ReactNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(cards.length - 1) * 100}%`]
  );

  return (
    <div ref={containerRef} className="relative">
      <section className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 flex flex-col h-[300vh]">
          {cards.map((card, i) => (
            <div key={i} className="flex-shrink-0 w-full h-screen">
              {card}
            </div>
          ))}
        </motion.div>
        </section>
    </div>
  );
}

// Horizontal Screenshot Card Component (for carousel)
function HorizontalScreenshotCard({
  icon,
  title,
  description,
  imageSrc,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <div className="w-full h-screen">
      {/* Light Theme Card Container */}
      <div className="relative bg-white rounded-3xl border border-gray-200 p-8 shadow-lg overflow-hidden h-full">
        {/* Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-12 items-center h-full">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-green-500">
                {icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-black mb-2">{title}</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-purple-500 rounded-full" />
              </div>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
              {description}
            </p>
          </div>

          {/* Screenshot */}
          <div className="relative h-full">
            <div className="relative h-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt={`${title} feature screenshot`}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({
  icon,
  title,
  description,
  imageSrc,
  index,
  isVideo = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
  index: number;
  isVideo?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
    >
      <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg overflow-hidden h-full flex flex-col">
        <div className="relative z-10 space-y-6 flex-grow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-green-500">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">{title}</h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-purple-500 rounded-full mt-1" />
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
        <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 shadow-inner mt-6">
          {isVideo ? (
            <video
              src={imageSrc}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
            />
          ) : (
            <img
              src={imageSrc}
              alt={`${title} feature screenshot`}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

const featureCardsData = [
  {
    key: "discover",
    icon: <Eye className="w-8 h-8" />,
    title: "Discover",
    description: "Automatically discover and fetch your digital assets from websites, social media, and other online sources.",
    imageSrc: "/screenshots/Assetfetching.mp4",
    isVideo: true,
  },
  {
    key: "track",
    icon: <Activity className="w-8 h-8" />,
    title: "Track",
    description: "Monitor your discovered assets in real-time with comprehensive tracking and status monitoring.",
    imageSrc: "/screenshots/fetched.png",
    isVideo: false,
  },
  {
    key: "integrate",
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Integrate",
    description: "Seamlessly integrate with your existing workflow tools like Jira for project management and collaboration.",
    imageSrc: "/screenshots/jira.png",
    isVideo: false,
  },
  {
    key: "optimize",
    icon: <Zap className="w-8 h-8" />,
    title: "Optimize",
    description: "Get intelligent optimization suggestions to improve your content's AI search visibility and performance.",
    imageSrc: "/screenshots/optimization.png",
    isVideo: false,
  },
  {
    key: "analyze",
    icon: <Target className="w-8 h-8" />,
    title: "Analyze",
    description: "View comprehensive analytics and scoring dashboards to track your AI visibility performance over time.",
    imageSrc: "/screenshots/score.png",
    isVideo: false,
  },
];

