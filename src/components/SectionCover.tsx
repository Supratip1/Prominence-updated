import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Pins its children full-screen, then slides `coverContent` up on scroll.
 */
export function SectionCover({
  children,
  coverContent,
}: {
  children: React.ReactNode
  coverContent: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  // scrollYProgress goes 0 → 1 as you scroll past this container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  // y: from 100% → 0%
  const y = useTransform(scrollYProgress, [0, 1], ["100%", "0%"])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <div className="sticky top-0 h-screen">
        {children}
      </div>
      <motion.div className="absolute inset-0" style={{ y }}>
        {coverContent}
      </motion.div>
    </div>
  )
} 