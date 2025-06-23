"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function FeatureCard({
  icon,
  title,
  description,
  imageSrc,
  index,
  isVideo = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  imageSrc: string
  index: number
  isVideo?: boolean
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
      <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg overflow-hidden h-full flex flex-col">
        <div className="relative z-10 space-y-6 flex-grow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-green-500">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-normal text-black">{title}</h3>
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
  )
} 