// Network request monitor for Supabase calls
export class SupabaseNetworkMonitor {
  private static instance: SupabaseNetworkMonitor;
  private requests: Array<{
    id: string;
    url: string;
    method: string;
    timestamp: string;
    status?: number;
    duration?: number;
    response?: any;
    error?: any;
  }> = [];

  static getInstance(): SupabaseNetworkMonitor {
    if (!SupabaseNetworkMonitor.instance) {
      SupabaseNetworkMonitor.instance = new SupabaseNetworkMonitor();
    }
    return SupabaseNetworkMonitor.instance;
  }

  private constructor() {
    this.interceptFetch();
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' ? resource : resource.url;
      
      // Only monitor Supabase requests
      if (url.includes('supabase.co')) {
        const requestId = Math.random().toString(36).substr(2, 9);
        const startTime = performance.now();
        
        const request = {
          id: requestId,
          url,
          method: config?.method || 'GET',
          timestamp: new Date().toISOString(),
        };

        console.log(`🌐 [${requestId}] Supabase Network Request:`, {
          url,
          method: config?.method || 'GET',
          headers: config?.headers,
          body: config?.body,
          timestamp: request.timestamp
        });

        this.requests.push(request);

        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          const duration = endTime - startTime;

          // Clone response to read it without consuming it
          const responseClone = response.clone();
          let responseData;
          
          try {
            responseData = await responseClone.json();
          } catch (e) {
            responseData = await responseClone.text();
          }

          const requestIndex = this.requests.findIndex(r => r.id === requestId);
          if (requestIndex !== -1) {
            this.requests[requestIndex] = {
              ...this.requests[requestIndex],
              status: response.status,
              duration,
              response: responseData
            };
          }

          console.log(`🌐 [${requestId}] Supabase Response:`, {
            status: response.status,
            statusText: response.statusText,
            duration: `${duration.toFixed(2)}ms`,
            data: responseData,
            headers: Object.fromEntries(response.headers.entries())
          });

          return response;
        } catch (error) {
          const endTime = performance.now();
          const duration = endTime - startTime;

          const requestIndex = this.requests.findIndex(r => r.id === requestId);
          if (requestIndex !== -1) {
            this.requests[requestIndex] = {
              ...this.requests[requestIndex],
              duration,
              error
            };
          }

          console.error(`🌐 [${requestId}] Supabase Request Failed:`, {
            error,
            duration: `${duration.toFixed(2)}ms`
          });

          throw error;
        }
      }

      return originalFetch(...args);
    };
  }

  getRequests() {
    return [...this.requests];
  }

  getRecentRequests(count = 10) {
    return this.requests.slice(-count);
  }

  clearRequests() {
    this.requests = [];
  }

  getRequestStats() {
    const total = this.requests.length;
    const successful = this.requests.filter(r => r.status && r.status < 400).length;
    const failed = this.requests.filter(r => r.error || (r.status && r.status >= 400)).length;
    const averageDuration = this.requests.reduce((acc, r) => acc + (r.duration || 0), 0) / total;

    return {
      total,
      successful,
      failed,
      averageDuration: averageDuration ? `${averageDuration.toFixed(2)}ms` : 'N/A',
      successRate: total > 0 ? `${((successful / total) * 100).toFixed(1)}%` : 'N/A'
    };
  }
}

// Initialize the monitor
export const networkMonitor = SupabaseNetworkMonitor.getInstance();

// Export for debugging in console
(window as any).supabaseNetworkMonitor = networkMonitor;
console.log('🔍 Supabase Network Monitor initialized. Access via window.supabaseNetworkMonitor');
