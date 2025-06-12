import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;