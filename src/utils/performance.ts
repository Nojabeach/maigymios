/**
 * Web Vitals Monitoring y Performance Utilities
 */

export function initPerformanceMonitoring() {
  // Core Web Vitals - Largest Contentful Paint
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (import.meta.env.DEV) console.log("LCP:", (entry as any).startTime);
        }
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      if (import.meta.env.DEV) console.log("LCP not supported");
    }
  }

  // First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (import.meta.env.DEV) console.log("FID:", entry.processingDuration);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
  } catch (e) {
    if (import.meta.env.DEV) console.log("FID observer not supported");
  }

  // Cumulative Layout Shift
  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          if (import.meta.env.DEV) console.log("CLS:", clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  } catch (e) {
    if (import.meta.env.DEV) console.log("CLS observer not supported");
  }
}

/**
 * Add resource hints for faster loading
 */
export function addResourceHints() {
  const hints = [
    // DNS prefetch
    { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
    { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
    // Preconnect
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
  ];

  hints.forEach(({ rel, href }) => {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with IntersectionObserver
 */
export function lazyLoadImages() {
  if (!("IntersectionObserver" in window)) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Defer non-critical JavaScript
 */
export function scheduleIdleTask(callback: () => void) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Cache API responses with TTL
 */
const responseCache = new Map<string, { data: any; timestamp: number }>();

export const cacheRequest = (
  key: string,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) => {
  return {
    get: () => {
      const cached = responseCache.get(key);
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
      responseCache.delete(key);
      return null;
    },
    set: (data: any) => {
      responseCache.set(key, { data, timestamp: Date.now() });
    },
    clear: () => responseCache.delete(key),
  };
};

/**
 * Debounce para optimizar event listeners
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle para updates frecuentes
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const criticalResources = [
    // Add your critical resources here
    "/index.js",
    "/index.css",
  ];

  criticalResources.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = href.endsWith(".css") ? "style" : "script";
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Enable code splitting hints
 */
export const optimizeCodeSplitting = () => {
  // Hint to browser to prefetch code that might be needed soon
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      // Prefetch bundles that are likely to be used
      const links = ["/dist/vendor-react.js", "/dist/vendor-charts.js"];
      links.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        link.as = "script";
        document.head.appendChild(link);
      });
    });
  }
};
