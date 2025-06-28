import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, PanelLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

const DashboardLayout: React.FC<{ children: React.ReactNode; pageTitle: string }> = ({ children, pageTitle }) => {
  const location = useLocation();
  const { sidebarOpen, closeSidebar } = useSidebar();
  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex"><Sidebar /></div>
      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeSidebar} />
          <aside className="relative w-64 h-full bg-white border-r border-gray-200 z-50 flex flex-col shadow-xl">
            <Sidebar onClose={closeSidebar} />
          </aside>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-center relative">
            {/* Sidebar toggle for mobile (PanelLeft icon) is now in Header */}
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