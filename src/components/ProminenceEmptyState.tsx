import React from 'react';

const ProminenceEmptyState = ({ message = "No data found!" }) => (
  <div className="flex flex-col items-center justify-center py-16">
    {/* Replace with Lottie animation if available */}
    <img src="/lottie/Animation1.json" alt="Empty state animation" className="w-40 h-40 mb-6" />
    <div className="text-lg font-display text-white mb-2">{message}</div>
    <div className="text-sm text-gray-400 font-sans">Try adjusting your filters or check back later.</div>
  </div>
);

export default ProminenceEmptyState; 