import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-25 relative">
      <Header />
      <main id="main-content" role="main" tabIndex={-1}>
        <Outlet />
      </main>

      {/* ✅ Bolt Badge */}
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 hover:scale-110 transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded bg-red-500 p-2"
        aria-label="Built with Bolt.new - Opens in new tab"
      >
        <img
          src="/bolt-badge.png"
          alt="Built with Bolt.new"
          className="w-16 h-auto"
          loading="lazy"
        />
      </a>
    </div>
  );
}
