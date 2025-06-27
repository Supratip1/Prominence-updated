import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC<{ children: React.ReactNode; pageTitle: string }> = ({ children, pageTitle }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex"><Sidebar /></div>
      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-white border-r border-gray-200 z-50 flex flex-col shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-center relative">
            {/* Hamburger menu on left for mobile */}
            <button
              className="md:hidden text-black p-2 rounded-lg hover:bg-gray-100 focus:outline-none absolute left-0 top-1/2 -translate-y-1/2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-7 h-7" />
            </button>
            {/* Page title absolutely centered */}
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-normal text-black text-center font-display tracking-tight w-full pointer-events-none select-none">
              {pageTitle}
            </h1>
          </div>
        </div>
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout; 