// src/components/Analysis/SendToOptimizationButton.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import type { FrontendAsset } from '../../pages/Analysis';

interface Props {
  assets: FrontendAsset[]
}

export default function SendToOptimizationButton({ assets }: Props) {
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)

  const sendToOptimization = async () => {
    if (assets.length === 0) return

    setIsSending(true)

    // simulate your API call
    await new Promise(r => setTimeout(r, 2000))

    // now navigate, passing along the assets
    navigate('/optimization', { state: { assets } })
    setIsSending(false)
  }

  return (
    <motion.button
      onClick={sendToOptimization}
      disabled={assets.length === 0 || isSending}
      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isSending ? (
        <>
          <motion.div
            className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          Sending…
        </>
      ) : (
        <>
          <ArrowRight className="w-4 h-4 mr-2" />
          Send to Optimization ({assets.length})
        </>
      )}
    </motion.button>
  )
}
