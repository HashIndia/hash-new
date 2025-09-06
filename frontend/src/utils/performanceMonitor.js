// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadStart: null,
      apiCalls: new Map(),
      initializationTime: null
    };
    this.isSupported = typeof performance !== 'undefined' && performance.now;
  }

  // Start timing page load
  startPageLoad() {
    if (!this.isSupported) return;
    this.metrics.pageLoadStart = performance.now();
  }

  // End timing page load
  endPageLoad() {
    if (!this.isSupported) return;
    if (this.metrics.pageLoadStart) {
      const loadTime = performance.now() - this.metrics.pageLoadStart;
      this.metrics.pageLoadStart = null;
      return loadTime;
    }
  }

  // Start timing an API call
  startAPICall(endpoint) {
    if (!this.isSupported) return;
    this.metrics.apiCalls.set(endpoint, performance.now());
  }

  // End timing an API call
  endAPICall(endpoint) {
    if (!this.isSupported) return;
    const startTime = this.metrics.apiCalls.get(endpoint);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.apiCalls.delete(endpoint);
      
      // Warn if API call is slow
      if (duration > 5000) {
        console.warn(`⚠️ Slow API call detected: ${endpoint} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
  }

  // Time initialization process
  startInitialization() {
    if (!this.isSupported) return;
    this.metrics.initializationTime = performance.now();
  }

  endInitialization() {
    if (!this.isSupported) return;
    if (this.metrics.initializationTime) {
      const duration = performance.now() - this.metrics.initializationTime;
      
      if (duration > 3000) {
        console.warn(`⚠️ Slow initialization detected: ${duration.toFixed(2)}ms`);
      }
      
      this.metrics.initializationTime = null;
      return duration;
    }
  }

  // Get network performance info
  getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Log performance summary
  logSummary() {
    // Performance summary logging removed for production
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start page load timing
if (typeof window !== 'undefined') {
  performanceMonitor.startPageLoad();
  
  // Log summary when page is fully loaded
  window.addEventListener('load', () => {
    performanceMonitor.endPageLoad();
    setTimeout(() => performanceMonitor.logSummary(), 1000);
  });
}

export default performanceMonitor;
