import React from "react"
import { TrendingUp, Lightbulb, Calendar, Users, BarChart3, Search } from "lucide-react"

const BenefitsSection = () => {
  return (
    <section id="key-benefits" className="py-20 sm:py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
              Benefits
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            The Key Benefits of AI for Your Business Growth
          </h2>
          <p className="mt-6 text-base sm:text-lg text-gray-400">
            Discover how our platform enhances your online presence, reduces costs, and drives business growth with smarter, faster processes.
          </p>
        </div>

        <div className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Benefit 1: Boost LLM & AI Search Rankings */}
          <div className="bg-gradient-to-b from-black to-purple-900/20 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-purple-800/30">
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-8 h-8 lg:w-6 lg:h-6 bg-white/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Boost LLM & AI Search Rankings</h3>
            </div>
            <p className="text-white text-sm lg:text-base">
              Track and improve your brand's ranking in AI-powered search engines.
            </p>
          </div>

          {/* Benefit 2: AI-Optimized Content */}
          <div className="bg-gradient-to-b from-black to-purple-900/20 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-purple-800/30">
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-8 h-8 lg:w-6 lg:h-6 bg-white/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white">AI-Optimized Content</h3>
            </div>
            <p className="text-white text-sm lg:text-base">
              Get AI-driven recommendations to optimize your content.
            </p>
          </div>

          {/* Benefit 3: Continuous Brand Monitoring */}
          <div className="bg-gradient-to-b from-black to-purple-900/20 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-purple-800/30">
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-8 h-8 lg:w-6 lg:h-6 bg-white/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Continuous Brand Monitoring</h3>
            </div>
            <p className="text-white text-sm lg:text-base">
              Monitor AI responses and get alerts for new mentions.
            </p>
          </div>

          {/* Benefit 4: Competitor Intelligence */}
          <div className="bg-gradient-to-b from-black to-purple-900/20 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-purple-800/30">
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-8 h-8 lg:w-6 lg:h-6 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Competitor Intelligence</h3>
            </div>
            <p className="text-white text-sm lg:text-base">
              Benchmark your performance against competitors.
            </p>
          </div>

          {/* Benefit 5: Actionable Analytics */}
          <div className="bg-gradient-to-b from-black to-purple-900/20 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-purple-800/30">
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-8 h-8 lg:w-6 lg:h-6 bg-white/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Actionable Analytics</h3>
            </div>
            <p className="text-white text-sm lg:text-base">
              Get clear insights and ROI tracking.
            </p>
          </div>

          {/* Benefit 6: Automated Asset Discovery */}
          <div className="bg-gradient-to-b from-black to-purple-900/20 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-purple-800/30">
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-8 h-8 lg:w-6 lg:h-6 bg-white/10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Automated Asset Discovery</h3>
            </div>
            <p className="text-white text-sm lg:text-base">
              Automatically discover your brand's digital footprint.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection 