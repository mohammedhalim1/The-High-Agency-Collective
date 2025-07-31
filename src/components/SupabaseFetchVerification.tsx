import { useEffect, useState } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FetchLog {
  timestamp: string;
  action: string;
  details: any;
  success: boolean;
}

const SupabaseFetchVerification = () => {
  const [logs, setLogs] = useState<FetchLog[]>([]);
  const [isTestingActive, setIsTestingActive] = useState(false);

  const addLog = (action: string, details: any, success: boolean = true) => {
    const log: FetchLog = {
      timestamp: new Date().toISOString(),
      action,
      details,
      success
    };
    setLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
    console.log(`📋 FETCH LOG: ${action}`, details);
  };

  // Comprehensive environment and connection check
  const verifyEnvironment = () => {
    addLog('Environment Check', {
      url: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      urlValue: import.meta.env.VITE_SUPABASE_URL,
      keyPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      supabaseReady: isSupabaseReady(),
      clientExists: !!supabase
    });
  };

  // Test network request with detailed logging
  const testNetworkRequest = async (slug: string = 'home') => {
    if (!supabase) {
      addLog('Network Test Failed', 'Supabase client not available', false);
      return;
    }

    const startTime = performance.now();
    
    try {
      addLog('Starting Network Request', {
        slug,
        timestamp: new Date().toISOString(),
        url: import.meta.env.VITE_SUPABASE_URL + '/rest/v1/pages'
      });

      // Make the actual request that our app makes
      const { data, error, status, statusText } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (error) {
        addLog('Network Request Failed', {
          slug,
          duration: `${duration.toFixed(2)}ms`,
          error: {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          },
          status,
          statusText
        }, false);
      } else {
        addLog('Network Request Successful', {
          slug,
          duration: `${duration.toFixed(2)}ms`,
          dataReceived: {
            hasData: !!data,
            slug: data?.slug,
            updated_at: data?.updated_at,
            hasContent: !!(data?.content),
            contentKeys: data?.content ? Object.keys(data.content) : []
          },
          status,
          statusText
        });
      }
    } catch (catchError: any) {
      addLog('Network Request Exception', {
        slug,
        error: catchError.message,
        stack: catchError.stack
      }, false);
    }
  };

  // Test all main page slugs
  const testAllPages = async () => {
    setIsTestingActive(true);
    const slugs = ['home', 'about', 'services', 'contact', 'transform', 'terms-conditions', 'privacy-policy', 'refund-policy'];
    
    addLog('Testing All Pages', { slugs });
    
    for (const slug of slugs) {
      await testNetworkRequest(slug);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
    }
    
    setIsTestingActive(false);
  };

  // Check if localStorage/sessionStorage is being used
  const checkClientStorage = () => {
    const localStorageKeys = Object.keys(localStorage);
    const sessionStorageKeys = Object.keys(sessionStorage);
    
    addLog('Client Storage Check', {
      localStorage: {
        keyCount: localStorageKeys.length,
        keys: localStorageKeys,
        supabaseRelated: localStorageKeys.filter(key => 
          key.includes('supabase') || key.includes('pages') || key.includes('content')
        )
      },
      sessionStorage: {
        keyCount: sessionStorageKeys.length,
        keys: sessionStorageKeys,
        supabaseRelated: sessionStorageKeys.filter(key => 
          key.includes('supabase') || key.includes('pages') || key.includes('content')
        )
      }
    });
  };

  // Monitor network activity
  const monitorNetworkActivity = () => {
    // Check if there are any pending network requests
    if ('performance' in window && 'getEntriesByType' in performance) {
      const networkEntries = performance.getEntriesByType('navigation');
      const resourceEntries = performance.getEntriesByType('resource');
      
      const supabaseRequests = resourceEntries.filter((entry: any) => 
        entry.name.includes('supabase.co')
      );

      addLog('Network Activity Monitor', {
        totalNetworkEntries: networkEntries.length,
        totalResourceEntries: resourceEntries.length,
        supabaseRequests: supabaseRequests.length,
        recentSupabaseRequests: supabaseRequests.slice(-5).map((entry: any) => ({
          url: entry.name,
          duration: entry.duration,
          timestamp: entry.startTime
        }))
      });
    }
  };

  useEffect(() => {
    verifyEnvironment();
    checkClientStorage();
    monitorNetworkActivity();
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">🔍 Supabase Fetch Verification</h3>
          <div className="flex gap-2">
            <Button onClick={verifyEnvironment} size="sm" variant="outline">
              Check Env
            </Button>
            <Button onClick={() => testNetworkRequest()} size="sm" variant="outline">
              Test Home
            </Button>
            <Button 
              onClick={testAllPages} 
              size="sm" 
              disabled={isTestingActive}
            >
              {isTestingActive ? 'Testing...' : 'Test All Pages'}
            </Button>
            <Button onClick={checkClientStorage} size="sm" variant="outline">
              Check Storage
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded p-4 max-h-96 overflow-auto">
          <h4 className="font-medium mb-2">Fetch Logs (Most Recent First)</h4>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No logs yet. Click a test button to start.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div 
                  key={index}
                  className={`text-xs p-2 rounded border-l-4 ${
                    log.success 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-red-400 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs overflow-auto">
                    {typeof log.details === 'object' 
                      ? JSON.stringify(log.details, null, 2)
                      : log.details
                    }
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Instructions:</strong></p>
          <p>1. Check environment variables and Supabase connection</p>
          <p>2. Test network requests to see actual Supabase responses</p>
          <p>3. Verify no unwanted client-side storage is being used</p>
          <p>4. Monitor all page fetching in real-time</p>
          <p>5. Check browser DevTools Network tab for HTTP requests</p>
        </div>
      </div>
    </Card>
  );
};

export default SupabaseFetchVerification;
