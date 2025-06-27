import React, { useState, useRef } from "react"
import { TrendingUp, Lightbulb, Calendar, Users, BarChart3, Search, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"

const benefits = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Boost LLM & AI Search Rankings",
    description: "Track and improve your brand's ranking in AI-powered search engines.",
    potential: "Early mover advantage",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700"
  },
  {
    id: 2,
    icon: Lightbulb,
    title: "AI-Optimized Content",
    description: "Get AI-driven recommendations to optimize your content.",
    potential: "Future-proof strategy",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700"
  },
  {
    id: 3,
    icon: Calendar,
    title: "Continuous Brand Monitoring",
    description: "Monitor AI responses and get alerts for new mentions.",
    potential: "Real-time insights",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700"
  },
  {
    id: 4,
    icon: Users,
    title: "Competitor Intelligence",
    description: "Benchmark your performance against competitors.",
    potential: "Strategic advantage",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700"
  },
  {
    id: 5,
    icon: BarChart3,
    title: "Actionable Analytics",
    description: "Get clear insights and ROI tracking.",
    potential: "Data-driven decisions",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    badgeBg: "bg-teal-100",
    badgeText: "text-teal-700"
  },
  {
    id: 6,
    icon: Search,
    title: "Automated Asset Discovery",
    description: "Automatically discover your brand's digital footprint.",
    potential: "Complete visibility",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-700"
  }
];

const BenefitsSection = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Carousel scroll handler
  const scrollToIndex = (idx: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstChild instanceof HTMLElement ? carouselRef.current.firstChild.offsetWidth + 16 : 260;
      carouselRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      setCarouselIndex(idx);
    }
  };

  const handleLeft = () => {
    if (carouselIndex > 0) scrollToIndex(carouselIndex - 1);
  };
  const handleRight = () => {
    if (carouselIndex < benefits.length - 1) scrollToIndex(carouselIndex + 1);
  };

  return (
    <section id="key-benefits" className="relative py-10 sm:py-24 bg-[#181A20] text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-4 sm:mb-6">
            The Future of AI Search
            <span className="block text-xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-300 mt-2">
              Optimization is Here
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8">
            Be among the first to optimize your brand for the AI-powered search revolution.
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="block sm:hidden relative">
          <div className="flex items-center">
            {/* Left Arrow */}
            <button
              className={`z-20 mr-2 p-2 rounded-full shadow bg-white/10 border border-gray-700 transition hover:bg-gray-800 ${carouselIndex === 0 ? 'opacity-30 cursor-default' : 'hover:scale-110'}`}
              onClick={handleLeft}
              disabled={carouselIndex === 0}
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5 text-gray-200" />
            </button>
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 snap-x snap-mandatory">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`relative min-w-[85vw] max-w-xs snap-center group cursor-pointer transition-all duration-300 hover:scale-105 ${hoveredBenefit === index ? 'z-10' : ''}`}
                  onMouseEnter={() => setHoveredBenefit(index)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                >
                  <div className={`bg-[#23242a] p-3 rounded-xl border border-gray-700 text-white h-full transition-all duration-300 hover:shadow-xl flex flex-col items-center relative`}>
                    <h3 className="text-base font-semibold text-white text-center mb-2">{benefit.title}</h3>
                    <p className="text-gray-300 text-xs mb-2 leading-relaxed text-center">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Right Arrow */}
            <button
              className={`z-20 ml-2 p-2 rounded-full shadow bg-white/10 border border-gray-700 transition hover:bg-gray-800 ${carouselIndex === benefits.length - 1 ? 'opacity-30 cursor-default' : 'hover:scale-110'}`}
              onClick={handleRight}
              disabled={carouselIndex === benefits.length - 1}
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5 text-gray-200" />
            </button>
          </div>
        </div>

        {/* Zig-Zag Layout for sm+ screens */}
        <div className="hidden sm:flex flex-col gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              onMouseEnter={() => setHoveredBenefit(index)}
              onMouseLeave={() => setHoveredBenefit(null)}
            >
              {/* Icon and Text */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-base max-w-md">{benefit.description}</p>
              </div>
              {/* Zig-Zag Placeholder (for future image or illustration) */}
              <div className="flex-1 w-full flex items-center justify-center">
                <div className="w-full max-w-md aspect-video bg-[#23242a] rounded-2xl border border-gray-700 flex items-center justify-center text-gray-400 text-lg font-medium relative">
                  <span className="absolute">Screenshot coming soon</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection 