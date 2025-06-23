import React from 'react';
import { motion } from 'framer-motion';

const ProminenceStickyMobileCTA = ({
  onClick = () => window.location.href = '/analysis',
}) => (
  <div className="fixed bottom-0 left-0 w-full z-40 block lg:hidden">
    <motion.button
      whileHover={{ scale: 1.06, boxShadow: '0 0 24px #a855f7' }}
      whileTap={{ scale: 0.97 }}
      className="w-full bg-purple-600 text-white font-display font-semibold rounded-2xl px-8 py-4 text-xl shadow-lg transition-transform duration-200 relative overflow-hidden"
      onClick={onClick}
    >
      Start with AI
    </motion.button>
  </div>
);

export default ProminenceStickyMobileCTA; 