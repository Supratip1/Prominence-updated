import { motion } from 'framer-motion';
import React from "react";

const steps = [
  {
    title: "Visualize Your AI Performance",
    description: "Interactive graphs let you track your brand's AI search visibility trends, compare performance over time, and spot growth opportunities at a glance.",
    image: "/screenshots/Graphs.PNG",
  },
  {
    title: "Understand Your AI Visibility Score",
    description: "Get a clear, actionable score that summarizes your brand's presence in AI-powered search engines, with detailed breakdowns for each key metric.",
    image: "/screenshots/Scores.PNG",
  },
  {
    title: "Act on Personalized Recommendations",
    description: "Receive tailored, step-by-step recommendations to boost your AI search ranking and see exactly what to improve for maximum impact.",
    image: "/screenshots/Recommendations.PNG",
  },
  {
    title: 'Competitor Issues',
    description: 'See a detailed breakdown of competitor strengths and weaknesses, including technical, content, and structured data issues for every site.',
    image: '/screenshots/competitorissue.png',
  },
  {
    title: 'AEO Score Comparison',
    description: "Visually compare your site's AEO score with all competitors in a single glance to instantly identify leaders and laggards.",
    image: '/screenshots/comparison.png',
  },
];

export default function HowItWorksSection() {
  return (
    <motion.section
      id="our-services"
      className="pt-0 pb-20 bg-white text-black w-full -mt-48 md:mt-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="relative max-w-screen-xl mx-auto px-4 flex flex-col items-center" style={{paddingTop: 0, marginTop: 0}}>
        {/* Vertical lines */}
        <div className="absolute left-0 -top-6 h-[calc(100%+1.5rem)] w-px bg-gray-200 opacity-60" style={{ zIndex: 1 }} />
        <div className="absolute right-0 -top-6 h-[calc(100%+1.5rem)] w-px bg-gray-200 opacity-60" style={{ zIndex: 1 }} />
        {/* Tagline and Heading */}
        <motion.div className="relative z-10 flex flex-col items-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="uppercase text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">The Prominence Workflow</span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-black text-center">
            Features of Prominence
          </h2>
        </motion.div>
        <div className="flex flex-col gap-24 w-full">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              {/* Left: Text */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-3 text-black font-display">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-base sm:text-lg max-w-md">
                  {step.description}
                </p>
              </div>
              {/* Right: Screenshot Card */}
              <motion.div
                className="flex-1 w-full flex items-center justify-center"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-full max-w-2xl aspect-[16/9] bg-gray-100 rounded-3xl border-2 border-gray-200 shadow-lg overflow-hidden relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-contain object-center"
                  />
                  {/* Fading effect at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f8fa] via-[#f7f8fa]/70 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 