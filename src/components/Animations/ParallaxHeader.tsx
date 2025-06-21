import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useRef } from 'react'

export function ParallaxHeader({ title }: { title: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  return (
    <section ref={ref} className="relative h-[60vh] flex items-center justify-center">
      <motion.h1
        style={{ opacity, scale }}
        className="text-6xl font-extrabold text-white"
      >
        {title}
      </motion.h1>
    </section>
  )
} 