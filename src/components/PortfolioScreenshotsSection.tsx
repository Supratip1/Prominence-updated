"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Eye, Activity, BarChart3, Zap, Target, GitBranch, Users, Lightbulb } from "lucide-react"

// Feature cards data
const featureCardsData = [
  {
    key: "discover",
    icon: <Eye className="w-6 h-6" />,
    title: "Discover Assets",
    description:
      "Automatically discover and fetch your digital assets from websites, social media, and other online sources.",
    imageSrc: "/screenshots/Assetfetching.mp4",
    borderColor: "#7c3aed", // deep purple
    isVideo: true,
  },
  {
    key: "competitors",
    icon: <Users className="w-6 h-6" />,
    title: "Analyze Competitors",
    description: "See how you stack up against competitors in AI responses and identify content gaps.",
    imageSrc: "/screenshots/competitor.png",
    borderColor: "#b91c1c", // deep red
    isVideo: false,
  },
  {
    key: "integrate",
    icon: <GitBranch className="w-6 h-6" />,
    title: "Integrate Workflows",
    description:
      "Seamlessly integrate with your existing workflow tools like Jira, Notion, and GitHub for project management.",
    imageSrc: "/screenshots/integrations.png",
    borderColor: "#b45309", // deep amber
    isVideo: false,
  },
  {
    key: "optimize",
    icon: <Zap className="w-6 h-6" />,
    title: "Optimize Content",
    description:
      "Get intelligent optimization suggestions to improve your content's AI search visibility and performance.",
    imageSrc: "/screenshots/optimization.png",
    borderColor: "#4d7c0f", // deep lime (neon)
    isVideo: false,
  },
  {
    key: "recommendations",
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Get Recommendations",
    description: "Receive actionable recommendations and track their implementation as fixes.",
    imageSrc: "/screenshots/recommendation.png",
    borderColor: "#15803d", // deep green
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
        <div className="absolute inset-0 z-10 p-4 md:p-6 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
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

        {/* Dynamic Portfolio Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-[220px] lg:auto-rows-[350px]">
            <PortfolioCard
              className="col-span-2 row-span-2"
              icon={featureCardsData[0].icon}
              title={featureCardsData[0].title}
              description={featureCardsData[0].description}
              imageSrc={featureCardsData[0].imageSrc}
              borderColor={featureCardsData[0].borderColor}
              isVideo={featureCardsData[0].isVideo}
              index={0}
            />
            <PortfolioCard
              className="col-span-1 row-span-2 lg:col-span-1 lg:row-span-1"
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
            <PortfolioCard
              className="col-span-1 row-span-1 lg:col-span-1 lg:row-span-1"
              icon={featureCardsData[3].icon}
              title={featureCardsData[3].title}
              description={featureCardsData[3].description}
              imageSrc={featureCardsData[3].imageSrc}
              borderColor={featureCardsData[3].borderColor}
              isVideo={featureCardsData[3].isVideo}
              index={3}
            />
            <PortfolioCard
              className="col-span-1 row-span-1 lg:col-span-1 lg:row-span-1"
              icon={featureCardsData[4].icon}
              title={featureCardsData[4].title}
              description={featureCardsData[4].description}
              imageSrc={featureCardsData[4].imageSrc}
              borderColor={featureCardsData[4].borderColor}
              isVideo={featureCardsData[4].isVideo}
              index={4}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
} 