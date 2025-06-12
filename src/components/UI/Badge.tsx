import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'default';
}

export default function Badge({ children, variant }: BadgeProps) {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${variants[variant]}`}>
      {children}
    </span>
  );
}