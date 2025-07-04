"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Eye, Activity, BarChart3, Zap, Target, GitBranch, Users, Lightbulb } from "lucide-react"

// Feature cards data with actual screenshots
const featureCardsData = [
  {
    key: "dashboard",
    icon: <BarChart3 className="w-6 h-6" />,
    title: "AI Visibility Dashboard",
    description:
      "Get a comprehensive overview of your brand's AI search presence with real-time metrics and performance indicators.",
    imageSrc: "/screenshots/Screensht1.PNG",
    borderColor: "#7c3aed", // deep purple
    isVideo: false,
  },
  {
    key: "analysis",
    icon: <Activity className="w-6 h-6" />,
    title: "Deep Content Analysis",
    description: "Advanced AI-powered analysis of your content quality, readability, and AI search optimization potential.",
    imageSrc: "/screenshots/Screensht2.PNG",
    borderColor: "#b91c1c", // deep red
    isVideo: false,
  },
  {
    key: "optimization",
    icon: <Target className="w-6 h-6" />,
    title: "Smart Optimization",
    description:
      "Receive intelligent recommendations to improve your content's visibility in AI-powered search engines and assistants.",
    imageSrc: "/screenshots/Screensht3.PNG",
    borderColor: "#4d7c0f", // deep lime (neon)
    isVideo: false,
  },
]

// Dynamic Portfolio Card Component
function PortfolioCard({
  icon,
  title,
  description,
  imageSrc,
  className,
  index,
  borderColor,
  isVideo = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  imageSrc: string
  className?: string
  index: number
  borderColor: string
  isVideo?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={`relative group cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      }}
    >
      {/* Card Container */}
      <div
        className="relative h-full bg-white rounded-3xl border-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ borderColor }}
      >
        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 p-4 md:p-6 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Top Section */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-white mb-1">{title}</h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-purple-500 rounded-full" />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-3">
            <p className="text-white/90 text-xs md:text-sm leading-relaxed line-clamp-3">{description}</p>
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Demo Available</span>
            </div>
          </div>
        </div>

        {/* Background Image/Video */}
        <div className="absolute inset-0">
          {isVideo ? (
            <video
              src={imageSrc}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 high-quality-video"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="auto"
              poster=""
            />
          ) : (
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={`${title} feature screenshot`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {/* Enhanced overlay with fading effect at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          {/* Additional fading effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Corner Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

// Main Portfolio Screenshots Section
export default function PortfolioScreenshotsSection() {
  return (
    <motion.section
      id="screenshots"
      className="py-16 md:py-24 relative overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-6">
            How Prominence Works
          </motion.h2>
          <motion.p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how our platform transforms your AI search visibility through powerful features
          </motion.p>
        </motion.div>

        {/* Dynamic Portfolio Grid - Made bigger */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-[400px] lg:auto-rows-[500px]">
            <PortfolioCard
              className="col-span-1 row-span-1 lg:col-span-1 lg:row-span-1"
              icon={featureCardsData[0].icon}
              title={featureCardsData[0].title}
              description={featureCardsData[0].description}
              imageSrc={featureCardsData[0].imageSrc}
              borderColor={featureCardsData[0].borderColor}
              isVideo={featureCardsData[0].isVideo}
              index={0}
            />
            <PortfolioCard
              className="col-span-1 row-span-1 lg:col-span-1 lg:row-span-1"
              icon={featureCardsData[1].icon}
              title={featureCardsData[1].title}
              description={featureCardsData[1].description}
              imageSrc={featureCardsData[1].imageSrc}
              borderColor={featureCardsData[1].borderColor}
              isVideo={featureCardsData[1].isVideo}
              index={1}
            />
            <PortfolioCard
              className="col-span-1 row-span-1 lg:col-span-1 lg:row-span-1"
              icon={featureCardsData[2].icon}
              title={featureCardsData[2].title}
              description={featureCardsData[2].description}
              imageSrc={featureCardsData[2].imageSrc}
              borderColor={featureCardsData[2].borderColor}
              isVideo={featureCardsData[2].isVideo}
              index={2}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
} 