import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Link as LinkIcon,
  Search,
  Eye,
  Activity
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  mockKPIData,
  mockActionItems,
  mockKeywords,
  mockPricingPlans
} from '../data/mockData';
import Lottie from 'lottie-react';

// Animation variants
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } }
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

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const kpis = mockKPIData;
  const actionItems = mockActionItems;
  const keywords    = mockKeywords;
  const [animationData, setAnimationData] = React.useState<any>(null);

  useEffect(() => {
    const randomLottieUrl = lottieAnimations[Math.floor(Math.random() * lottieAnimations.length)];
    fetch(randomLottieUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setAnimationData)
      .catch(error => {
        console.error('Failed to load Lottie animation:', error);
        // Optionally set a fallback or leave animationData as null
        setAnimationData(null);
      });
  }, []);

  const KPICard = ({
    title,
    value,
    change,
    icon: Icon,
    suffix = ''
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    suffix?: string;
  }) => (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-2">
            {value}{suffix}
          </p>
          {change !== undefined && (
            <div className="flex items-center">
              {change > 0 ? (
                <TrendingUp className="h-3 w-3 text-success mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-error mr-1" />
              )}
              <span
                className={`text-xs font-medium ${
                  change > 0 ? 'text-success' : 'text-error'
                }`}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'Link':     return LinkIcon;
      case 'Search':   return Search;
      default:         return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-12 bg-white">
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
            <div className="w-full max-w-md overflow-hidden rounded-md">
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

          {/* Horizontal Divider for mobile/tablet */}
          <div className="order-2 lg:hidden w-full">
            <div className="h-px bg-black w-56 mx-auto my-2" />
          </div>

          {/* Headline/Text */}
          <motion.div
            className="order-3 lg:order-1 flex flex-col w-full text-center lg:text-left max-w-5xl mx-auto lg:mx-0 lg:ml-16"
            variants={item}
          >
            <motion.h1
              className="
                text-4xl sm:text-5xl md:text-6xl lg:text-5xl
                font-semibold text-gray-900 mb-2
                leading-tight
                tracking-[-2px]
              "
              variants={item}
            >
              Increase your Ranking<br/>
              in LLM Searches
            </motion.h1>
            <motion.p
              className="
                text-lg sm:text-xl lg:text-3xl
                text-gray-800 mb-4 leading-snug
                max-w-2xl mx-auto lg:mx-0 text-center lg:text-left
              "
              variants={item}
            >
              Rise to the top in AI-powered search.
            </motion.p>
            <motion.div
              className="flex flex-row items-center justify-center lg:justify-start gap-x-4"
              variants={item}
            >
              <motion.button
                className="h-12 px-6 rounded-lg bg-[#2463EB] text-white text-base font-medium shadow-sm hover:bg-[#1A4ED8]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Get GEO free
              </motion.button>
              <motion.button
                className="h-12 px-6 rounded-lg border border-[#D0DAE5] bg-[#F1F6FC] text-[#2F80ED] text-base font-medium hover:bg-[#E5F0F9]"
                whileHover={{ scale: 1.05, backgroundColor: "#E5F0F9" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Request a demo
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Trust Indicators - now below hero section */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row items-center md:justify-start gap-4 md:gap-8 py-4 opacity-90 md:h-24">
            <p className="text-base md:text-2xl font-semibold text-gray-900 whitespace-nowrap mb-2 md:mb-0 md:mr-8 flex-shrink-0 leading-none self-center">Trusted by top teams</p>
            <div className="relative w-full overflow-hidden h-14 md:h-24 flex items-center">
              <ConveyorBelt logos={logos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ConveyorBelt component for seamless infinite scroll
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

  // Animation duration: 60px/sec, min 8s for very small screens
  const duration = Math.max(setWidth / 60, 8);

  return (
    <div style={{ width: '100%', overflow: 'hidden', height: '100%' }}>
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
            <img
              key={alt + i}
              src={src}
              alt={alt}
              className="h-14 md:h-24 mx-6 md:mx-12 object-contain min-w-[80px] md:min-w-[120px]"
              loading="lazy"
            />
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div style={{ display: 'flex' }}>
          {logos.map(({ src, alt }, i) => (
            <img
              key={alt + '-dup-' + i}
              src={src}
              alt={alt}
              className="h-14 md:h-24 mx-6 md:mx-12 object-contain min-w-[80px] md:min-w-[120px]"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Add this to the bottom of the file or in your global CSS
const style = document.createElement('style');
style.innerHTML = `
@keyframes conveyor-seamless {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;
if (!document.head.querySelector('style[data-conveyor-seamless]')) {
  style.setAttribute('data-conveyor-seamless', 'true');
  document.head.appendChild(style);
}