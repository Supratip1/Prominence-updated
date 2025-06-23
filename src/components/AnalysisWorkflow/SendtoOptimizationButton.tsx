import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface Asset {
  id: string
  type: string
  // ...other fields as needed
}

interface Props {
  assets: Asset[]
}

export default function SendToOptimizationButton({ assets }: Props) {
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)

  const sendToOptimization = async () => {
    if (assets.length === 0) return
    setIsSending(true)
    console.log('Navigating to /optimization with assets:', assets)
    navigate('/optimization', { state: { assets } })
    console.log('Navigation called')
  }

  return (
    <motion.button
      type="button"
      onClick={sendToOptimization}
      disabled={assets.length === 0 || isSending}
      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isSending ? (
        <>
          <motion.div
            className="w-4 h-4 mr-2 border-2 border-black/30 border-t-black rounded-full"
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