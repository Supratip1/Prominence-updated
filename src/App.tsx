import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnalysisProvider } from './contexts/AnalysisContext'
import Onboarding from './pages/Onboarding'
import HowItWorksSection from './components/HowItWorksSection'
import BenefitsSection from './components/BenefitsSection'
import EarlyAdopterSection from './components/EarlyAdopterSection'
import PricingSection from './components/PricingSection'
import Footer from './components/Footer'
import ProminenceChatWidget from './components/ProminenceChatWidget'
import BoltWidget from './components/ChartWidget'
import ModelScores from './pages/ModelScores'
import TrackCompetitors from './pages/TrackCompetitors'
import IntegrateBoards from './pages/IntegrateBoards'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analysis = lazy(() => import('./pages/Analysis'))
const Optimization = lazy(() => import('./pages/Optimization'))
const Signup = lazy(() => import('./pages/Signup'))
const AEOAnalysis = lazy(() => import('./pages/AEOAnalysis'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white/80">Loading...</p>
    </div>
  </div>
)

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-white/80 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function HomePage() {
  return (
    <>
      <Dashboard />
      <HowItWorksSection />
      <BenefitsSection />
      <EarlyAdopterSection />
      <PricingSection />
      <Footer />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AnalysisProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/optimization" element={<Optimization />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/aeo-analysis" element={<AEOAnalysis />} />
              <Route path="/model-scores" element={<ModelScores />} />
              <Route path="/track-competitors" element={<TrackCompetitors />} />
              <Route path="/integrate-boards" element={<IntegrateBoards />} />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <ProminenceChatWidget />
            <BoltWidget />
          </Suspense>
        </Router>
      </AnalysisProvider>
    </ErrorBoundary>
  )
}

export default App
