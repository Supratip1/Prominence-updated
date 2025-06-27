"use client"

import React from "react"
import { Eye, Activity, BarChart3, Zap, Target } from "lucide-react"
import FeatureCard from "./FeatureCard"
import "./CardStackSection.css"

const placeholderImg = "/placeholder-screenshot.svg";

const featureCardsData = [
  {
    key: "discover",
    icon: <Eye className="w-8 h-8" />,
    title: "Discover",
    description:
      "Automatically discover and fetch your digital assets from websites, social media, and other online sources.",
    imageSrc: placeholderImg,
    isVideo: false,
  },
  {
    key: "track",
    icon: <Activity className="w-8 h-8" />,
    title: "Track",
    description:
      "Monitor your discovered assets in real-time with comprehensive tracking and status monitoring.",
    imageSrc: placeholderImg,
    isVideo: false,
  },
  {
    key: "integrate",
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Integrate",
    description:
      "Seamlessly integrate with your existing workflow tools like Jira for project management and collaboration.",
    imageSrc: placeholderImg,
    isVideo: false,
  },
  {
    key: "optimize",
    icon: <Zap className="w-8 h-8" />,
    title: "Optimize",
    description:
      "Get intelligent optimization suggestions to improve your content's AI search visibility and performance.",
    imageSrc: placeholderImg,
    isVideo: false,
  },
  {
    key: "analyze",
    icon: <Target className="w-8 h-8" />,
    title: "Analyze",
    description:
      "View comprehensive analytics and scoring dashboards to track your AI visibility performance over time.",
    imageSrc: placeholderImg,
    isVideo: false,
  },
]

export default function CardStackSection() {
  return (
    <section className="stack-container bg-black text-white py-32">
      <div className="stack-inner">
        {featureCardsData.map((card, i) => (
          <div key={card.key} className="stack-card">
            <FeatureCard
              icon={card.icon}
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              isVideo={card.isVideo}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  )
} 