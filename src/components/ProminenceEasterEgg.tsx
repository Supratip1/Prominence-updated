import React, { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

const ProminenceEasterEgg = () => {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setInput((prev: string[]) => {
        const next = [...prev, e.key].slice(-KONAMI_CODE.length);
        if (next.join(',') === KONAMI_CODE.join(',')) {
          setActive(true);
          setTimeout(() => setActive(false), 4000);
        }
        return next;
      });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return active ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="text-6xl animate-bounce">🎉✨🚀</div>
      <div className="absolute bottom-10 w-full text-center text-2xl font-display text-white drop-shadow-lg animate-fade-in">Easter Egg Unlocked!</div>
    </div>
  ) : null;
};

export default ProminenceEasterEgg; 