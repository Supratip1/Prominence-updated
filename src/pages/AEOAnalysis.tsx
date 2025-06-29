import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { Info, ShieldCheck, ShieldX, BarChart2, FileText, Globe, Star, Target, Settings, Tag, AlertTriangle, Bot, BookOpen, ListChecks } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { normalizeUrl } from '../utils/hooks';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Header from '../components/Layout/Header';
import { motion } from 'framer-motion';

// Mock trend data for the last 30 days
const generateTrendData = () => {
  const trends = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    const baseScore = 75 + Math.sin(i * 0.3) * 15;
    const variation = (Math.random() - 0.5) * 10;
    
    trends.push({
      date: date.toISOString().split('T')[0],
      aeo_score: Math.max(0, Math.min(100, baseScore + variation)),
      structured_data: Math.max(0, Math.min(10, (baseScore + variation) / 10)),
      snippet_optimization: Math.max(0, Math.min(10, (baseScore + variation + 5) / 10)),
      crawlability: Math.max(0, Math.min(10, (baseScore + variation - 2) / 10)),
      pages_analyzed: Math.max(5, Math.min(20, 12 + Math.floor(Math.random() * 8))),
      issues_found: Math.max(0, Math.min(10, 3 + Math.floor(Math.random() * 5)))
    });
  }
  return trends;
};

