import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { normalizeUrl } from '../utils/hooks';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Header from '../components/Layout/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { AEOApiService } from '../services/aeoApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const TrackCompetitors = () => {
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const url = normalizeUrl(rawUrl);
  const queryClient = useQueryClient();

  const storedComp = (() => {
    try {
      const raw = localStorage.getItem(`competitor-analysis-${url}`);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  })();

  // Use React Query to cache competitor analysis
  const { data: analysisDataRaw, isLoading: loading, error } = useQuery({
    queryKey: ['competitor-analysis', url],
    queryFn: () => AEOApiService.analyzeWebsiteWithCompetitors({ url }).then(res => res.data),
    enabled: !!url,
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialData: queryClient.getQueryData(['competitor-analysis', url]) || storedComp
  });
  const analysisData = analysisDataRaw || {};

  useEffect(() => {
    if (analysisDataRaw) {
      try {
        localStorage.setItem(`competitor-analysis-${url}`, JSON.stringify(analysisDataRaw));
      } catch (err) {
        console.error('Failed saving competitor analysis to localStorage', err);
      }
    }
  }, [analysisDataRaw, url]);

  // Debug: log the full competitor analysis response
  console.log('analysisData', analysisData);

  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-20">
          <DashboardLayout pageTitle="">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <span className="text-lg text-gray-700">Loading competitor analysis...</span>
            </div>
          </DashboardLayout>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="pt-20">
          <DashboardLayout pageTitle="">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <span className="text-lg text-red-600">{(error as Error).message}</span>
            </div>
          </DashboardLayout>
        </div>
      </>
    );
  }

  if (!analysisData) {
    return (
      <>
        <Header />
        <div className="pt-20">
          <DashboardLayout pageTitle="">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
                No analysis data found. Please run an analysis first to see competitor insights.
              </p>
            </div>
          </DashboardLayout>
        </div>
      </>
    );
  }

  // Extract competitor data from enhanced backend
  const competitorData = (analysisData as any)?.competitor_analysis || (analysisData as any)?.audit_report?.competitor_analysis;
  const mainSiteData = (analysisData as any)?.audit_report || analysisData;

  // Extract competitor information
  const competitors = competitorData?.competitors || [];
  const ranking = competitorData?.ranking || [];
  const insights = competitorData?.insights || {};
  const userRanking = competitorData?.your_ranking || 1;
  const averageCompetitorScore = competitorData?.average_competitor_score || 0;
  const scoreDifference = competitorData?.score_difference || 0;
  const mainSiteScore = mainSiteData?.aeo_score ?? mainSiteData?.aeo_score_pct ?? 0;

  // Find user's ranking data for advantages/disadvantages
  const userRankingData = ranking.find((r: any) => r.is_user_site);
  const userAdvantages = userRankingData?.key_advantages || [];
  const userDisadvantages = userRankingData?.key_disadvantages || [];

  // Prepare chart data
  const chartData = competitors.map((comp: any, index: number) => ({
    name: comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`,
    score: comp.aeo_score || 0,
    structured: comp.structured_data_score || 0,
    snippet: comp.snippet_optimization_score || 0,
    crawlability: comp.crawlability_score || 0,
    isUser: comp.domain === url
  }));

  const COLORS = ['#000000', '#222222', '#444444', '#888888', '#CCCCCC'];

  const getTrendIcon = (userScore: number, compScore: number) => {
    if (userScore > compScore + 5) return <TrendingUp className="w-4 h-4 text-black" />;
    if (compScore > userScore + 5) return <TrendingDown className="w-4 h-4 text-black" />;
    return <Minus className="w-4 h-4 text-black" />;
  };

  const getScoreColor = (score: number) => 'text-black';
  const getScoreBgColor = (score: number) => 'bg-gray-100';

  // Helper to get detailed data for each row
  function getDetailsForRow(row: any) {
    if (row.is_user_site) {
      return {
        structured_data_score: mainSiteData?.structured_data_score ?? mainSiteData?.structured_data?.score ?? '-',
        snippet_optimization_score: mainSiteData?.snippet_optimization_score ?? mainSiteData?.snippet_optimization?.score ?? '-',
        crawlability_score: mainSiteData?.technical_seo_score ?? mainSiteData?.crawlability_score ?? mainSiteData?.crawlability?.score ?? '-',
        total_pages_analyzed: mainSiteData?.total_pages_analyzed ?? mainSiteData?.snippet_optimization?.overall_findings?.total_pages ?? '-',
        schema_types_found: mainSiteData?.schema_types_found ?? mainSiteData?.structured_data?.schema_types_found ? Object.keys(mainSiteData?.structured_data?.schema_types_found).length : '-',
        status: mainSiteData?.status ?? '-',
      };
    }
    const comp = competitorData?.competitors?.find((c: any) => c.domain === row.domain) || {};
    return {
      structured_data_score: comp.structured_data_score ?? '-',
      snippet_optimization_score: comp.snippet_optimization_score ?? '-',
      crawlability_score: comp.crawlability_score ?? '-',
      total_pages_analyzed: comp.total_pages_analyzed ?? '-',
      schema_types_found: comp.schema_types_found ?? '-',
      status: comp.status ?? '-',
    };
  }

  // Sort ranking array with multi-level tiebreakers before rendering
  const sortedRanking = [...ranking].sort((a: any, b: any) => {
    // 1. AEO Score
    const aAEO = typeof a.aeo_score === 'number' ? a.aeo_score : (typeof a.score === 'number' ? a.score : 0);
    const bAEO = typeof b.aeo_score === 'number' ? b.aeo_score : (typeof b.score === 'number' ? b.score : 0);
    if (bAEO !== aAEO) return bAEO - aAEO;
    // 2. Structured Data
    const aDetails = getDetailsForRow(a);
    const bDetails = getDetailsForRow(b);
    const aSD = Number(aDetails.structured_data_score) || 0;
    const bSD = Number(bDetails.structured_data_score) || 0;
    if (bSD !== aSD) return bSD - aSD;
    // 3. Content
    const aContent = Number(aDetails.snippet_optimization_score) || 0;
    const bContent = Number(bDetails.snippet_optimization_score) || 0;
    if (bContent !== aContent) return bContent - aContent;
    // 4. Technical
    const aTech = Number(aDetails.crawlability_score) || 0;
    const bTech = Number(bDetails.crawlability_score) || 0;
    if (bTech !== aTech) return bTech - aTech;
    // 5. Pages Analyzed
    const aPages = Number(aDetails.total_pages_analyzed) || 0;
    const bPages = Number(bDetails.total_pages_analyzed) || 0;
    if (bPages !== aPages) return bPages - aPages;
    // 6. Schemas Found
    const aSchemas = Number(aDetails.schema_types_found) || 0;
    const bSchemas = Number(bDetails.schema_types_found) || 0;
    if (bSchemas !== aSchemas) return bSchemas - aSchemas;
    // 7. Domain (alphabetical)
    return String(a.domain).localeCompare(String(b.domain));
  });

  // Find your rank in the sorted array
  const yourIndex = sortedRanking.findIndex((row: any) => row.is_user_site);
  const yourRank = yourIndex >= 0 ? yourIndex + 1 : '-';

  // Prepare data for graphs using sortedRanking so user's site is always included
  const graphData = sortedRanking.map((row: any) => {
    const details = getDetailsForRow(row);
    return {
      domain: row.domain,
      aeo_score: typeof row.aeo_score === 'number' ? row.aeo_score : (typeof row.score === 'number' ? row.score : 0),
      structured_data: Number(details.structured_data_score) || 0,
      content: Number(details.snippet_optimization_score) || 0,
      technical: Number(details.crawlability_score) || 0,
      pages: Number(details.total_pages_analyzed) || 0,
      schemas: Number(details.schema_types_found) || 0,
      isUser: row.is_user_site,
    };
  });

  // Remove duplicate domains from sortedRanking (keep first occurrence)
  const uniqueSortedRanking = [];
  const seenDomains = new Set();
  for (const row of sortedRanking) {
    const domain = row.domain?.toLowerCase();
    if (!seenDomains.has(domain)) {
      uniqueSortedRanking.push(row);
      seenDomains.add(domain);
    }
  }

  return (
    <>
      <Header />
      <div>
        <DashboardLayout pageTitle="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
              {/** Each card: center content on mobile, left on md+ */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-600">Your Rank</p>
                    <p className="text-2xl font-bold text-black">#{yourRank}</p>
                  </div>
                  <Award className="w-8 h-8 ml-4 md:ml-0 text-black" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-600">Your Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(mainSiteScore)}`}>{mainSiteScore}%</p>
                  </div>
                  <Target className="w-8 h-8 ml-4 md:ml-0 text-black" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-600">Avg Competitor</p>
                    <p className="text-2xl font-bold text-gray-700">{averageCompetitorScore.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 ml-4 md:ml-0 text-black" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-600">Score Gap</p>
                    <p className={`text-2xl font-bold ${scoreDifference > 0 ? 'text-green-600' : scoreDifference < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                      {scoreDifference > 0 ? '+' : ''}{scoreDifference.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart className="w-8 h-8 ml-4 md:ml-0 text-black" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-600">Competitors</p>
                    <p className="text-2xl font-bold text-black">{competitors.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 ml-4 md:ml-0 text-black" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col gap-8 mb-8 lg:grid lg:grid-cols-2">
              {/* Score Comparison Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center md:text-left">AEO Score Comparison</h3>
                <div className="w-full min-w-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={graphData} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domain" angle={-20} textAnchor="end" height={60} interval={0} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="aeo_score" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Component Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center md:text-left">Component Breakdown</h3>
                <div className="w-full min-w-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={graphData} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domain" angle={-20} textAnchor="end" height={60} interval={0} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="structured_data" fill="#222222" name="Structured Data" />
                      <Bar dataKey="content" fill="#444444" name="Snippet Optimization" />
                      <Bar dataKey="technical" fill="#888888" name="Crawlability" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Competitors Table as Cards on Mobile */}
            <div className="mb-8">
              {/* Table for md+ */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Domain</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">AEO Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Structured Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Snippet Optimization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Crawlability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Pages</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black dark:text-black">Schemas</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-gray-900 dark:text-black">
                      {uniqueSortedRanking.map((row: any, index: number) => {
                        const isUser = row.is_user_site;
                        const details = getDetailsForRow(row);
                        return (
                          <tr
                            key={index}
                            className={`hover:bg-gray-50 cursor-pointer ${isUser ? 'bg-blue-50 font-bold' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 dark:text-black">#{index + 1}</span>
                                {isUser && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-black">
                                  {row.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold dark:text-black">
                              {typeof row.aeo_score === 'number' ? `${row.aeo_score}%` : typeof row.score === 'number' ? `${row.score}%` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-black">{typeof details.structured_data_score === 'number' ? `${details.structured_data_score}/10` : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-black">{typeof details.snippet_optimization_score === 'number' ? `${details.snippet_optimization_score}/10` : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-black">{typeof details.crawlability_score === 'number' ? `${details.crawlability_score}/10` : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-black">{details.total_pages_analyzed}</td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-black">{details.schema_types_found}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Cards for mobile */}
              <div className="md:hidden flex flex-col gap-4">
                {competitors.map((comp: any, index: number) => {
                  const isUser = comp.domain === url;
                  return (
                    <div key={index} className={`rounded-2xl border border-gray-200 shadow p-4 bg-white ${isUser ? 'bg-blue-50 border-blue-200' : ''}`}
                      onClick={() => setSelectedCompetitor(comp.domain)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-black">#{index + 1}</span>
                          {isUser && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(comp.aeo_score || 0)}`}>{comp.aeo_score || 0}%</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-black mb-1">
                        {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.structured_data_score || 0)} ${getScoreColor(comp.structured_data_score || 0)}`}>SD: {typeof comp.structured_data_score === 'number' ? `${comp.structured_data_score}/10` : '-'}</div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.snippet_optimization_score || 0)} ${getScoreColor(comp.snippet_optimization_score || 0)}`}>Content: {typeof comp.snippet_optimization_score === 'number' ? `${comp.snippet_optimization_score}/10` : '-'}</div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.crawlability_score || 0)} ${getScoreColor(comp.crawlability_score || 0)}`}>Tech: {typeof comp.crawlability_score === 'number' ? `${comp.crawlability_score}/10` : '-'}</div>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        {comp.technical_status?.robots_txt_accessible ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">{comp.technical_status?.robots_txt_accessible ? 'Accessible' : 'Blocked'}</span>
                      </div>
                      {/* Additional competitor analysis key details */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                          <div>Pages: {comp.total_pages_analyzed || 0}</div>
                          <div>Schemas: {comp.schema_types_found || 0}</div>
                          {comp.content_quality?.avg_paragraph_length && (
                            <div>Avg Para: {comp.content_quality.avg_paragraph_length}w</div>
                          )}
                          {comp.content_quality?.pages_with_lists && (
                            <div>Lists: {comp.content_quality.pages_with_lists}</div>
                          )}
                        </div>
                        {comp.key_schema_types && comp.key_schema_types.length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            Key schemas: {comp.key_schema_types.slice(0, 3).join(', ')}
                            {comp.key_schema_types.length > 3 && '...'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score Difference and Competitive Position */}
            {scoreDifference !== 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Competitive Position</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${scoreDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scoreDifference > 0 ? '+' : ''}{scoreDifference.toFixed(1)}%
                    </div>
                    <p className="text-gray-600 mt-2">
                      {scoreDifference > 0 ? 'Ahead of' : 'Behind'} average competitor
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What Your Competitors Are Doing Better</h4>
                    {userDisadvantages.length > 0 ? (
                      <ul className="space-y-2">
                        {userDisadvantages.map((disadvantage: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{disadvantage}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      (() => {
                        // Fallback: compare user to top competitor for key metrics
                        const userRow = uniqueSortedRanking.find((row: any) => row.is_user_site);
                        const topCompetitor = uniqueSortedRanking.find((row: any) => !row.is_user_site);
                        if (!userRow || !topCompetitor) return <p className="text-sm text-gray-500">No competitor data available.</p>;
                        const detailsUser = getDetailsForRow(userRow);
                        const detailsComp = getDetailsForRow(topCompetitor);
                        const diffs = [];
                        if (typeof detailsComp.structured_data_score === 'number' && typeof detailsUser.structured_data_score === 'number' && detailsComp.structured_data_score > detailsUser.structured_data_score) {
                          diffs.push(`Higher Structured Data score (+${detailsComp.structured_data_score - detailsUser.structured_data_score})`);
                        }
                        if (typeof detailsComp.snippet_optimization_score === 'number' && typeof detailsUser.snippet_optimization_score === 'number' && detailsComp.snippet_optimization_score > detailsUser.snippet_optimization_score) {
                          diffs.push(`Higher Snippet Optimization score (+${detailsComp.snippet_optimization_score - detailsUser.snippet_optimization_score})`);
                        }
                        if (typeof detailsComp.crawlability_score === 'number' && typeof detailsUser.crawlability_score === 'number' && detailsComp.crawlability_score > detailsUser.crawlability_score) {
                          diffs.push(`Higher Crawlability score (+${detailsComp.crawlability_score - detailsUser.crawlability_score})`);
                        }
                        return diffs.length > 0 ? (
                          <ul className="space-y-2">
                            {diffs.map((msg, idx) => (
                              <li key={idx} className="flex items-start">
                                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{msg}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">You are on par with or ahead of your competitors on key metrics.</p>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Competitor Issues */}
            {competitors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Competitor Issues Analysis</h3>
                <div className="space-y-6">
                  {competitors.map((comp: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-black">
                          {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                        </h4>
                        <span className="text-sm text-gray-500">#{index + 1} • {comp.aeo_score || 0}%</span>
                      </div>
                      {comp.main_issues && comp.main_issues.length > 0 ? (
                        <div className="space-y-3">
                          {comp.main_issues.map((issue: any, issueIdx: number) => (
                            <div key={issueIdx} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-black text-sm">{issue.issue}</h5>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  issue.impact === 'High' ? 'bg-red-100 text-red-800' :
                                  issue.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {issue.impact} Impact
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{issue.fix}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No major issues identified</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Competitor Analysis Key Details Section */}
            {competitors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Competitor Analysis Key Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Quality Comparison */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Content Quality Metrics</h4>
                    <div className="space-y-3">
                      {competitors.map((comp: any, index: number) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-black">
                              {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                            <div>Avg Paragraph: {comp.content_quality?.avg_paragraph_length || 'N/A'} words</div>
                            <div>Pages w/ Lists: {comp.content_quality?.pages_with_lists || 'N/A'}</div>
                            <div>Pages w/ Questions: {comp.content_quality?.pages_with_questions || 'N/A'}</div>
                            <div>Total Pages: {comp.total_pages_analyzed || 'N/A'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical & Schema Analysis */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Technical & Schema Analysis</h4>
                    <div className="space-y-3">
                      {competitors.map((comp: any, index: number) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-black">
                              {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                            <div>Robots.txt: {comp.technical_status?.robots_txt_accessible === true ? 'Accessible' : comp.technical_status?.robots_txt_accessible === false ? 'Blocked' : 'N/A'}</div>
                            <div>Structured Data Score: {typeof comp.structured_data_score === 'number' ? `${comp.structured_data_score}/10` : '-'}</div>
                            <div>Schemas Found: {comp.schema_types_found || 'N/A'}</div>
                            <div>Crawlability Score: {typeof comp.crawlability_score === 'number' ? `${comp.crawlability_score}/10` : '-'}</div>
                          </div>
                          {comp.key_schema_types && comp.key_schema_types.length > 0 && (
                            <div className="mt-1 text-xs text-gray-500">
                              Key schemas: {comp.key_schema_types.slice(0, 3).join(', ')}
                              {comp.key_schema_types.length > 3 && '...'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default TrackCompetitors;