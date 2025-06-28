import React from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';

// You'll need to get this from your Clerk dashboard
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

interface ClerkProviderProps {
  children: React.ReactNode;
}

export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.warn('Clerk publishable key is not set. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.');
  }

  return (
    <BaseClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </BaseClerkProvider>
  );
}; 