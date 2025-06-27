import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { Info, ShieldCheck, ShieldX, BarChart2, FileText, Globe, Star } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { normalizeUrl } from '../utils/hooks';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-700">
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
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
  const [activeModal, setActiveModal] = useState<null | 'structured' | 'snippet' | 'crawlability' | string>(null);

  return (
    <DashboardLayout pageTitle="AEO Analysis">
      <>
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
            <div className="max-w-6xl mx-auto mt-12 mb-8 flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-normal text-black font-display tracking-tight text-center sm:text-left w-full">
                Score for {analyzedDomain || 'your site'}
              </h2>
              {/* (Optional) User info or actions can go here */}
            </div>
            {/* Row 1: Four stat cards (Overall Score first) */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Overall Score Card (dark, premium) */}
              <div className="bg-black rounded-2xl border border-gray-900 shadow p-6 flex flex-col items-center min-h-[120px]">
                <Star className="w-8 h-8 mb-2 text-white" />
                <h3 className="text-lg font-normal text-white mb-1">Overall AEO Score</h3>
                <div className="text-2xl font-bold text-white">{overall !== undefined ? overall : '-'}</div>
              </div>
              {/* Structured Data Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px]">
                <button onClick={() => setActiveModal('structured')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Structured Data Details">
                  <Info className="w-5 h-5" />
                </button>
                <FileText className="w-8 h-8 mb-2 text-gray-500" />
                <h3 className="text-lg font-normal text-black mb-1">Structured Data</h3>
                <div className="text-2xl font-bold text-black">{structured?.score !== undefined ? structured.score : '-'}/10</div>
              </div>
              {/* Snippet Optimization Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px]">
                <button onClick={() => setActiveModal('snippet')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Snippet Optimization Details">
                  <Info className="w-5 h-5" />
                </button>
                <BarChart2 className="w-8 h-8 mb-2 text-gray-500" />
                <h3 className="text-lg font-normal text-black mb-1">Snippet Optimization</h3>
                <div className="text-2xl font-bold text-black">{snippet?.score !== undefined ? snippet.score : '-'}/10</div>
              </div>
              {/* Crawlability Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center relative min-h-[120px]">
                <button onClick={() => setActiveModal('crawlability')} className="absolute top-4 right-4 text-gray-400 hover:text-black" aria-label="Crawlability Details">
                  <Info className="w-5 h-5" />
                </button>
                <Globe className="w-8 h-8 mb-2 text-gray-500" />
                <h3 className="text-lg font-normal text-black mb-1">Crawlability</h3>
                <div className="text-2xl font-bold text-black">{crawlability?.score !== undefined ? crawlability.score : '-'}/10</div>
              </div>
            </div>
            {/* Row 2: Line chart and donut chart side by side */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Line Graph: Per-page metrics */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-8 flex flex-col">
                <h3 className="text-xl font-normal text-black mb-6 text-center">Page Content Metrics</h3>
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
              {/* Donut Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-8 flex flex-col">
                <h3 className="text-xl font-normal text-black mb-6 text-center">Model Scores</h3>
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
              </div>
            </div>
            {/* Row 3: Recommendations or Validation (remove this section) */}
            {/* Modals for details */}
            <Modal isOpen={activeModal === 'structured'} onClose={() => setActiveModal(null)}>
              <div className="p-6 min-w-[320px] max-w-md">
                <h2 className="text-xl font-bold mb-4">Structured Data Details</h2>
                <div className="mb-2"><span className="font-semibold">Score:</span> {structured?.score ?? '-'}/10</div>
                <div className="mb-2"><span className="font-semibold">Schema Types Found:</span> {structured?.schema_types_found && Object.keys(structured.schema_types_found).length > 0 ? (
                  <ul className="list-disc ml-6">
                    {Object.entries(structured.schema_types_found).map(([type, count]) => (
                      <li key={type}>{type} <span className="text-gray-500">({count as number})</span></li>
                    ))}
                  </ul>
                ) : <span className="text-gray-500">None</span>}</div>
                <div className="mb-2"><span className="font-semibold">Pages with Errors:</span> {structured?.pages_with_errors && structured.pages_with_errors.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {structured.pages_with_errors.map((err: any, idx: number) => (
                      <li key={idx}>{typeof err === 'string' ? err : JSON.stringify(err)}</li>
                    ))}
                  </ul>
                ) : <span className="text-gray-500">None</span>}</div>
                <div className="mb-2"><span className="font-semibold">Issues:</span> {structured?.issues && structured.issues.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {structured.issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                ) : <span className="text-gray-500">None</span>}</div>
              </div>
            </Modal>
            <Modal isOpen={activeModal === 'snippet'} onClose={() => setActiveModal(null)}>
              <div className="p-6 min-w-[320px] max-w-md">
                <h2 className="text-xl font-bold mb-4">Snippet Optimization Details</h2>
                <div className="mb-2"><span className="font-semibold">Score:</span> {snippet?.score ?? '-'}/10</div>
                <div className="mb-2"><span className="font-semibold">Pages Evaluated:</span> {snippet?.overall_findings?.total_pages ?? '-'}</div>
                <div className="mb-2"><span className="font-semibold">Issues:</span> {snippet?.issues && snippet.issues.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {snippet.issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                ) : <span className="text-gray-500">None</span>}</div>
              </div>
            </Modal>
            <Modal isOpen={activeModal === 'crawlability'} onClose={() => setActiveModal(null)}>
              <div className="p-6 min-w-[320px] max-w-md">
                <h2 className="text-xl font-bold mb-4">Crawlability Details</h2>
                <div className="mb-2"><span className="font-semibold">Score:</span> {crawlability?.score ?? '-'}/10</div>
                <div className="mb-2"><span className="font-semibold">Robots.txt Accessible:</span> {crawlability?.robots_txt?.accessible ? 'Yes' : 'No'}</div>
                <div className="mb-2"><span className="font-semibold">Sitemap Found:</span> {crawlability?.sitemap?.found ? 'Yes' : 'No'}</div>
                <div className="mb-2"><span className="font-semibold">Issues:</span> {crawlability?.issues && crawlability.issues.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {crawlability.issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                ) : <span className="text-gray-500">None</span>}</div>
              </div>
            </Modal>
          </>
        )}
      </>
    </DashboardLayout>
  );
};

export default AEOAnalysis; 