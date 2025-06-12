import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-25 relative">
      <Header />
      <main>
        <Outlet />
      </main>

      {/* ✅ Bolt Badge */}
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50"
      >
        <img
          src="/bolt-badge.png"
          alt="Built with Bolt.new"
          className="w-12 h-auto"
        />
      </a>
    </div>
  );
}
