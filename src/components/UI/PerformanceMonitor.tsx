import React, { useState, useEffect } from 'react';
import { getMemoryUsage } from '../../utils/performance';

interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    limit: number;
  } | null;
  fps: number;
  loadTime: number;
  domContentLoaded: number;
}

export function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development' 
}: { 
  enabled?: boolean;
}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: null,
    fps: 0,
    loadTime: 0,
    domContentLoaded: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Get initial metrics
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

    setMetrics(prev => ({
      ...prev,
      loadTime,
      domContentLoaded
    }));

    // FPS monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: getMemoryUsage()
        }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Memory monitoring
    const memoryInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        memory: getMemoryUsage()
      }));
    }, 2000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-20 right-4 z-50 bg-black/80 text-white px-3 py-1 rounded text-xs hover:bg-black/90 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Toggle performance monitor"
      >
        {isVisible ? 'Hide' : 'Show'} Perf
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div className="fixed top-32 right-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-xs">
          <h3 className="font-bold mb-2 text-sm">Performance Metrics</h3>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">FPS:</span>
              <span className={`ml-2 ${metrics.fps >= 50 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {metrics.fps}
              </span>
            </div>
            
            {metrics.memory && (
              <>
                <div>
                  <span className="text-gray-400">Memory Used:</span>
                  <span className="ml-2">{metrics.memory.used} MB</span>
                </div>
                <div>
                  <span className="text-gray-400">Memory Total:</span>
                  <span className="ml-2">{metrics.memory.total} MB</span>
                </div>
                <div>
                  <span className="text-gray-400">Memory Limit:</span>
                  <span className="ml-2">{metrics.memory.limit} MB</span>
                </div>
              </>
            )}
            
            <div>
              <span className="text-gray-400">Load Time:</span>
              <span className="ml-2">{metrics.loadTime}ms</span>
            </div>
            
            <div>
              <span className="text-gray-400">DOM Ready:</span>
              <span className="ml-2">{metrics.domContentLoaded}ms</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Web Vitals monitoring
export function WebVitalsMonitor({ 
  enabled = process.env.NODE_ENV === 'development' 
}: { 
  enabled?: boolean;
}) {
  const [vitals, setVitals] = useState({
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  });

  useEffect(() => {
    if (!enabled || !('PerformanceObserver' in window)) return;

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        setVitals(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setVitals(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setVitals(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  const getVitalColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-xs">
      <h3 className="font-bold mb-2 text-sm">Web Vitals</h3>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">LCP:</span>
          <span className={`ml-2 ${getVitalColor(vitals.lcp, { good: 2500, poor: 4000 })}`}>
            {vitals.lcp.toFixed(0)}ms
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">FID:</span>
          <span className={`ml-2 ${getVitalColor(vitals.fid, { good: 100, poor: 300 })}`}>
            {vitals.fid.toFixed(0)}ms
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">CLS:</span>
          <span className={`ml-2 ${getVitalColor(vitals.cls, { good: 0.1, poor: 0.25 })}`}>
            {vitals.cls.toFixed(3)}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">TTFB:</span>
          <span className={`ml-2 ${getVitalColor(vitals.ttfb, { good: 800, poor: 1800 })}`}>
            {vitals.ttfb.toFixed(0)}ms
          </span>
        </div>
      </div>
    </div>
  );
} 