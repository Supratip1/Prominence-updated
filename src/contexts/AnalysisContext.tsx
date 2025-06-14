import React, { createContext, useContext, useState } from 'react';
import type { Asset as AEOAsset } from '../utils/aeoCrawler';

export type Asset = AEOAsset;

interface AnalysisContextType {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  getCachedAssets: (domain: string) => Asset[] | null;
  setCachedAssets: (domain: string, assets: Asset[]) => void;
  clearCache: (domain: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);

  const getCachedAssets = (domain: string): Asset[] | null => {
    const cached = sessionStorage.getItem(`analysis_${domain}`);
    return cached ? JSON.parse(cached) : null;
  };

  const setCachedAssets = (domain: string, assets: Asset[]) => {
    sessionStorage.setItem(`analysis_${domain}`, JSON.stringify(assets));
  };

  const clearCache = (domain: string) => {
    sessionStorage.removeItem(`analysis_${domain}`);
    setAssets([]);
  };

  return (
    <AnalysisContext.Provider value={{ assets, setAssets, getCachedAssets, setCachedAssets, clearCache }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis must be used within AnalysisProvider');
  return context;
}
