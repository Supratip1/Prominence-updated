import React from 'react';

export default function CenteredAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
    }}>
      {children}
    </div>
  );
} 