import React from "react";

export default function EarlyAdopterSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-[#f7f8fa] relative overflow-visible">
      {/* Vertical lines - guaranteed visible */}
      <div className="absolute left-0 top-0 h-screen w-[2px] bg-gray-500 opacity-80 z-40 pointer-events-none" />
      <div className="absolute right-0 top-0 h-screen w-[2px] bg-gray-500 opacity-80 z-40 pointer-events-none" />
      <div className="relative z-50 w-full max-w-screen-lg mx-auto flex flex-col items-center justify-center py-32 px-4">
        <span className="uppercase text-sm font-semibold tracking-widest text-gray-400 mb-8">Early Access</span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-black text-center mb-8 leading-tight">
          Ready to be an early adopter?
        </h2>
        <p className="text-lg sm:text-2xl text-gray-600 text-center mb-12 max-w-2xl">
          Join the select group of companies positioning themselves for the AI search revolution. Early access users get lifetime pricing and priority support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <button className="bg-black text-white text-lg sm:text-xl font-semibold rounded-full px-10 py-5 shadow-lg hover:bg-gray-900 transition mb-2 sm:mb-0">
            Get Early Access
          </button>
          <button className="bg-white border border-gray-300 text-black text-lg sm:text-xl font-semibold rounded-full px-10 py-5 hover:bg-gray-100 transition">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
} 