import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Search,
  Eye,
  Activity
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

// Utility to randomly select one of the three animation URLs in public/lottie
const lottieAnimations = [
  '/lottie/Animation1.json',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-2 sm:gap-3 lg:gap-1 mb-2 sm:mb-3 lg:mb-4"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Animation */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end w-full mb-4 lg:mb-0"
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
          className="mb-4"
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

// Enhanced CSS animations
const style = document.createElement('style');
style.innerHTML = `
@keyframes conveyor-seamless {
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