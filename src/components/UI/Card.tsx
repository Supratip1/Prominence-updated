import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : 'shadow-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
}