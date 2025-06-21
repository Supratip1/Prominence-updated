import React from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

export function FlipCard({ children }: { children: React.ReactNode }) {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  React.useEffect(() => {
    if (inView) {
      controls.start({ rotateY: 0, opacity: 1, transition: { duration: 0.8 } })
    }
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={controls}
      className="w-64 h-40 bg-white/10 border border-white/20 rounded-2xl p-6"
      style={{ perspective: 600 }}
    >
      {children}
    </motion.div>
  )
} 