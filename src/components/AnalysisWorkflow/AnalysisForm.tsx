import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AnalysisForm({ value, onChange, onSubmit, disabled }: AnalysisFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  return (
    <motion.section 
      id="analysis" 
      className="py-12 sm:py-16 lg:py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#adff2f]" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#adff2f] to-[#7cfc00] bg-clip-text text-transparent">
                Complete Analysis
              </span>{' '}
              Workflow
            </h2>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#adff2f]" />
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover, score, validate, and optimize your digital assets with AI-powered insights
          </p>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#adff2f]/10 to-[#7cfc00]/10 rounded-2xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 w-full items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 sm:w-6 sm:h-6" />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter domain or URL (e.g., yourcompany.com)"
                    disabled={disabled}
                    className="w-full h-12 sm:h-16 pl-12 sm:pl-14 pr-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#adff2f]/50 focus:border-[#adff2f]/50 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={disabled}
                  className="h-12 sm:h-16 px-6 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-lg transition-all shadow-lg shadow-green-500/30 w-full sm:w-auto mt-2 sm:mt-0"
                >
                  Analyze
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { icon: '🔍', label: 'Asset Discovery', desc: 'Find all digital assets' },
                  { icon: '📊', label: 'AEO Scoring', desc: 'Rate AI optimization' },
                  { icon: '✅', label: 'Validation', desc: 'Verify accuracy' },
                  { icon: '🚀', label: 'Optimization', desc: 'AI suggestions' }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{step.icon}</div>
                    <div className="text-white font-semibold text-xs sm:text-sm mb-1">{step.label}</div>
                    <div className="text-gray-400 text-xs hidden sm:block">{step.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
} 