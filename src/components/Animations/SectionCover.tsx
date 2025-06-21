import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function SectionCover({
  children,
  coverContent,
}: {
  children: React.ReactNode
  coverContent: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["100%", "0%"])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      {/* Base content stays stuck */}
      <div className="sticky top-0 h-screen">
        {children}
      </div>

      {/* Covering layer */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        {coverContent}
      </motion.div>
    </div>
  )
} 