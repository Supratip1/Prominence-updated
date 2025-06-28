import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { normalizeUrl } from '../utils/hooks';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Header from '../components/Layout/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { AEOApiService } from '../services/aeoApi';

const TrackCompetitors = () => {
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const url = normalizeUrl(rawUrl);

  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    AEOApiService.analyzeWebsiteWithCompetitors({ url })
      .then((res) => {
        if (res.success) setAnalysisData(res.data);
        else setError(res.error || 'Unknown error');
      })
      .catch((err) => setError(err.message || 'API error'))
      .finally(() => setLoading(false));
  }, [url]);

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
              <span className="text-lg text-red-600">{error}</span>
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
  const competitorData = analysisData.competitor_analysis || analysisData.audit_report?.competitor_analysis;
  const mainSiteData = analysisData.audit_report || analysisData;

  // Extract competitor information
  const competitors = competitorData?.competitors || [];
  const ranking = competitorData?.ranking || [];
  const insights = competitorData?.insights || {};
  const userRanking = competitorData?.your_ranking || 1;
  const averageCompetitorScore = competitorData?.average_competitor_score || 0;
  const scoreDifference = competitorData?.score_difference || 0;
  const mainSiteScore = mainSiteData?.aeo_score_pct || 0;

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

  return (
    <>
      <Header />
      <div className="pt-20">
        <DashboardLayout pageTitle="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
              {/** Each card: center content on mobile, left on md+ */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-600">Your Rank</p>
                    <p className="text-2xl font-bold text-black">#{userRanking}</p>
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
                    <BarChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Component Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center md:text-left">Component Breakdown</h3>
                <div className="w-full min-w-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="structured" fill="#222222" name="Structured Data" />
                      <Bar dataKey="snippet" fill="#444444" name="Snippet Optimization" />
                      <Bar dataKey="crawlability" fill="#888888" name="Crawlability" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AEO Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structured Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schemas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {competitors.map((comp: any, index: number) => {
                        const isUser = comp.domain === url;
                        return (
                          <tr 
                            key={index} 
                            className={`hover:bg-gray-50 cursor-pointer ${isUser ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedCompetitor(comp.domain)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                                {isUser && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`text-sm font-bold ${getScoreColor(comp.aeo_score || 0)}`}>{comp.aeo_score || 0}%</span>
                                {!isUser && getTrendIcon(mainSiteScore, comp.aeo_score || 0)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.structured_data_score || 0)} ${getScoreColor(comp.structured_data_score || 0)}`}>{comp.structured_data_score || 0}/10</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.snippet_optimization_score || 0)} ${getScoreColor(comp.snippet_optimization_score || 0)}`}>{comp.snippet_optimization_score || 0}/10</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.crawlability_score || 0)} ${getScoreColor(comp.crawlability_score || 0)}`}>{comp.crawlability_score || 0}/10</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{comp.total_pages_analyzed || 0}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{comp.schema_types_found || 0}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {comp.technical_status?.robots_txt_accessible ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="ml-2 text-sm text-gray-500">{comp.technical_status?.robots_txt_accessible ? 'Accessible' : 'Blocked'}</span>
                              </div>
                            </td>
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
                          <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                          {isUser && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(comp.aeo_score || 0)}`}>{comp.aeo_score || 0}%</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.structured_data_score || 0)} ${getScoreColor(comp.structured_data_score || 0)}`}>SD: {comp.structured_data_score || 0}/10</div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.snippet_optimization_score || 0)} ${getScoreColor(comp.snippet_optimization_score || 0)}`}>Content: {comp.snippet_optimization_score || 0}/10</div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(comp.crawlability_score || 0)} ${getScoreColor(comp.crawlability_score || 0)}`}>Tech: {comp.crawlability_score || 0}/10</div>
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
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
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
                <h3 className="text-xl font-semibold text-black mb-4">Competitive Position</h3>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Your Competitive Edge</h4>
                    {userAdvantages.length > 0 ? (
                      <ul className="space-y-2">
                        {userAdvantages.map((advantage: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No significant advantages identified</p>
                    )}
                  </div>
                </div>
                {userDisadvantages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Areas to Improve</h4>
                    <ul className="space-y-2">
                      {userDisadvantages.map((disadvantage: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Competitor Issues */}
            {competitors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mb-8">
                <h3 className="text-xl font-semibold text-black mb-4">Competitor Issues Analysis</h3>
                <div className="space-y-6">
                  {competitors.map((comp: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">
                          {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                        </h4>
                        <span className="text-sm text-gray-500">#{index + 1} • {comp.aeo_score || 0}%</span>
                      </div>
                      {comp.main_issues && comp.main_issues.length > 0 ? (
                        <div className="space-y-3">
                          {comp.main_issues.map((issue: any, issueIdx: number) => (
                            <div key={issueIdx} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900 text-sm">{issue.issue}</h5>
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
                <h3 className="text-xl font-semibold text-black mb-4">Competitor Analysis Key Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Quality Comparison */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Content Quality Metrics</h4>
                    <div className="space-y-3">
                      {competitors.map((comp: any, index: number) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
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
                            <span className="text-sm font-medium text-gray-900">
                              {comp.domain?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `Competitor ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span>Robots.txt:</span>
                              {comp.technical_status?.robots_txt_accessible ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className={comp.technical_status?.robots_txt_accessible ? 'text-green-600' : 'text-red-600'}>
                                {comp.technical_status?.robots_txt_accessible ? 'Accessible' : 'Blocked'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Sitemap:</span>
                              {comp.technical_status?.sitemap_found ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className={comp.technical_status?.sitemap_found ? 'text-green-600' : 'text-red-600'}>
                                {comp.technical_status?.sitemap_found ? 'Found' : 'Missing'}
                              </span>
                            </div>
                            <div>Schema Types: {comp.schema_types_found || 0}</div>
                            {comp.key_schema_types && comp.key_schema_types.length > 0 && (
                              <div className="text-gray-600">
                                Key: {comp.key_schema_types.slice(0, 3).join(', ')}
                                {comp.key_schema_types.length > 3 && '...'}
                              </div>
                            )}
                            <div>Issues Found: {comp.issues_count || 0}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Insights Section */}
            {insights && Object.keys(insights).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mb-8">
                <h3 className="text-xl font-semibold text-black mb-4">Market Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.market_position && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Market Position</h4>
                      <p className="text-gray-600">{insights.market_position}</p>
                    </div>
                  )}
                  {insights.key_advantages && insights.key_advantages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Your Advantages</h4>
                      <ul className="text-gray-600 space-y-1">
                        {insights.key_advantages.map((advantage: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insights.key_disadvantages && insights.key_disadvantages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Areas to Improve</h4>
                      <ul className="text-gray-600 space-y-1">
                        {insights.key_disadvantages.map((disadvantage: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                            {disadvantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Competitor Data Message */}
            {competitors.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Competitor Data Available</h3>
                <p className="text-gray-600 mb-4">
                  The enhanced analysis didn't find competitor data for this domain. This could be because:
                </p>
                <ul className="text-gray-600 text-left max-w-md mx-auto space-y-1">
                  <li>• The domain is too niche or new</li>
                  <li>• Competitor analysis is still processing</li>
                  <li>• No direct competitors were identified</li>
                </ul>
              </div>
            )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default TrackCompetitors; 