import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BarChart2, Users, Settings } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClose) onClose();
  };
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-end">
          <img 
            src="/logos/mainlogo.png" 
            alt="Prominence Logo" 
            className="h-8 w-auto select-none"
          />
        </div>
      </div>
      <nav className="flex flex-col gap-3 mt-2 px-4">
        <NavLink
          to="/aeo-analysis"
          onClick={handleClick}
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-100 text-black shadow-sm border border-gray-200 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold relative after:content-[" "] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-2 after:bg-black after:rounded-r-xl'
              : 'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl'
          }
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/optimization"
          onClick={handleClick}
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-100 text-black shadow-sm border border-gray-200 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold relative after:content-[" "] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-2 after:bg-black after:rounded-r-xl'
              : 'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl'
          }
        >
          <BarChart2 className="w-5 h-5" />
          <span>Optimization</span>
        </NavLink>
        <NavLink
          to="/track-competitors"
          onClick={handleClick}
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-100 text-black shadow-sm border border-gray-200 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold relative after:content-[" "] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-2 after:bg-black after:rounded-r-xl'
              : 'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl'
          }
        >
          <Users className="w-5 h-5" />
          <span>Track Competitors</span>
        </NavLink>
        <NavLink
          to="/integrate-boards"
          onClick={handleClick}
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-100 text-black shadow-sm border border-gray-200 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold relative after:content-[" "] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-2 after:bg-black after:rounded-r-xl'
              : 'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl'
          }
        >
          <Settings className="w-5 h-5" />
          <span>Integrate with your boards</span>
        </NavLink>
      </nav>
      <div className="flex-1" />
      <div className="p-4 mb-20">
        <button
          className="flex items-center gap-2 px-4 py-3 text-lg font-normal font-display tracking-tight text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-xl transition-all"
          onClick={() => { navigate('/dashboard'); handleClick(); }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>
    </div>
  );
}