import React from 'react';

const BoltWidget = () => {
  const handleClick = () => {
    window.open('https://bolt.new/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        className="rounded-full shadow-lg hover:scale-105 transition-transform focus:outline-none"
        onClick={handleClick}
        aria-label="Visit Bolt.new website"
      >
        <img src="/bolt-badge.png" alt="Bolt" className="w-12 h-12" />
      </button>
    </div>
  );
};

export default BoltWidget;
