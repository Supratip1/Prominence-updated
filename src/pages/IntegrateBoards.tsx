import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Header from '../components/Layout/Header';

const IntegrateBoards = () => (
  <>
    <Header />
    <div className="pt-20">
      <DashboardLayout pageTitle="">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
            Connect your AEO analysis with project management tools like Jira, Trello, or Asana to streamline optimization workflows.
          </p>
          <div className="text-gray-400 text-lg">Feature coming soon.</div>
        </div>
      </DashboardLayout>
    </div>
  </>
);

export default IntegrateBoards; 