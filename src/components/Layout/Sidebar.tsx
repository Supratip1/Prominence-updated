import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Search, 
  Settings, 
  CreditCard, 
  Target 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Keywords', href: '/keywords', icon: Search },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-platinum h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Target className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-graphite tracking-tight">
            GEO Analytics
          </span>
        </div>
      </div>
      
      <nav className="px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-graphite'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}