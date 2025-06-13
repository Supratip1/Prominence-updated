import React, { useState } from 'react';
import { Send, Rocket, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  type: string;
  title: string;
  url: string;
  sourceDomain: string;
}

interface SendToOptimizationButtonProps {
  assets: Asset[];
}

export default function SendToOptimizationButton({ assets }: SendToOptimizationButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (assets.length === 0 || isSending) return;

    setIsSending(true);
    
    // Simulate sending to optimization platform
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setSent(true);
    
    // Reset after 3 seconds
    setTimeout(() => setSent(false), 3000);
  };

  const getButtonContent = () => {
    if (sent) {
      return (
        <>
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Sent Successfully</span>
          <span className="sm:hidden">Sent</span>
        </>
      );
    }
    
    if (isSending) {
      return (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
          <span className="hidden sm:inline">Sending...</span>
          <span className="sm:hidden">Sending</span>
        </>
      );
    }
    
    return (
      <>
        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Send to Optimization</span>
        <span className="sm:hidden">Optimize</span>
        {assets.length > 0 && (
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-bold">
            {assets.length}
          </span>
        )}
      </>
    );
  };

  const getButtonStyles = () => {
    if (sent) {
      return "bg-green-500/20 border-green-400/50 text-green-400 hover:bg-green-500/30";
    }
    
    if (isSending) {
      return "bg-blue-500/20 border-blue-400/50 text-blue-400";
    }
    
    return "bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black border-green-400/30 hover:shadow-lg hover:shadow-green-500/30";
  };

  return (
    <motion.button
      onClick={handleSend}
      disabled={assets.length === 0 || isSending}
      className={`flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base font-medium ${getButtonStyles()}`}
      whileHover={{ scale: (assets.length > 0 && !isSending) ? 1.05 : 1 }}
      whileTap={{ scale: (assets.length > 0 && !isSending) ? 0.95 : 1 }}
    >
      {getButtonContent()}
    </motion.button>
  );
} 