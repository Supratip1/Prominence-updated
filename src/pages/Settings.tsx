import React, { useState } from 'react';
import { User, Key, Globe, Video, Mic, Check, X } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'domain', name: 'Custom Domain', icon: Globe },
    { id: 'reports', name: 'Weekly Video Reports', icon: Video },
    { id: 'voice', name: 'Voice Summaries', icon: Mic },
  ];

  const integrations = [
    {
      name: 'Slack Notifications',
      description: 'Get alerts when visibility changes',
      connected: true,
    },
    {
      name: 'Webhook Integration',
      description: 'Send data to your systems',
      connected: false,
    },
    {
      name: 'Google Analytics',
      description: 'Track traffic from AI mentions',
      connected: true,
    },
    {
      name: 'Zapier',
      description: 'Automate workflows',
      connected: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-graphite tracking-tight">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your account and integration preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-graphite'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-graphite">
                    Profile Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Sarah Johnson"
                        className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="sarah@acmecorp.com"
                        className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        defaultValue="Acme Corporation"
                        className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option>UTC</option>
                        <option>America/New_York</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-graphite">
                    API Keys
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-graphite">
                            Production API Key
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            sk-prod-...7a9b
                          </p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border border-platinum rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-graphite">
                            Test API Key
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Create a test key for development
                          </p>
                        </div>
                        <Button size="sm">
                          Create Test Key
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'domain' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-graphite">
                    Custom Domain
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        Custom Domain
                      </label>
                      <input
                        type="text"
                        placeholder="analytics.yourcompany.com"
                        className="w-full px-3 py-2 border border-platinum rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">
                        DNS Configuration
                      </h3>
                      <p className="text-sm text-blue-700">
                        Add these DNS records to your domain:
                      </p>
                      <div className="mt-2 text-sm font-mono text-blue-800">
                        CNAME analytics 76.76.19.61
                      </div>
                    </div>
                    <Button>Save Domain</Button>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-graphite">
                    Weekly Video Reports
                  </h2>
                  <div className="space-y-4">
                    {integrations.map((integration, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-platinum rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-graphite">
                            {integration.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {integration.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {integration.connected ? (
                            <div className="flex items-center space-x-2 text-success">
                              <Check className="h-4 w-4" />
                              <span className="text-sm font-medium">Connected</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-400">
                              <X className="h-4 w-4" />
                              <span className="text-sm">Not connected</span>
                            </div>
                          )}
                          <Button
                            variant={integration.connected ? 'secondary' : 'primary'}
                            size="sm"
                          >
                            {integration.connected ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'voice' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-graphite">
                    Voice Summaries
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-platinum rounded-lg">
                      <div>
                        <h3 className="font-medium text-graphite">
                          Weekly Voice Summaries
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Receive AI-generated voice summaries of your visibility performance
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}