"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Download, ArrowLeft, BarChart3, FileText, BarChart, Target, TrendingUp as TrendingUpIcon, Users, CheckCircle, Bug, BookOpen, ClipboardList, MessageSquare, AlertTriangle, Settings, GitBranch, Code, Database, Calendar, CheckSquare, FileCheck, GitPullRequest, GitCommit, GitMerge } from "lucide-react"
import { motion } from "framer-motion"

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
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
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
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1500 ease-out"
            style={{ width: `${isVisible ? value : 0}%` }}
          />
        </div>
      </div>

      {/* Minimal sparkline */}
      <div className="h-6 flex items-end space-x-0.5">
        {trend.map((point, index) => (
          <div
            key={index}
            className="flex-1 bg-blue-200 rounded-sm transition-all duration-1000 ease-out"
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
      <h3 className="text-lg font-semibold text-gray-900">Optimization Opportunities</h3>
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
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:border-gray-300">
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
        <div className="text-gray-600">
          Impact: <span className="font-semibold text-blue-600">{impact}</span>
        </div>
        <div className="text-gray-600">
          Effort: <span className="font-semibold text-blue-600 capitalize">{effort}</span>
        </div>
      </div>
    </div>
  )
}

const MarketShareChart = ({ data }: { data: Series[] }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const total = data.reduce((sum, item) => sum + item.sov, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Market Share</h3>
        <p className="text-sm text-gray-600 mt-1">Share of AI engine visibility</p>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  <AnimatedCounter value={item.sov} duration={1500} />%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-1500 ease-out"
                style={{
                  backgroundColor: item.color,
                  width: `${isVisible ? (item.sov / total) * 100 : 0}%`,
                  transitionDelay: `${index * 200}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Optimization() {
  const [currentView, setCurrentView] = useState("optimization")
  const [selectedPlatform, setSelectedPlatform] = useState<'jira' | 'notion' | 'azure'>('jira')
  const [assets] = useState([
    { id: "1", title: "AI Integration Best Practices", type: "guide" },
    { id: "2", title: "Machine Learning Implementation", type: "tutorial" },
    { id: "3", title: "Data Science Methodology", type: "framework" },
    { id: "4", title: "Neural Network Architecture", type: "technical" },
    { id: "5", title: "Automation Strategy Guide", type: "strategy" },
    { id: "6", title: "Cloud AI Platform Setup", type: "implementation" },
  ])

  const handleNavigation = (path: string) => {
    setCurrentView(path)
  }

  if (!assets.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">No data available</h2>
            <p className="text-gray-400">Run an analysis to see optimization opportunities.</p>
          </div>
          <button
            onClick={() => handleNavigation("analysis")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
          >
            Start Analysis
          </button>
        </div>
      </div>
    )
  }

  const engineScores: EngineScore[] = [
    { engine: "ChatGPT", score: 72, delta: -3, trend: [65, 68, 70, 69, 72, 70, 72] },
    { engine: "Claude", score: 68, delta: +4, trend: [60, 62, 64, 66, 65, 67, 68] },
    { engine: "Gemini", score: 75, delta: 0, trend: [70, 72, 75, 73, 75, 74, 75] },
    { engine: "Perplexity", score: 80, delta: +5, trend: [70, 72, 75, 77, 78, 79, 80] },
  ]

  const opportunities: OpportunityRow[] = assets.slice(0, 6).map((a, idx) => ({
    id: a.id,
    item: a.title,
    engine: "chatgpt",
    score: 55 + idx * 2,
    competitor: 80 + idx,
    delta: 80 + idx - (55 + idx * 2),
  }))

  const suggestions: Suggestion[] = assets.slice(0, 6).map((a, i) => ({
    id: `${a.id}-${i}`,
    assetId: a.id,
    type: i % 2 ? "content" : "technical",
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
    suggestion: `Optimize ${a.title.split(" ").slice(0, 3).join(" ")} for enhanced semantic understanding and discoverability`,
    impact: `${15 + i * 3}-${25 + i * 3}% improvement`,
    effort: i % 2 ? "low" : "medium",
  }))

  const competitorData: Series[] = [
    { name: "Your Brand", sov: 23, color: "#10B981" },
    { name: "Competitor A", sov: 35, color: "#EF4444" },
    { name: "Competitor B", sov: 29, color: "#F59E0B" },
    { name: "Others", sov: 13, color: "#6B7280" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <motion.div 
        className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#adff2f]/5 via-transparent to-[#7cfc00]/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#adff2f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7cfc00]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={itemVariants}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #adff2f 50%, #7cfc00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Scorecard & Optimization
            </motion.h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 mt-16">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Score Cards */}
          <motion.section 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black mb-2">Scorecards</h2>
              <p className="text-lg text-gray-600">AI Engine Performance Metrics</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {engineScores.map((score) => (
                <ScoreCard
                  key={score.engine}
                  title={score.engine}
                  value={score.score}
                  delta={score.delta}
                  trend={score.trend}
                />
              ))}
            </div>
          </motion.section>

          {/* Main Content Grid */}
          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            variants={itemVariants}
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <OpportunityTable opportunities={opportunities} />

              {/* Recommendations */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                  <p className="text-sm text-gray-600">AI-powered optimization suggestions</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {suggestions.slice(0, 4).map((suggestion) => (
                    <SuggestionCard key={suggestion.id} {...suggestion} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <MarketShareChart data={competitorData} />
              
              {/* Integrate with Platform Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Integrate with</h3>
                  <p className="text-sm text-gray-600 mt-1">Create tickets from optimization recommendations</p>
                </div>

                {/* Platform Selection */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setSelectedPlatform('jira')}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedPlatform === 'jira' 
                          ? 'bg-blue-50 border-blue-300 text-blue-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Bug className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium">Jira</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedPlatform('notion')}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedPlatform === 'notion' 
                          ? 'bg-black border-gray-300 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium">Notion</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedPlatform('azure')}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedPlatform === 'azure' 
                          ? 'bg-blue-50 border-blue-300 text-blue-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <GitBranch className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium">Azure</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Dynamic Content Based on Selection */}
                {selectedPlatform === 'jira' && (
                  <div className="space-y-4">
                    {/* Jira Connection Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Connected to Jira</p>
                          <p className="text-xs text-gray-600">company-name.atlassian.net</p>
                        </div>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Change
                      </button>
                    </div>

                    {/* Jira Integration Options */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">High Priority</p>
                            <p className="text-xs text-gray-600">Create tickets for high-impact items</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (3)
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Medium Priority</p>
                            <p className="text-xs text-gray-600">Create tickets for medium-impact items</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (2)
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Low Priority</p>
                            <p className="text-xs text-gray-600">Create tickets for low-impact items</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (1)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatform === 'notion' && (
                  <div className="space-y-4">
                    {/* Notion Connection Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Connected to Notion</p>
                          <p className="text-xs text-gray-600">company-workspace.notion.site</p>
                        </div>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Change
                      </button>
                    </div>

                    {/* Notion Integration Options */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-black/5 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Product Backlog</p>
                            <p className="text-xs text-gray-600">Add items to product backlog</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-medium rounded-md transition-colors">
                          Add (3)
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Task Database</p>
                            <p className="text-xs text-gray-600">Create tasks in database</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (2)
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Documentation</p>
                            <p className="text-xs text-gray-600">Add to docs page</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                          Add (1)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatform === 'azure' && (
                  <div className="space-y-4">
                    {/* Azure Connection Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Connected to Azure DevOps</p>
                          <p className="text-xs text-gray-600">dev.azure.com/company</p>
                        </div>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Change
                      </button>
                    </div>

                    {/* Azure Integration Options */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">User Stories</p>
                            <p className="text-xs text-gray-600">Create user stories</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (3)
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Bug className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Bugs</p>
                            <p className="text-xs text-gray-600">Create bug work items</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (2)
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Code className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Tasks</p>
                            <p className="text-xs text-gray-600">Create development tasks</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors">
                          Create (1)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Common Bulk Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPlatform === 'jira' && 'Create All Tickets'}
                        {selectedPlatform === 'notion' && 'Add All Items'}
                        {selectedPlatform === 'azure' && 'Create All Work Items'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedPlatform === 'jira' && 'Generate Jira tickets for all recommendations'}
                        {selectedPlatform === 'notion' && 'Add all recommendations to Notion'}
                        {selectedPlatform === 'azure' && 'Create Azure DevOps work items for all recommendations'}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
                      {selectedPlatform === 'jira' && 'Create All (6)'}
                      {selectedPlatform === 'notion' && 'Add All (6)'}
                      {selectedPlatform === 'azure' && 'Create All (6)'}
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-3">Recent Activity</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {selectedPlatform === 'jira' && '3 tickets created 2 hours ago'}
                        {selectedPlatform === 'notion' && '3 items added to Notion 2 hours ago'}
                        {selectedPlatform === 'azure' && '3 work items created 2 hours ago'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>
                        {selectedPlatform === 'jira' && 'Jira sync completed'}
                        {selectedPlatform === 'notion' && 'Notion sync completed'}
                        {selectedPlatform === 'azure' && 'Azure DevOps sync completed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons at Bottom */}
          <motion.div 
            className="flex items-center justify-center space-x-4 pt-8 border-t border-gray-200"
            variants={itemVariants}
          >
            <button 
              onClick={() => {
                // Export functionality
                const data = {
                  engineScores,
                  opportunities,
                  suggestions,
                  competitorData
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `optimization-report-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              <span>Back to Analysis</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
