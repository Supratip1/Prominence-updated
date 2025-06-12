import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Search,
  Eye,
  Activity,
  Check,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Lottie from 'lottie-react';

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

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [animationData, setAnimationData] = React.useState<any>(null);

  useEffect(() => {
    const randomLottieUrl = lottieAnimations[Math.floor(Math.random() * lottieAnimations.length)];
    fetch(randomLottieUrl)
      .then(res => res.json())
      .then(setAnimationData);
  }, []);

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

      <div id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-12 relative z-10">
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
              
              <motion.div
                className="flex flex-row items-center justify-center lg:justify-start gap-x-4"
                variants={textReveal}
              >
                <motion.button
                  className="
                    relative overflow-hidden
                    h-14 px-8 rounded-xl 
                    bg-gradient-to-r from-[#adff2f] to-[#7cfc00]
                    text-black text-base font-bold 
                    shadow-lg shadow-green-500/30
                    border border-green-400/30
                    group
                  "
                  whileHover={buttonHover}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    boxShadow: '0 0 20px rgba(173, 255, 47, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Get GEO free
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.div>
                  </span>
                </motion.button>
                
                <motion.button
                  className="
                    relative
                    h-14 px-8 rounded-xl 
                    border-2 border-white/20 
                    bg-white/5 backdrop-blur-sm
                    text-white text-base font-semibold 
                    shadow-lg shadow-white/10
                    group
                  "
                  whileHover={buttonSecondaryHover}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                    initial={false}
                  />
                  <span className="relative z-10">Request a demo</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Trust Indicators with Space Theme */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-center md:justify-start gap-4 md:gap-8 py-6 opacity-95 md:h-24">
            <motion.p 
              className="
                text-base md:text-2xl font-bold
                text-white/80
                whitespace-nowrap mb-2 md:mb-0 md:mr-8 flex-shrink-0 
                leading-none self-center
                tracking-[-0.02em]
              "
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}
            >
              Trusted by top teams
            </motion.p>
            
            <div className="relative w-full overflow-hidden h-14 md:h-24 flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
              <ConveyorBelt logos={logos} />
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.section
          id="testimonials"
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center mb-12">
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
              Loved by thousands of teams
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}
            >
              See what our customers are saying about their AI visibility transformation
            </motion.p>
          </div>
          
          <TestimonialCarousel testimonials={testimonials} />
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          id="pricing"
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="text-center mb-12">
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
              Simple, transparent pricing
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}
            >
              Choose the perfect plan for your AI visibility needs. Start free, upgrade when you're ready.
            </motion.p>
          </div>
          
          <PricingCards plans={pricingPlans} />
        </motion.section>
      </div>
    </div>
  );
}

// Enhanced ConveyorBelt component
function ConveyorBelt({ logos }: { logos: { src: string; alt: string }[] }) {
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = React.useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (setRef.current) {
        setSetWidth(setRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [logos]);

  const duration = Math.max(setWidth / 50, 10); // Slightly slower for premium feel

  return (
    <div style={{ width: '100%', overflow: 'hidden', height: '100%' }} className="relative">
      <div
        style={{
          display: 'flex',
          width: setWidth ? setWidth * 2 : 'auto',
          animation: setWidth
            ? `conveyor-seamless ${duration}s linear infinite` : undefined,
        }}
        className="h-16"
      >
        <div ref={setRef} style={{ display: 'flex' }}>
          {logos.map(({ src, alt }, i) => (
            <motion.img
              key={alt + i}
              src={src}
              alt={alt}
              className="h-12 md:h-20 mx-6 md:mx-12 object-contain min-w-[80px] md:min-w-[120px] opacity-80 hover:opacity-100 transition-opacity duration-300 bg-black rounded-[30px] p-2"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          {logos.map(({ src, alt }, i) => (
            <motion.img
              key={alt + '-dup-' + i}
              src={src}
              alt={alt}
              className="h-12 md:h-20 mx-6 md:mx-12 object-contain min-w-[80px] md:min-w-[120px] opacity-80 hover:opacity-100 transition-opacity duration-300 bg-black rounded-[30px] p-2"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          ))}
        </div>
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
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
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
}

// Enhanced CSS animations
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
`;

if (!document.head.querySelector('style[data-premium-animations]')) {
  style.setAttribute('data-premium-animations', 'true');
  document.head.appendChild(style);
}