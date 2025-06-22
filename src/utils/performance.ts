// Performance utilities

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }) as T
}

// Request animation frame wrapper
export function rafThrottle<T extends (...args: any[]) => any>(func: T): T {
  let ticking = false
  return ((...args: any[]) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(null, args)
        ticking = false
      })
      ticking = true
    }
  }) as T
}

// Lazy load images
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = src
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    imageObserver.observe(img)
  } else {
    // Fallback for older browsers
    img.src = src
  }
}

// Preload critical resources
export function preloadResource(href: string, as: string = 'fetch') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Prefetch non-critical resources
export function prefetchResource(href: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

// Measure performance
export function measurePerformance(name: string, fn: () => void) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
  } else {
    fn()
  }
}

// Async measure performance
export async function measureAsyncPerformance(
  name: string,
  fn: () => Promise<void>
) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    await fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
  } else {
    await fn()
  }
}

// Memory usage (if available)
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100,
    }
  }
  return null
}

// Check if element is in viewport
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Check if element is partially in viewport
export function isPartiallyInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right > 0
  )
}

// Batch DOM updates
export function batchDOMUpdates(updates: (() => void)[]) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      updates.forEach(update => update())
    })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      updates.forEach(update => update())
    }, 0)
  }
}

// Optimize scroll performance
export function optimizeScroll(element: Element, callback: () => void) {
  let ticking = false
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback()
        ticking = false
      })
      ticking = true
    }
  }

  element.addEventListener('scroll', handleScroll, { passive: true })
  
  return () => {
    element.removeEventListener('scroll', handleScroll)
  }
}

// Cache function results
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Deep clone with performance optimization
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
} 