import { Keyword, KPIData, ActionItem, PricingPlan } from '../types';

export const mockKeywords: Keyword[] = [
  {
    id: '1',
    keyword: 'best CRM for startups',
    targetDomain: 'hubspot.com',
    lastCrawl: '2024-12-19 14:30',
    status: 'active',
    visibilityScore: 78,
    citations: 12,
  },
  {
    id: '2',
    keyword: 'project management software',
    targetDomain: 'linear.app',
    lastCrawl: '2024-12-19 13:45',
    status: 'crawling',
    visibilityScore: 65,
    citations: 8,
  },
  {
    id: '3',
    keyword: 'AI writing tools comparison',
    targetDomain: 'openai.com',
    lastCrawl: '2024-12-19 12:15',
    status: 'active',
    visibilityScore: 92,
    citations: 24,
  },
  {
    id: '4',
    keyword: 'cloud hosting providers',
    targetDomain: 'vercel.com',
    lastCrawl: '2024-12-19 11:20',
    status: 'paused',
    visibilityScore: 43,
    citations: 5,
  },
  {
    id: '5',
    keyword: 'design system libraries',
    targetDomain: 'figma.com',
    lastCrawl: '2024-12-19 10:30',
    status: 'error',
    visibilityScore: 0,
    citations: 0,
  },
];

export const mockKPIData: KPIData = {
  visibilityScore: 74,
  weekChange: 12,
  coverage: 89,
  volatility: 5.2,
};

export const mockActionItems: ActionItem[] = [
  {
    id: '1',
    icon: 'FileText',
    title: 'Optimise landing page content',
    description: 'Add structured data markup to improve AI citation rates.',
    link: '/optimise-content',
  },
  {
    id: '2',
    icon: 'Link',
    title: 'Build authoritative backlinks',
    description: 'Target three high-domain authority sites for guest content.',
    link: '/build-backlinks',
  },
  {
    id: '3',
    icon: 'Search',
    title: 'Track competitor keywords',
    description: 'Monitor five competitor domains for visibility gaps.',
    link: '/competitor-analysis',
  },
];

export const mockPricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    features: [
      '5 keywords tracked',
      'Weekly crawls',
      'Basic visibility dashboard',
      'Email notifications',
    ],
  },
  {
    name: 'Pro',
    price: 49,
    period: 'month',
    recommended: true,
    features: [
      '100 keywords tracked',
      'Daily crawls',
      'Advanced analytics',
      'API access',
      'Custom reports',
      'Priority support',
    ],
  },
  {
    name: 'Agency',
    price: 199,
    period: 'month',
    features: [
      'Unlimited keywords',
      'Real-time crawls',
      'White-label reports',
      'Team collaboration',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
];