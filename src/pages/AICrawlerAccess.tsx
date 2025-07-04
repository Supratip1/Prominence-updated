import React, { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { normalizeUrl } from '../utils/hooks';
import Modal from '../components/UI/Modal';
import { Info, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Header from '../components/Layout/Header';

const AICrawlerAccess = () => {
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const url = normalizeUrl(rawUrl);
  const queryClient = useQueryClient();
  const analysisData = queryClient.getQueryData(['aeo-analysis', url]) as any;
  
  // Extract real chatbot access data from enhanced backend
  const chatbotAccess = analysisData?.crawlability?.robots_txt?.chatbot_access || 
                       analysisData?.audit_report?.crawlability?.robots_txt?.chatbot_access || {};
  
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Define the bots we want to show
  const bots = [
    { name: 'ChatGPT', key: 'ChatGPT', description: 'OpenAI\'s web crawler for training' },
    { name: 'Gemini', key: 'Gemini', description: 'Google\'s AI model crawler' },
    { name: 'Perplexity', key: 'Perplexity', description: 'Perplexity AI search crawler' },
  ];

  if (!analysisData) {
    return (
      <>
        <Header />
        <div className="pt-20">
          <DashboardLayout pageTitle="AI Crawler Access">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h1 className="text-2xl font-bold mb-4">AI Crawler Access</h1>
              <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
                No analysis data found. Please run an analysis first to see AI crawler access information.
              </p>
            </div>
          </DashboardLayout>
        </div>
      </>
    );
  }

  const getAccessStatus = (botKey: string) => {
    const access = chatbotAccess[botKey];
    if (!access) {
      return {
        allowed: false,
        disallowed_paths: [],
        status: 'Unknown',
        description: 'No access information available'
      };
    }
    
    return {
      allowed: access.allowed || false,
      disallowed_paths: access.disallowed_paths || [],
      status: access.allowed ? 'Allowed' : 'Blocked',
      description: access.allowed ? 'AI can crawl your content' : 'AI access is restricted'
    };
  };

  const getStatusColor = (allowed: boolean) => {
    return allowed ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBgColor = (allowed: boolean) => {
    return allowed ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <>
      <Header />
      <div className="pt-20">
        <DashboardLayout pageTitle="AI Crawler Access">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">AI Crawler Access</h1>
              <p className="text-gray-600">Monitor how accessible your site is to AI models and chatbots for training and search results</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Overall AI Access Status</h3>
                  <p className="text-gray-600">
                    {Object.values(chatbotAccess).filter((access: any) => access.allowed).length} of {Object.keys(chatbotAccess).length} AI models can access your content
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-black">
                    {Object.keys(chatbotAccess).length > 0 
                      ? Math.round((Object.values(chatbotAccess).filter((access: any) => access.allowed).length / Object.keys(chatbotAccess).length) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Access Rate</div>
                </div>
              </div>
            </div>

            {/* AI Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bots.map(bot => {
                const access = getAccessStatus(bot.key);
                
                return (
                  <div key={bot.key} className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-normal text-black">{bot.name}</h3>
                      <button 
                        onClick={() => setActiveModal(bot.key)} 
                        className="text-gray-400 hover:text-black"
                        aria-label={`${bot.name} Access Details`}
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`mb-2 text-lg font-semibold ${getStatusColor(access.allowed)}`}>
                        {access.status}
                      </div>
                      <div className="text-gray-500 text-sm">{bot.description}</div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(access.allowed)} ${getStatusColor(access.allowed)}`}>
                        {access.allowed ? (
                          <ShieldCheck className="w-4 h-4 mr-2" />
                        ) : (
                          <ShieldX className="w-4 h-4 mr-2" />
                        )}
                        {access.allowed ? 'Accessible' : 'Restricted'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Data Message */}
            {Object.keys(chatbotAccess).length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow p-8 text-center mt-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI Crawler Data Available</h3>
                <p className="text-gray-600 mb-4">
                  The analysis didn't find AI crawler access information. This could be because:
                </p>
                <ul className="text-gray-600 text-left max-w-md mx-auto space-y-1">
                  <li>• No robots.txt file was found</li>
                  <li>• robots.txt doesn't specify AI crawler rules</li>
                  <li>• Analysis is still processing</li>
                </ul>
              </div>
            )}

            {/* Modals for each bot */}
            {bots.map(bot => {
              const access = getAccessStatus(bot.key);
              
              return (
                <Modal key={bot.key} isOpen={activeModal === bot.key} onClose={() => setActiveModal(null)}>
                  <h2 className="text-xl font-semibold mb-4">{bot.name} Access Details</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-black font-medium">Status: 
                        <span className={`ml-2 ${getStatusColor(access.allowed)}`}>
                          {access.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{access.description}</p>
                    </div>
                    
                    {access.disallowed_paths.length > 0 ? (
                      <div>
                        <div className="mb-2 text-black font-medium">Blocked Paths:</div>
                        <ul className="text-sm text-red-600 bg-red-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                          {access.disallowed_paths.map((path: string, idx: number) => (
                            <li key={idx} className="mb-1">• {path}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {access.allowed ? 'No blocked paths - full access granted' : 'No specific blocked paths found'}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-4">
                      <strong>Note:</strong> AI crawler access affects how your content appears in AI-powered search results and training data.
                    </div>
                  </div>
                </Modal>
              );
            })}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default AICrawlerAccess;
