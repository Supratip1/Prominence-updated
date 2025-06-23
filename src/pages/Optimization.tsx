"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Download, ArrowLeft, BarChart3, FileText, BarChart, Target, TrendingUp as TrendingUpIcon, Users, CheckCircle, Bug, BookOpen, ClipboardList, MessageSquare, AlertTriangle, Settings, GitBranch, Code, Database, Calendar, CheckSquare, FileCheck, GitPullRequest, GitCommit, GitMerge } from "lucide-react"
import { motion } from "framer-motion"
import { Line, Doughnut } from 'react-chartjs-2';
import Header from '../components/Layout/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface EngineScore {
  engine: string
  score: number
  delta: number
  trend: number[]
}

interface OpportunityRow {
  id: string
  item: string
  engine: string
  score: number
  competitor: number
  delta: number
}

interface Suggestion {
  id: string
  assetId: string
  type: string
  priority: string
  suggestion: string
  impact: string
  effort: string
}

interface Series {
  name: string
  sov: number
  color: string
}

const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

const ScoreCard = ({
  title,
  value,
  delta,
  trend,
}: { title: string; value: number; delta: number; trend: number[] }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-normal text-gray-700">{title}</h3>
        <div className="flex items-center space-x-1">
          {delta > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" strokeWidth={2} />
          ) : delta < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-600" strokeWidth={2} />
          ) : null}
          <span
            className={`text-sm font-semibold ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-gray-500"}`}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          <AnimatedCounter value={value} />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1500 ease-out"
            style={{ width: `${isVisible ? value : 0}%` }}
          />
        </div>
      </div>

      {/* Minimal sparkline */}
      <div className="h-6 flex items-end space-x-0.5">
        {trend.map((point, index) => (
          <div
            key={index}
            className="flex-1 bg-purple-200 rounded-sm transition-all duration-1000 ease-out"
            style={{
              height: `${isVisible ? (point / Math.max(...trend)) * 100 : 0}%`,
              transitionDelay: `${index * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const OpportunityTable = ({ opportunities }: { opportunities: OpportunityRow[] }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-normal text-gray-900">Optimization Opportunities</h3>
      <p className="text-sm text-gray-600 mt-1">Ranked by potential impact</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Asset</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <BarChart className="w-4 h-4" />
                <span>Engine</span>
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-end space-x-2">
                <Target className="w-4 h-4" />
                <span>Current</span>
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-end space-x-2">
                <TrendingUpIcon className="w-4 h-4" />
                <span>Leader</span>
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-end space-x-2">
                <TrendingDown className="w-4 h-4" />
                <span>Gap</span>
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-end space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Potential</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {opportunities.map((opp) => (
            <tr key={opp.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{opp.item}</div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md uppercase">
                  {opp.engine}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="text-sm font-semibold text-gray-900">{opp.score}</div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="text-sm font-semibold text-gray-900">{opp.competitor}</div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="text-sm font-semibold text-red-600">-{opp.delta}</div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(opp.competitor / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    +{Math.round((opp.delta / opp.score) * 100)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const SuggestionCard = ({ suggestion, priority, impact, effort, type }: Suggestion) => {
  const priorityConfig = {
    high: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:border-gray-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${config.bg} ${config.text} capitalize`}
          >
            {priority}
          </span>
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md capitalize">
            {type}
          </span>
        </div>
      </div>
      <p className="text-gray-900 font-medium mb-4 leading-relaxed text-sm">{suggestion}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="text-sm text-gray-600 mt-2">
          Impact: <span className="font-semibold text-purple-600">{impact}</span>
        </div>
        <div className="text-sm text-gray-600">
          Effort: <span className="font-semibold text-purple-600 capitalize">{effort}</span>
        </div>
      </div>
    </div>
  )
}

const MarketShareChart = ({ data, historicalData }: { data: Series[], historicalData: any[] }) => {
  const lineChartData = {
    labels: historicalData.map(d => d.month),
    datasets: data.map(competitor => {
      const gradient = document.createElement('canvas').getContext('2d')?.createLinearGradient(0, 0, 0, 250);
      if (gradient) {
        const color = competitor.color;
        // Simple hex to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      }
      
      return {
        label: competitor.name,
        data: historicalData.map(d => d[competitor.name]),
        borderColor: competitor.color,
        backgroundColor: gradient || 'transparent',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: competitor.color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: competitor.color,
      };
    }),
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#4b5563', // gray-600
          font: {
            family: 'inherit',
          }
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: '#e5e7eb', // gray-200
        },
        ticks: {
          color: '#6b7280', // gray-500
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280', // gray-500
        },
      },
    },
  };

  const doughnutChartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Market Share',
        data: data.map(d => d.sov),
        backgroundColor: data.map(d => d.color),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-normal text-gray-800">Market Share Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">Current distribution and 6-month trend</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart Section */}
        <div>
          <h4 className="text-md font-normal text-gray-700 mb-4 text-center">Current Market Share</h4>
          <div className="relative h-64">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              </div>
            </div>

        {/* Line Chart Section */}
        <div>
          <h4 className="text-md font-normal text-gray-700 mb-4 text-center">Market Share Trend</h4>
           <div className="relative h-64">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Optimization() {
  const [activeTab, setActiveTab] = useState("overview")

  const scores: EngineScore[] = [
    { engine: "Perplexity", score: 85, delta: 5, trend: [20, 30, 50, 60, 85] },
    { engine: "ChatGPT", score: 78, delta: -2, trend: [90, 85, 80, 82, 78] },
    { engine: "Claude", score: 92, delta: 8, trend: [50, 60, 75, 80, 92] },
  ]

  const opportunities: OpportunityRow[] = [
    {
      id: "1",
      item: "Homepage Title Tag",
      engine: "ChatGPT",
      score: 75,
      competitor: 90,
      delta: 15,
    },
    {
      id: "2",
      item: "Pricing Page Content",
      engine: "Perplexity",
      score: 80,
      competitor: 88,
      delta: 8,
    },
    {
      id: "3",
      item: "Blog Post on AI Trends",
      engine: "Claude",
      score: 88,
      competitor: 95,
      delta: 7,
    },
  ]

  const suggestions: Suggestion[] = [
    {
      id: "1",
      assetId: "homepage",
      type: "Content",
      priority: "high",
      suggestion:
        "Incorporate long-tail keywords about 'AI-driven project management' into the H1 and meta description.",
      impact: "+8-12 score",
      effort: "Low",
    },
    {
      id: "2",
      assetId: "pricing-page",
      type: "SEO",
      priority: "medium",
      suggestion:
        "Add structured data (FAQ schema) to answer common pricing questions directly in search results.",
      impact: "+5-7 score",
      effort: "Medium",
    },
    {
      id: "3",
      assetId: "blog-post",
      type: "Content",
      priority: "low",
      suggestion:
        "Update the blog post with the latest statistics from Q3 2024 to improve freshness signals.",
      impact: "+2-4 score",
      effort: "Low",
    },
    {
      id: '4',
      assetId: 'feature-page',
      type: 'Technical',
      priority: 'high',
      suggestion: 'Optimize image sizes and implement lazy loading to improve page speed from 2.5s to 1.2s.',
      impact: '+6-10 score',
      effort: 'Medium',
    },
    {
      id: '5',
      assetId: 'homepage-hero',
      type: 'Content',
      priority: 'medium',
      suggestion: 'Rewrite the H1 tag to be more emotionally resonant and include the primary keyword "AI-powered analytics".',
      impact: '+4-6 score',
      effort: 'Low',
    },
    {
      id: '6',
      assetId: 'case-study',
      type: 'Link Building',
      priority: 'high',
      suggestion: 'Promote the new case study to industry-relevant blogs to acquire at least 3 high-authority backlinks.',
      impact: '+10-15 score',
      effort: 'High',
    },
  ]

  const marketShare: Series[] = [
    { name: "Your Brand", sov: 35, color: "#3b82f6" },
    { name: "Competitor A", sov: 28, color: "#ef4444" },
    { name: "Competitor B", sov: 22, color: "#f59e0b" },
    { name: "Competitor C", sov: 15, color: "#10b981" },
  ]

  const historicalMarketShare = [
    { month: 'Jan', 'Your Brand': 20, 'Competitor A': 30, 'Competitor B': 25, 'Competitor C': 25 },
    { month: 'Feb', 'Your Brand': 22, 'Competitor A': 28, 'Competitor B': 27, 'Competitor C': 23 },
    { month: 'Mar', 'Your Brand': 28, 'Competitor A': 25, 'Competitor B': 25, 'Competitor C': 22 },
    { month: 'Apr', 'Your Brand': 26, 'Competitor A': 30, 'Competitor B': 22, 'Competitor C': 22 },
    { month: 'May', 'Your Brand': 32, 'Competitor A': 28, 'Competitor B': 20, 'Competitor C': 20 },
    { month: 'Jun', 'Your Brand': 35, 'Competitor A': 28, 'Competitor B': 22, 'Competitor C': 15 },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "suggestions", label: "Suggestions", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "competitors", label: "Competitors", icon: <Users className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <GitBranch className="w-4 h-4" /> },
  ]
  const handleNavigation = (path: string) => {
    // Implement navigation logic here
    console.log(`Navigating to ${path}`)
  }

    return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black text-white">
        <div
          className="absolute -inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center pt-24 pb-8">
          <motion.h1
            className="text-5xl md:text-7xl font-normal tracking-tighter mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Optimization Engine
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-medium text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Turn insights into action with AI-powered suggestions.
          </motion.p>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 py-8 relative z-20">
        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
      >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {scores.map((score) => (
                <ScoreCard key={score.engine} title={score.engine} value={score.score} delta={score.delta} trend={score.trend} />
              ))}
            </div>
            <OpportunityTable opportunities={opportunities} />
          </motion.div>
        )}

        {activeTab === "suggestions" && (
        <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((s) => (
                <SuggestionCard key={s.id} {...s} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "competitors" && (
          <motion.div 
            key="competitors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MarketShareChart data={marketShare} historicalData={historicalMarketShare} />
          </motion.div>
        )}

        {activeTab === 'integrations' && (
          <motion.div 
            key="integrations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IntegrationTab />
          </motion.div>
        )}
      </div>
    </div>
  )
}

const IntegrationTab = () => {
  const integrations = [
    { name: 'Jira', description: 'Create issues from suggestions.', icon: <ClipboardList className="w-6 h-6" /> },
    { name: 'Notion', description: 'Sync suggestions to your database.', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Azure DevOps', description: 'Create work items for your team.', icon: <Users className="w-6 h-6" /> },
    { name: 'GitHub', description: 'Track fixes with repository issues.', icon: <GitBranch className="w-6 h-6" /> },
  ];

  const fixes = [
    { id: 'FIX-001', description: 'Homepage title too long', status: 'To Do', priority: 'High' },
    { id: 'FIX-002', description: 'Missing alt-text on hero image', status: 'In Progress', priority: 'Medium' },
    { id: 'FIX-003', description: 'Add FAQ schema to pricing page', status: 'Done', priority: 'High' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-8">
      <div>
        <h3 className="text-2xl font-normal text-gray-900 mb-4">Connect Your Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map(integration => (
            <div key={integration.name} className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center hover:bg-gray-100 transition-colors">
              <div className="text-purple-600 mb-4">{integration.icon}</div>
              <h4 className="font-normal text-gray-900 mb-2">{integration.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors mt-auto">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-normal text-gray-900 mb-4">Recommendation Fixes</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Priority</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fixes.map(fix => (
                <tr key={fix.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-purple-600">{fix.id}</td>
                  <td className="px-6 py-4 text-gray-900">{fix.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      fix.status === 'To Do' ? 'bg-yellow-100 text-yellow-800' :
                      fix.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fix.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  <span className={`font-semibold ${
                      fix.priority === 'High' ? 'text-red-600' : 'text-yellow-500'
                    }`}>
                      {fix.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-purple-600 hover:text-purple-500 font-semibold">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

