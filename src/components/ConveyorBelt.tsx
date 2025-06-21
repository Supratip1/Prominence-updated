import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Logo {
  src: string;
  alt: string;
}

interface ConveyorBeltProps {
  logos: Logo[];
}

const ConveyorBelt: React.FC<ConveyorBeltProps> = ({ logos }) => {
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      if (setRef.current) {
        setSetWidth(setRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [logos]);

  // Animation duration based on width for smoothness
  const duration = Math.max(setWidth / 80, 10); // Adjust speed as needed

  return (
    <div style={{ width: '100%', overflow: 'hidden', height: '100%' }} className="relative">
      <div
        style={{
          display: 'flex',
          width: setWidth ? setWidth * 2 : 'auto',
          animation: setWidth
            ? `conveyor-seamless ${duration}s linear infinite` : undefined,
        }}
        className="h-16"
      >
        <div ref={setRef} style={{ display: 'flex' }}>
          {logos.map(({ src, alt }, i) => (
            <img
              key={alt + i}
              src={src}
              alt={alt}
              className="h-16 md:h-24 mx-6 md:mx-12 object-contain min-w-[100px] md:min-w-[150px] opacity-95 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          {logos.map(({ src, alt }, i) => (
            <img
              key={alt + '-dup-' + i}
              src={src}
              alt={alt}
              className="h-16 md:h-24 mx-6 md:mx-12 object-contain min-w-[100px] md:min-w-[150px] opacity-95 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes conveyor-seamless {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${setWidth}px); }
        }
      `}</style>
    </div>
  );
};

export default ConveyorBelt; 