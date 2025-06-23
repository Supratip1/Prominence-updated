import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Target } from 'lucide-react';
import Button from '../components/UI/Button';

export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    workspaceName: '',
    primaryDomain: '',
    industry: '',
    timezone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Target className="h-7 w-7 text-gray-900" />
              <span className="text-xl font-normal text-gray-900">
                GEO Analytics
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Log in</Button>
              <Button>Get GEO free</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Column */}
        <div className="flex-1 flex flex-col justify-center px-12 lg:px-24 py-16">
          <div className="max-w-lg">
            <h1 className="text-5xl font-normal text-gray-900 mb-6 leading-tight">
              The AI visibility workspace that works for you.
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              One place where teams track every mention, automate the analysis, and get insights done.
            </p>

            {/* Animated Search Bar */}
            <div className="relative mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 mb-2 font-medium">
                      "What's the best CRM for startups?"
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-xs text-gray-500">
                        AI is analysing your brand mentions...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button size="lg">
                Get GEO free
              </Button>
              <Button variant="secondary" size="lg">
                Request a demo
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col justify-center px-12 lg:px-24 py-16 bg-white border-l border-gray-200">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-normal text-gray-900 mb-2">
                Create your workspace
              </h2>
              <p className="text-gray-600">
                Get started with AI visibility tracking in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={formData.workspaceName}
                  onChange={(e) =>
                    setFormData({ ...formData, workspaceName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Acme Corp Marketing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Domain
                </label>
                <input
                  type="url"
                  value={formData.primaryDomain}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryDomain: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="https://acmecorp.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  required
                >
                  <option value="">Select timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>

              <Button size="lg" className="w-full">
                Create and track
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}