// Custom tooltip for black and white theme
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !Array.isArray(payload) || !payload.length) return null;
  let dateString = '';
  if (label) {
    const dateObj = new Date(label);
    if (!isNaN(dateObj.getTime())) {
      dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      dateString = String(label);
    }
  }
  return (
    <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
      {dateString && <p className="font-semibold text-gray-800 mb-2">{dateString}</p>}
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm text-gray-700">
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

// Placeholder for the real API call
async function fetchAEOAnalysis(url: string) {
  // TODO: Replace with real API call
  return null;
}

const getDomainFromUrl = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Sine curve fallback for chart
function generateSineCurveData(mean = 20, amplitude = 5, points = 14) {
  return Array.from({ length: points }, (_, i) => ({
    idx: i + 1,
    url: `Page ${i + 1}`,
    avg_paragraph_words: Math.round(mean + amplitude * Math.sin(i / 2)),
    max_paragraph_words: Math.round(mean + amplitude * 1.5 + amplitude * Math.cos(i / 2)),
    paragraph_count: Math.round(mean / 2 + amplitude * Math.sin(i / 3)),
  }));
}

const AEOAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const url = normalizeUrl(rawUrl);
  console.log('rawUrl:', rawUrl, 'normalized url:', url);
  const queryClient = useQueryClient();
  const initialData = queryClient.getQueryData(['aeo-analysis', url]);
  const { data: analysisData = initialData } = useQuery<any>({
    queryKey: ['aeo-analysis', url],
    enabled: false,
    initialData
  });
  const safeData = analysisData;
  // Debug log
  console.log('AEOAnalysis data:', safeData);
  const analyzedUrl = safeData?.audit_report?.url || url;
  const analyzedDomain = analyzedUrl ? getDomainFromUrl(analyzedUrl) : '';

  // Extract real data if available (support both with and without audit_report)
  const structured = safeData?.structured_data || safeData?.audit_report?.structured_data;
  const snippet = safeData?.snippet_optimization || safeData?.audit_report?.snippet_optimization;
  const crawlability = safeData?.crawlability || safeData?.audit_report?.crawlability;
  const overall = safeData?.aeo_score_pct || safeData?.audit_report?.aeo_score_pct;
  const chatbotAccess = (safeData?.crawlability?.robots_txt?.chatbot_access || safeData?.audit_report?.crawlability?.robots_txt?.chatbot_access) || {};
  const modelScores = safeData?.model_scores || safeData?.audit_report?.model_scores || {};
  
  // Extract new advanced fields from enhanced backend
  const featuredSnippetReadiness = snippet?.featured_snippet_readiness || 0;
  const contentQualityScore = snippet?.overall_findings?.readability_score || 0;
  const technicalSeoScore = crawlability?.score || 0;
  const aeoSchemasFound = structured?.aeo_schemas_found || [];
  const totalPagesAnalyzed = snippet?.overall_findings?.total_pages || snippet?.pages_evaluated?.length || 0;
  const issuesCount = (structured?.issues?.length || 0) + (snippet?.issues?.length || 0) + (crawlability?.issues?.length || 0);
  
  // Use real trend data if available
  const realTrends = safeData?.trends || safeData?.audit_report?.trends || [];
  const trendData = Array.isArray(realTrends) && realTrends.length > 0
    ? realTrends.map((t: any) => ({
        date: t.date,
        aeo_score: t.aeo_score,
        structured_data: t.structured_data_score,
        snippet_optimization: t.snippet_score,
        crawlability: t.crawlability_score,
      }))
    : [
        {
          date: new Date().toISOString().split('T')[0],
          aeo_score: overall ?? 0,
          structured_data: structured?.score ?? 0,
          snippet_optimization: snippet?.score ?? 0,
          crawlability: crawlability?.score ?? 0,
        },
      ];
  // Prepare model scores for donut
  const modelScoreData = Object.entries(modelScores).map(([model, score]) => ({ name: model, value: score }));
  const donutColors = ['#000', '#666', '#999', '#ccc', '#333', '#bbb'];

  // Debug logging
  console.log('modelScores:', modelScores);
  console.log('modelScoreData:', modelScoreData);
  console.log('safeData:', safeData);

  // Extract per-page details for the new line chart
  const pageDetails = snippet?.overall_findings?.pages_details || snippet?.pages_evaluated || [];
  let pageChartData: any[] = [];
  if (pageDetails.length >= 5) {
    pageChartData = pageDetails.map((page: any, idx: number) => ({
      idx: idx + 1,
      url: page.url ? page.url.replace(/^https?:\/\//, '').split(/[/?#]/)[0] : `Page ${idx + 1}`,
      avg_paragraph_words: page.avg_paragraph_words ?? 0,
      max_paragraph_words: page.max_paragraph_words ?? 0,
      paragraph_count: page.paragraph_count ?? 0,
      schema_types_count: Array.isArray(page.schema_types) ? page.schema_types.length : 0,
    }));
  } else {
    // Generate sine curve fallback with schema data
    const avgSchemaCount = pageDetails.length > 0 
      ? pageDetails.reduce((sum: number, page: any) => sum + (Array.isArray(page.schema_types) ? page.schema_types.length : 0), 0) / pageDetails.length
      : 2;
    pageChartData = generateSineCurveData(20, 5, 14).map((item, idx) => ({
      ...item,
      schema_types_count: Math.round(avgSchemaCount + 2 * Math.sin(idx / 4)),
    }));
  }

  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'structured' | 'snippet' | 'crawlability' | 'featured-snippet' | 'content-quality' | 'technical-seo' | 'pages-analyzed' | 'aeo-schemas' | 'issues' | 'model-access' | string>(null);

  // Modal keys for all possible modals
  const modalKeys = [
    'structured', 'snippet', 'crawlability',
    'featured-snippet', 'content-quality', 'technical-seo', 'pages-analyzed',
    'aeo-schemas', 'issues', 'model-access'
  ];

  // After extracting other fields:
  const recommendations =
    safeData?.optimization_recommendations?.optimizations ||
    safeData?.audit_report?.optimization_recommendations?.optimizations ||
    [];

  // Helper functions for modal content
  function getModalTitle(key: string | null) {
    switch (key) {
      case 'structured': return 'Structured Data Details';
      case 'snippet': return 'Snippet Optimization Details';
      case 'crawlability': return 'Crawlability Details';
      case 'featured-snippet': return 'Featured Snippet Readiness';
      case 'content-quality': return 'Content Quality';
      case 'technical-seo': return 'Technical SEO';
      case 'pages-analyzed': return 'Pages Analyzed';
      case 'aeo-schemas': return 'AEO Schemas Found';
      case 'issues': return 'Issues Found';
      case 'model-access': return 'AI Model Access';
      default: return '';
    }
  }

  function renderIssue(iss: any) {
    if (typeof iss === 'string') return iss;
    if (iss && typeof iss === 'object') {
      // Try to render common keys nicely
      if ('issue' in iss || 'impact' in iss || 'fix' in iss) {
        return `${iss.issue || ''}${iss.impact ? ' (Impact: ' + iss.impact + ')' : ''}${iss.fix ? ' [Fix: ' + iss.fix + ']' : ''}`;
      }
      // Fallback to JSON
      return JSON.stringify(iss);
    }
    return String(iss);
  }

  function getModalContent(key: string | null) {
    switch (key) {
      case 'structured':
        return (
          <div>
            <div className="font-semibold mb-2">Score: {structured && typeof structured.score === 'number' ? structured.score : '-'} /10</div>
            <div className="mb-2">Schema Types Found: {structured && typeof structured === 'object' && structured.schema_types_found && typeof structured.schema_types_found === 'object' && !Array.isArray(structured.schema_types_found) ? Object.keys(structured.schema_types_found).join(', ') : '-'}</div>
            <div className="mb-2">AEO Schemas: {structured && Array.isArray(structured.aeo_schemas_found) ? structured.aeo_schemas_found.join(', ') : '-'}</div>
            <div className="mb-2">Issues: <ul className="list-disc ml-6 text-sm">{structured && Array.isArray(structured.issues) && structured.issues.length ? structured.issues.map((iss: any, i: number) => <li key={i}>{renderIssue(iss)}</li>) : <li>None</li>}</ul></div>
          </div>
        );
      case 'snippet':
        return (
          <div>
            <div className="font-semibold mb-2">Score: {snippet && typeof snippet === 'object' && typeof snippet.score === 'number' ? snippet.score : '-'} /10</div>
            <div className="mb-2">Featured Snippet Readiness: {snippet && typeof snippet === 'object' && typeof snippet.featured_snippet_readiness === 'number' ? snippet.featured_snippet_readiness : '-'} /10</div>
            <div className="mb-2">Issues: <ul className="list-disc ml-6 text-sm">{snippet && typeof snippet === 'object' && Array.isArray(snippet.issues) && snippet.issues.length ? snippet.issues.map((iss: any, i: number) => <li key={i}>{renderIssue(iss)}</li>) : <li>None</li>}</ul></div>
          </div>
        );
      case 'crawlability':
        return (
          <div>
            <div className="font-semibold mb-2">Score: {crawlability && typeof crawlability === 'object' && typeof crawlability.score === 'number' ? crawlability.score : '-'} /10</div>
            <div className="mb-2">Robots.txt Accessible: {crawlability && typeof crawlability === 'object' && crawlability.robots_txt && typeof crawlability.robots_txt.accessible === 'boolean' ? (crawlability.robots_txt.accessible ? 'Yes' : 'No') : '-'}</div>
            <div className="mb-2">Sitemap Found: {crawlability && typeof crawlability === 'object' && crawlability.sitemap && typeof crawlability.sitemap.found === 'boolean' ? (crawlability.sitemap.found ? 'Yes' : 'No') : '-'}</div>
            <div className="mb-2">Issues: <ul className="list-disc ml-6 text-sm">{crawlability && typeof crawlability === 'object' && Array.isArray(crawlability.issues) && crawlability.issues.length ? crawlability.issues.map((iss: any, i: number) => <li key={i}>{renderIssue(iss)}</li>) : <li>None</li>}</ul></div>
          </div>
        );
      case 'featured-snippet':
        return <div>Featured Snippet Readiness: {snippet && typeof snippet.featured_snippet_readiness === 'number' ? snippet.featured_snippet_readiness : '-'} /10</div>;
      case 'content-quality':
        return <div>Content Quality Score: {typeof contentQualityScore === 'number' ? contentQualityScore : '-'}</div>;
      case 'technical-seo':
        return <div>Technical SEO Score: {typeof technicalSeoScore === 'number' ? technicalSeoScore : '-'} /10</div>;
      case 'pages-analyzed':
        return <div>Total Pages Analyzed: {typeof totalPagesAnalyzed === 'number' ? totalPagesAnalyzed : '-'}</div>;
      case 'aeo-schemas':
        return <div>AEO Schemas Found: {Array.isArray(aeoSchemasFound) ? aeoSchemasFound.join(', ') : '-'}</div>;
      case 'issues':
        return <div>Total Issues: {typeof issuesCount === 'number' ? issuesCount : '-'}</div>;
      case 'model-access':
        return (
          <div>
            <div className="mb-2">AI Model Access:</div>
            <ul className="list-disc ml-6 text-sm">
              {chatbotAccess && typeof chatbotAccess === 'object' && Object.entries(chatbotAccess).length > 0 ? (
                Object.entries(chatbotAccess).map(([model, access]: any, i) => (
                  <li key={i}>{model}: {access && typeof access.allowed === 'boolean' ? (access.allowed ? 'Allowed' : 'Blocked') : 'N/A'}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Header />
      <DashboardLayout pageTitle={`Analytics for ${analyzedDomain || 'your site'}`}>
        <div className="pt-20">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-500">Analyzing...</span>
            </div>
          )}
          {!loading && !analysisData ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="text-gray-500 mb-4">No analysis data found. Please run an analysis.</div>
            </div>
          ) : null}
          {!loading && analysisData && (
            <>
              {/* Top: Page Title */}
              {/* (Optional) User info or actions can go here */}

              {/* Charts Row: Always show Page Content Metrics and Model Scores side by side */}
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Line Graph: Per-page metrics */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow p-8 flex flex-col">
                  <h3 className="text-xl font-normal text-black mb-6">Page Content Metrics</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={pageChartData} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="url"
                        stroke="#6b7280"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        interval={0}
                        angle={-20}
                        height={60}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avg_paragraph_words" stroke="#222" strokeWidth={2} dot name="Avg Paragraph Words" />
                      <Line type="monotone" dataKey="max_paragraph_words" stroke="#888" strokeWidth={2} dot name="Max Paragraph Words" />
                      <Line type="monotone" dataKey="paragraph_count" stroke="#bbb" strokeWidth={2} dot name="Paragraph Count" />
                      <Line type="monotone" dataKey="schema_types_count" stroke="#666" strokeWidth={2} dot name="Schema Types" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Donut Chart: Model Scores */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow p-8 flex flex-col">
                  <h3 className="text-xl font-normal text-black mb-6">Model Scores</h3>
                    {modelScoreData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={modelScoreData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {modelScoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400" style={{ minHeight: 200 }}>
                        <span>No model scores available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metric Cards: All rows below charts */}
                {/* Row 1: Four stat cards (Overall Score first) */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {/* Overall Score Card (dark, premium) */}
                  <motion.div
                    className="bg-black rounded-2xl border border-gray-900 shadow p-6 flex flex-col items-center min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Star className="w-8 h-8 mb-2 text-white" />
                    <h3 className="text-lg font-normal text-white mb-1">Overall AEO Score</h3>
                    <div className="text-2xl font-bold text-white">{overall !== undefined ? overall : '-'}</div>
                  </motion.div>
                  {/* Structured Data Card */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('structured')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Structured Data Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <FileText className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Structured Data</h3>
                    <div className="text-2xl font-bold text-black">{structured?.score !== undefined ? structured.score : '-'}/10</div>
                  </motion.div>
                  {/* Snippet Optimization Card */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('snippet')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Snippet Optimization Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <BarChart2 className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Snippet Optimization</h3>
                    <div className="text-2xl font-bold text-black">{snippet?.score !== undefined ? snippet.score : '-'}/10</div>
                  </motion.div>
                  {/* Crawlability Card */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('crawlability')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Crawlability Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <Globe className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Crawlability</h3>
                    <div className="text-2xl font-bold text-black">{crawlability?.score !== undefined ? crawlability.score : '-'}/10</div>
                  </motion.div>
                </div>
                
                {/* Row 2: Advanced metrics from enhanced backend */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {/* Featured Snippet Readiness */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('featured-snippet')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Featured Snippet Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <Target className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Featured Snippet Ready</h3>
                    <div className="text-2xl font-bold text-black">{featuredSnippetReadiness}/10</div>
                  </motion.div>
                  
                  {/* Content Quality Score */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('content-quality')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Content Quality Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <BookOpen className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Content Quality</h3>
                    <div className="text-2xl font-bold text-black">{contentQualityScore > 0 ? contentQualityScore : '-'}</div>
                  </motion.div>
                  
                  {/* Technical SEO Score */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('technical-seo')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Technical SEO Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <Settings className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Technical SEO</h3>
                    <div className="text-2xl font-bold text-black">{technicalSeoScore}/10</div>
                  </motion.div>
                  
                  {/* Pages Analyzed */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('pages-analyzed')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Pages Analyzed Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <BarChart2 className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Pages Analyzed</h3>
                    <div className="text-2xl font-bold text-black">{totalPagesAnalyzed}</div>
                  </motion.div>
                </div>
                
                {/* Row 3: Additional metrics row */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {/* AEO Schemas Found */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('aeo-schemas')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="AEO Schemas Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <Tag className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">AEO Schemas</h3>
                    <div className="text-2xl font-bold text-black">{aeoSchemasFound.length}</div>
                  </motion.div>
                  
                  {/* Total Issues */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('issues')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Issues Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <AlertTriangle className="w-8 h-8 mb-2 text-yellow-500" />
                    <h3 className="text-lg font-normal text-black mb-1">Total Issues</h3>
                    <div className="text-2xl font-bold text-black">{issuesCount}</div>
                  </motion.div>
                  
                  {/* Model Access Score */}
                  <motion.div
                    className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button onClick={() => setActiveModal('model-access')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Model Access Details">
                      <Info className="w-5 h-5" />
                    </button>
                    <Bot className="w-8 h-8 mb-2 text-gray-500" />
                    <h3 className="text-lg font-normal text-black mb-1">AI Model Access</h3>
                    <div className="text-2xl font-bold text-black">
                      {Object.values(chatbotAccess).filter((access: any) => access.allowed).length}/{Object.keys(chatbotAccess).length}
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </DashboardLayout>
        <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)}>
          <div>
            <div className="text-xl font-semibold mb-4">{getModalTitle(activeModal)}</div>
            {getModalContent(activeModal)}
          </div>
        </Modal>
      </>
    );
};

export default AEOAnalysis; 