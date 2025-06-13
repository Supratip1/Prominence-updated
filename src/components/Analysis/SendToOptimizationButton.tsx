import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  type: 'video' | 'screenshot' | 'webpage';
  title: string;
  url: string;
  sourceDomain: string;
  thumbnail?: string;
  description?: string;
  createdAt: Date;
}

interface SendToOptimizationButtonProps {
  assets: Asset[];
}

export default function SendToOptimizationButton({ assets }: SendToOptimizationButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendToOptimization = async () => {
    if (assets.length === 0) return;

    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setSent(true);
    
    // Reset after 3 seconds
    setTimeout(() => setSent(false), 3000);
  };

  if (sent) {
    return (
      <motion.button
        disabled
        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Check className="w-4 h-4 mr-2" />
        Sent to Optimization!
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={sendToOptimization}
      disabled={assets.length === 0 || isSending}
      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isSending ? (
        <>
          <motion.div 
            className="w-4 h-4 mr-2 border-2 border-black/30 border-t-black rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Sending...
        </>
      ) : (
        <>
          <ArrowRight className="w-4 h-4 mr-2" />
          Send to Optimization ({assets.length})
        </>
      )}
    </motion.button>
  );
} 