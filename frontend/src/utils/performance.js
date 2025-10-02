/**
 * Performance monitoring and metrics collection
 */

/**
 * Performance metrics collector
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.observers = {};
    this.init();
  }

  init() {
    // Initialize performance observers
    this.initNavigationObserver();
    this.initResourceObserver();
    this.initLCPObserver();
    this.initFIDObserver();
    this.initCLSObserver();
  }

  /**
   * Navigation timing observer
   */
  initNavigationObserver() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('navigation', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              timestamp: Date.now()
            });
          }
        });
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.navigation = observer;
      } catch (error) {
        console.warn('Navigation observer not supported:', error);
      }
    }
  }

  /**
   * Resource timing observer
   */
  initResourceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 100) { // Only track slow resources
              this.recordMetric('resource', {
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize,
                type: entry.initiatorType,
                timestamp: Date.now()
              });
            }
          }
        });
        observer.observe({ entryTypes: ['resource'] });
        this.observers.resource = observer;
      } catch (error) {
        console.warn('Resource observer not supported:', error);
      }
    }
  }

  /**
   * Largest Contentful Paint (LCP) observer
   */
  initLCPObserver() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.recordMetric('lcp', {
            value: lastEntry.startTime,
            element: lastEntry.element?.tagName,
            url: lastEntry.url,
            timestamp: Date.now()
          });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.lcp = observer;
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }
    }
  }

  /**
   * First Input Delay (FID) observer
   */
  initFIDObserver() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('fid', {
              value: entry.processingStart - entry.startTime,
              target: entry.target?.tagName,
              timestamp: Date.now()
            });
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.fid = observer;
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }
    }
  }

  /**
   * Cumulative Layout Shift (CLS) observer
   */
  initCLSObserver() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          
          this.recordMetric('cls', {
            value: clsValue,
            timestamp: Date.now()
          });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.cls = observer;
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }
  }

  /**
   * Record a custom metric
   */
  recordMetric(type, data) {
    const metric = {
      type,
      ...data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log important metrics
    if (['lcp', 'fid', 'cls'].includes(type)) {
      console.log(`Performance [${type.toUpperCase()}]:`, data.value);
    }

    // Emit custom event for external listeners
    window.dispatchEvent(new CustomEvent('performanceMetric', { 
      detail: metric 
    }));
  }

  /**
   * Get metrics by type
   */
  getMetrics(type) {
    return type ? this.metrics.filter(m => m.type === type) : this.metrics;
  }

  /**
   * Get Core Web Vitals summary
   */
  getCoreWebVitals() {
    const lcp = this.getMetrics('lcp');
    const fid = this.getMetrics('fid');
    const cls = this.getMetrics('cls');

    return {
      lcp: {
        value: lcp.length > 0 ? lcp[lcp.length - 1].value : null,
        rating: this.rateLCP(lcp.length > 0 ? lcp[lcp.length - 1].value : null)
      },
      fid: {
        value: fid.length > 0 ? fid[fid.length - 1].value : null,
        rating: this.rateFID(fid.length > 0 ? fid[fid.length - 1].value : null)
      },
      cls: {
        value: cls.length > 0 ? cls[cls.length - 1].value : null,
        rating: this.rateCLS(cls.length > 0 ? cls[cls.length - 1].value : null)
      }
    };
  }

  /**
   * Rate LCP performance
   */
  rateLCP(value) {
    if (value === null) return 'unknown';
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rate FID performance
   */
  rateFID(value) {
    if (value === null) return 'unknown';
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rate CLS performance
   */
  rateCLS(value) {
    if (value === null) return 'unknown';
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics() {
    return JSON.stringify({
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      coreWebVitals: this.getCoreWebVitals()
    }, null, 2);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
  }

  /**
   * Cleanup observers
   */
  disconnect() {
    Object.values(this.observers).forEach(observer => {
      observer.disconnect();
    });
    this.observers = {};
  }
}

/**
 * Error tracker
 */
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.init();
  }

  init() {
    // Track JavaScript errors
    window.addEventListener('error', this.handleError.bind(this));
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    // Track React errors (if available)
    if (window.React) {
      this.setupReactErrorTracking();
    }
  }

  handleError(event) {
    this.recordError({
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  handlePromiseRejection(event) {
    this.recordError({
      type: 'unhandled-promise',
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  recordError(errorData) {
    this.errors.push(errorData);
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    console.error('Error tracked:', errorData);
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('errorTracked', { 
      detail: errorData 
    }));
  }

  getErrors(type) {
    return type ? this.errors.filter(e => e.type === type) : this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  exportErrors() {
    return JSON.stringify({
      timestamp: Date.now(),
      url: window.location.href,
      errors: this.errors
    }, null, 2);
  }
}

/**
 * Bundle size analyzer
 */
export class BundleAnalyzer {
  static analyze() {
    const scripts = Array.from(document.scripts);
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    return {
      scripts: scripts.map(script => ({
        src: script.src,
        size: script.src ? null : script.textContent?.length || 0,
        async: script.async,
        defer: script.defer
      })),
      stylesheets: stylesheets.map(link => ({
        href: link.href,
        media: link.media
      })),
      totalScripts: scripts.length,
      totalStylesheets: stylesheets.length
    };
  }
}

// Create singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const errorTracker = new ErrorTracker();

// Export individual classes for custom usage
export { PerformanceMonitor, ErrorTracker };

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  // Already initialized by singleton creation
  console.log('Performance monitoring initialized');
  
  // Log initial page load metrics after a delay
  setTimeout(() => {
    const webVitals = performanceMonitor.getCoreWebVitals();
    console.log('Core Web Vitals:', webVitals);
  }, 3000);
}

/**
 * Get performance report
 */
export function getPerformanceReport() {
  return {
    coreWebVitals: performanceMonitor.getCoreWebVitals(),
    metrics: performanceMonitor.getMetrics(),
    errors: errorTracker.getErrors(),
    bundleAnalysis: BundleAnalyzer.analyze(),
    timestamp: Date.now()
  };
}