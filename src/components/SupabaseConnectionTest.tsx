import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const SupabaseConnectionTest = () => {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: 'Ready to test' });

  const testConnection = async () => {
    setTestResult({ status: 'testing', message: 'Testing connection...' });

    try {
      console.log('🧪 Testing Supabase connection with environment variables...');
      console.log('📍 URL from env:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔑 Key from env:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

      if (!supabase) {
        setTestResult({
          status: 'error',
          message: 'Supabase client not initialized',
          details: {
            url: import.meta.env.VITE_SUPABASE_URL,
            hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
          }
        });
        return;
      }

      // Test 1: Basic auth check
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.warn('Auth check result:', authError.message);
      } else {
        console.log('✅ Auth check successful');
      }

      // Test 2: Try to access pages table
      const { data, error, count } = await supabase
        .from('pages')
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        setTestResult({
          status: 'error',
          message: `Database error: ${error.message}`,
          details: {
            code: error.code,
            hint: error.hint,
            details: error.details,
            url: import.meta.env.VITE_SUPABASE_URL,
            usingCorrectEnv: true
          }
        });
      } else {
        setTestResult({
          status: 'success',
          message: `✅ Connection successful! Found ${count || 0} records in pages table.`,
          details: {
            recordCount: count,
            sampleData: data,
            url: import.meta.env.VITE_SUPABASE_URL,
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error: any) {
      setTestResult({
        status: 'error',
        message: `Connection failed: ${error.message}`,
        details: {
          error: error.message,
          stack: error.stack,
          url: import.meta.env.VITE_SUPABASE_URL
        }
      });
    }
  };

  useEffect(() => {
    // Auto-test on component mount
    testConnection();
  }, []);

  return (
    <div className="bg-white border rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">🔌 Supabase Connection Test</h3>
        <Button onClick={testConnection} size="sm" disabled={testResult.status === 'testing'}>
          {testResult.status === 'testing' ? 'Testing...' : 'Test Again'}
        </Button>
      </div>

      <div className={`p-3 rounded ${
        testResult.status === 'success' ? 'bg-green-50 border-green-200' :
        testResult.status === 'error' ? 'bg-red-50 border-red-200' :
        testResult.status === 'testing' ? 'bg-blue-50 border-blue-200' :
        'bg-gray-50 border-gray-200'
      } border`}>
        <p className="font-medium">{testResult.message}</p>
        
        {testResult.details && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-gray-600">View Details</summary>
            <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
              {JSON.stringify(testResult.details, null, 2)}
            </pre>
          </details>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p><strong>Environment Variables:</strong></p>
        <p>URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
        <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;
