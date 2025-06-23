import { Search, Activity, GitCompare, TrendingUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";

const ProminenceWorkflow = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate background color based on scroll position
  const getBackgroundColor = () => {
    const scrollProgress = (scrollY % 1000) / 1000; // Cycle every 1000px
    const hue = 270 + Math.sin(scrollProgress * Math.PI * 2) * 10; // Purple hue with subtle variation
    const saturation = 5 + Math.sin(scrollProgress * Math.PI * 2) * 3; // Very low saturation
    const lightness = 2 + Math.sin(scrollProgress * Math.PI * 2) * 1; // Very dark, close to black
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const features = [
    {
      id: 1,
      icon: <Eye className="w-8 h-8 text-purple-500" />,
      title: "Discover",
      description: "Automatically discover and fetch your digital assets from websites, social media, and other online sources.",
      screenshot: "/screenshots/Assetfetching.png"
    },
    {
      id: 2,
      icon: <Activity className="w-8 h-8 text-green-500" />,
      title: "Score",
      description: "Get comprehensive scoring and analytics to understand your AI visibility performance across different platforms.",
      screenshot: "/screenshots/optimization.png"
    },
    {
      id: 3,
      icon: <Search className="w-8 h-8 text-purple-500" />,
      title: "Analyze", 
      description: "Deep dive into your content performance with detailed analysis and insights for optimization.",
      screenshot: "/screenshots/optimization.png"
    },
    {
      id: 4,
      icon: <GitCompare className="w-8 h-8 text-orange-500" />,
      title: "Compare",
      description: "See how you stack up against competitors across different AI platforms and understand market positioning.",
      screenshot: "/screenshots/competitor.png"
    },
    {
      id: 5,
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      title: "Optimize",
      description: "Get intelligent optimization suggestions and recommendations to improve your AI search visibility.",
      screenshot: "/screenshots/recommendation.png"
    }
  ];

  return (
    <section 
      id="our-services"
      className="text-white w-full transition-colors duration-500"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute -inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)",
        }}
      />
      
      {/* Header */}
      <div className="container mx-auto px-6 py-8 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-normal mb-6">
          How Prominence Works
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Transform your AI visibility with our comprehensive monitoring and optimization platform
        </p>
      </div>

      {/* Stacking Cards Container */}
      <div className="relative w-full z-10">
        {/* Mobile: Stacking Cards Layout */}
        <div className="lg:hidden relative">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="sticky w-full px-6"
            style={{ 
                top: `${80 + index * 30}px`,  // smaller offset for mobile
                height: '70vh',  // smaller height for mobile
              display: 'flex',
              alignItems: 'center',
                zIndex: index + 1,
                transition: 'all 0.5s ease-in-out'
            }}
          >
            <div className="container mx-auto max-w-7xl">
              <div 
                  className="bg-black rounded-3xl p-6 shadow-2xl shadow-purple-500/20 transition-all duration-700 hover:shadow-3xl min-h-[400px] flex border border-white/10"
                style={{
                    transform: `scale(${1 - index * 0.03})`
                }}
              >
                {/* Flex container for content layout */}
                  <div className="flex flex-col gap-6 items-stretch w-full h-full">
                    {/* Description Section */}
                    <div className="flex-1 space-y-4 flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                        {feature.icon}
                        </div>
                        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Step {index + 1}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-normal mb-3 text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>

                      {/* Progress indicator */}
                      <div className="flex space-x-1">
                        {features.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              i <= index ? 'bg-white w-6' : 'bg-white/30 w-3'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Screenshot Section */}
                    <div className="flex-1 relative">
                      <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-purple-500/20 bg-black h-full">
                        <img 
                          src={feature.screenshot} 
                          alt={`${feature.title} interface`}
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Stacking Cards Layout */}
        <div className="hidden lg:block">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="sticky w-full px-6"
              style={{ 
                top: `${120 + index * 60}px`,  // increased offset to show previous card headers
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                zIndex: index + 1,  // each new card appears on top of the previous one
                transition: 'all 0.5s ease-in-out'  // smoother transitions
              }}
            >
              <div className="container mx-auto max-w-7xl">
                <div 
                  className="bg-black rounded-3xl p-12 md:p-16 shadow-2xl shadow-purple-500/20 transition-all duration-700 hover:shadow-3xl min-h-[600px] md:min-h-[700px] flex border border-white/10"
                  style={{
                    transform: `scale(${1 - index * 0.02})`
                  }}
                >
                  {/* Flex container for content layout */}
                  <div className="flex flex-col lg:flex-row gap-12 items-stretch w-full h-full">
                    {/* Description Section - LEFT */}
                    <div className="flex-1 space-y-8 flex flex-col justify-center lg:block">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                          {feature.icon}
                        </div>
                        <div className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Step {index + 1}
                      </div>
                    </div>
                    
                    <div>
                        <h3 className="text-4xl md:text-5xl font-normal mb-6 text-white">
                        {feature.title}
                      </h3>
                        <p className="text-xl text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex space-x-2">
                      {features.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${
                              i <= index ? 'bg-white w-8' : 'bg-white/30 w-4'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Screenshot/Video Placeholder Section - RIGHT */}
                    <div className="flex-1 relative lg:block hidden">
                      <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-purple-500/20 bg-black h-full">
                      <img 
                        src={feature.screenshot} 
                        alt={`${feature.title} interface`}
                          className="w-full h-full object-contain"
                      />
                      
                      {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full opacity-60 blur-sm" />
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-40 blur-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
      </div>
    </section>
  );
};

export default ProminenceWorkflow;
