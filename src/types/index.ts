export interface Keyword {
  id: string;
  keyword: string;
  targetDomain: string;
  lastCrawl: string;
  status: 'active' | 'paused' | 'crawling' | 'error';
  visibilityScore: number;
  citations: number;
}

export interface KPIData {
  visibilityScore: number;
  weekChange: number;
  coverage: number;
  volatility: number;
}

export interface ActionItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}