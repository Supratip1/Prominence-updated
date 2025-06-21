import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnalysisProvider } from './contexts/AnalysisContext'
import Layout from './components/Layout/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Optimization from './pages/Optimization'

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />

          {/* everything under Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="optimization" element={<Optimization />} />
          </Route>
        </Routes>
      </Router>
    </AnalysisProvider>
  )
}

export default App
