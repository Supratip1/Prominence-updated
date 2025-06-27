import React, { useState } from 'react';
import Modal from '../components/UI/Modal';
import { Info } from 'lucide-react';

// Mock crawlability data for demo; replace with real data as needed
const mockCrawlability = {
  robots_txt: {
    chatbot_access: {
      ChatGPT: { allowed: false, disallowed_paths: ['/private', '/admin'] },
      Gemini: { allowed: true, disallowed_paths: [] },
      Perplexity: { allowed: false, disallowed_paths: ['/secret'] },
    },
  },
};

const bots = [
  { name: 'ChatGPT', key: 'ChatGPT' },
  { name: 'Gemini', key: 'Gemini' },
  { name: 'Perplexity', key: 'Perplexity' },
];

const AICrawlerAccess = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const access = mockCrawlability.robots_txt.chatbot_access;

  return (
    <div className="min-h-screen bg-white flex flex-col md:ml-64">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-normal text-black text-center flex-1">AI Crawler Access</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {bots.map(bot => (
          <div key={bot.key} className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex flex-col relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-normal text-black">{bot.name}</h3>
              <button onClick={() => setActiveModal(bot.key)} className="text-gray-400 hover:text-black"><Info className="w-5 h-5" /></button>
            </div>
            <div className={`mb-2 text-lg font-semibold ${access[bot.key].allowed ? 'text-green-600' : 'text-red-600'}`}>{access[bot.key].allowed ? 'Allowed' : 'Blocked'}</div>
            {!access[bot.key].allowed && (
              <div className="text-gray-500 text-sm">Some paths blocked</div>
            )}
          </div>
        ))}
      </div>
      {/* Modals for each bot */}
      {bots.map(bot => (
        <Modal key={bot.key} isOpen={activeModal === bot.key} onClose={() => setActiveModal(null)}>
          <h2 className="text-xl font-semibold mb-4">{bot.name} Access Details</h2>
          <div>
            <div className="mb-2 text-black font-medium">Status: <span className={access[bot.key].allowed ? 'text-green-600' : 'text-red-600'}>{access[bot.key].allowed ? 'Allowed' : 'Blocked'}</span></div>
            {access[bot.key].disallowed_paths.length > 0 ? (
              <div>
                <div className="mb-2 text-black font-medium">Blocked Paths:</div>
                <ul className="text-sm text-red-600">
                  {access[bot.key].disallowed_paths.map((path: string, idx: number) => (
                    <li key={idx}>• {path}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No blocked paths</div>
            )}
          </div>
        </Modal>
      ))}
    </div>
  );
};

export default AICrawlerAccess; 