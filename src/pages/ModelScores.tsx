import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { normalizeUrl } from '../utils/hooks';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Modal from '../components/UI/Modal';
import { Info, ShieldCheck, ShieldX } from 'lucide-react';
import React from 'react';

const ModelScores = () => {
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const url = normalizeUrl(rawUrl);
  const queryClient = useQueryClient();
  const analysisData = queryClient.getQueryData(['aeo-analysis', url]) as any;
  const chatbotAccess = analysisData?.audit_report?.crawlability?.robots_txt?.chatbot_access || {};
  const modelScores = analysisData?.audit_report?.model_scores || {};
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  if (!analysisData || !analysisData.audit_report) {
    return (
      <DashboardLayout pageTitle="Scores on Different Models">
        <div className="max-w-4xl mx-auto mt-16 mb-8 text-center text-gray-400">
          No analysis data found. Please run an analysis.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Scores on Different Models">
      <div className="max-w-4xl mx-auto mt-16 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-0 mb-10">
          {Object.keys(chatbotAccess).length === 0 ? (
            <div className="text-gray-400 text-center col-span-3">No model access info found.</div>
          ) : (
            Object.entries(chatbotAccess).map(([model, info]: [string, any]) => {
              const allowed = info.allowed;
              const blockedPaths = info.disallowed_paths || [];
              return (
                <div
                  key={model}
                  className={`relative bg-white rounded-2xl border-2 shadow-sm p-6 flex flex-col items-center transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${allowed ? 'border-green-200' : 'border-red-200'}`}
                >
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setActiveModal(model)}
                      className="text-gray-400 hover:text-black"
                      aria-label="Blocked Paths Info"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    {allowed ? (
                      <ShieldCheck className="w-6 h-6 text-green-500" />
                    ) : (
                      <ShieldX className="w-6 h-6 text-red-500" />
                    )}
                    <span className={`text-lg font-bold ${allowed ? 'text-green-600' : 'text-red-600'}`}>{allowed ? 'Allowed' : 'Blocked'}</span>
                  </div>
                  {modelScores[model] !== undefined && (
                    <div className="text-4xl font-bold text-blue-700 mb-1">{modelScores[model]}</div>
                  )}
                  <div className="text-xs text-gray-500 mb-1">AEO Score</div>
                  <h3 className="text-xl font-normal text-black mb-2 mt-2">{model}</h3>
                </div>
              );
            })
          )}
        </div>
        {/* Modal for blocked paths */}
        {Object.entries(chatbotAccess).map(([model, info]: [string, any]) => (
          <Modal key={model} isOpen={activeModal === model} onClose={() => setActiveModal(null)}>
            <h2 className="text-xl font-semibold mb-4">Blocked Paths for {model}</h2>
            <ul className="text-gray-700 text-base max-h-60 overflow-y-auto pr-2">
              {info.disallowed_paths && info.disallowed_paths.length > 0 ? (
                info.disallowed_paths.map((path: string, idx: number) => (
                  <li key={idx}>{path}</li>
                ))
              ) : (
                <li>No blocked paths.</li>
              )}
            </ul>
          </Modal>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ModelScores; 