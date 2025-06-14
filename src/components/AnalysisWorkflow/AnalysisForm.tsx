import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateUrl } from '../../utils/validation';

interface AnalysisFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AnalysisForm({ value, onChange, onSubmit, disabled }: AnalysisFormProps) {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;

    const isValid = validateUrl(value);
    setIsValidUrl(isValid);

    if (!isValid) return;

    setIsValidating(true);
    
    // Simulate URL validation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsValidating(false);
    onSubmit();
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    if (!isValidUrl && newValue.trim()) {
      setIsValidUrl(validateUrl(newValue));
    }
  };

  const getValidationIcon = () => {
    if (!value.trim()) return null;
    if (isValidating) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
        />
      );
    }
    if (isValidUrl) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-400" />;
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
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter domain or URL (e.g., yourcompany.com)"
                    disabled={disabled || isValidating}
                    className={`w-full h-12 sm:h-16 pl-12 sm:pl-14 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border text-white placeholder-white/50 focus:outline-none focus:ring-2 text-lg transition-all ${
                      !isValidUrl && value.trim() 
                        ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' 
                        : 'border-white/30 focus:border-[#adff2f]/50 focus:ring-[#adff2f]/50'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon()}
                  </div>
                  {!isValidUrl && value.trim() && (
                    <motion.p 
                      className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Please enter a valid domain name
                    </motion.p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={disabled || isValidating || !value.trim() || !isValidUrl}
                  className="h-12 sm:h-16 px-6 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-lg transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      <span className="hidden sm:inline">Validating...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Analyze</span>
                      <span className="sm:hidden">Go</span>
                    </>
                  )}
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