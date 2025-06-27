import React from "react";

const steps = [
  {
    title: "See Your Entire Digital Footprint",
    description: "Prominence automatically discovers all your brand's assets across the web, so you never miss an opportunity.",
    placeholder: true,
  },
  {
    title: "Track & Analyze Visibility",
    description: "Monitor your AI search presence and get actionable insights on what's working and what's not—all in one dashboard.",
    placeholder: true,
  },
  {
    title: "Optimize for AI Search",
    description: "Get clear, step-by-step recommendations to boost your brand's visibility in AI-powered search results.",
    placeholder: true,
  },
  {
    title: "Stay Ahead of Competitors",
    description: "Benchmark your performance and spot new opportunities before anyone else.",
    placeholder: true,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="our-services" className="pt-0 pb-20 bg-white text-black w-full -mt-48 md:mt-24">
      <div className="relative max-w-screen-xl mx-auto px-4 flex flex-col items-center" style={{paddingTop: 0, marginTop: 0}}>
        {/* Vertical lines */}
        <div className="absolute left-0 -top-6 h-[calc(100%+1.5rem)] w-px bg-gray-200 opacity-60" style={{ zIndex: 1 }} />
        <div className="absolute right-0 -top-6 h-[calc(100%+1.5rem)] w-px bg-gray-200 opacity-60" style={{ zIndex: 1 }} />
        {/* Tagline and Heading */}
        <div className="relative z-10 flex flex-col items-center mb-10">
          <span className="uppercase text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">The Prominence Workflow</span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-black text-center">
            How Prominence Works
          </h2>
        </div>
        <div className="flex flex-col gap-16 w-full">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Left: Text */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-3 text-black font-display">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-base sm:text-lg max-w-md">
                  {step.description}
                </p>
              </div>
              {/* Right: Placeholder Image */}
              <div className="flex-1 w-full flex items-center justify-center">
                <div className="w-full max-w-md aspect-video bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 text-lg font-medium relative">
                  <span className="absolute">Screenshot coming soon</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 