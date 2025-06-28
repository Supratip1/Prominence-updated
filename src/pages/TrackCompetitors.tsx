import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Header from '../components/Layout/Header';

const TrackCompetitors = () => (
  <>
    <Header />
    <div className="pt-20">
      <DashboardLayout pageTitle="Track Competitors">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Track Competitors</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
            Monitor your competitors' AEO performance, compare scores, and get insights to stay ahead in AI-driven search.
          </p>
          <div className="text-gray-400 text-lg">Feature coming soon.</div>
        </div>
      </DashboardLayout>
    </div>
  </>
);

export default TrackCompetitors; 