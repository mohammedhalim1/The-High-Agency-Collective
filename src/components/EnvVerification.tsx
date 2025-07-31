import { useEffect, useState } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';

interface EnvStatus {
  url: {
    exists: boolean;
    value: string;
    isValid: boolean;
  };
  key: {
    exists: boolean;
    value: string;
    isValid: boolean;
  };
  client: {
    initialized: boolean;
    ready: boolean;
  };
  connection: {
    tested: boolean;
    successful: boolean;
    error?: string;
  };
}

const EnvVerification = () => {
  const [status, setStatus] = useState<EnvStatus>({
    url: { exists: false, value: '', isValid: false },
    key: { exists: false, value: '', isValid: false },
    client: { initialized: false, ready: false },
    connection: { tested: false, successful: false }
  });

  useEffect(() => {
    const checkEnvironment = async () => {
      // Check URL
      const url = import.meta.env.VITE_SUPABASE_URL;
      const urlExists = !!url;
      const urlIsValid = url?.startsWith('https://') && url?.includes('supabase.co');

      // Check Key
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const keyExists = !!key;
      const keyIsValid = key?.startsWith('eyJ') && key?.length > 100; // JWT format check

      // Check Client
      const clientInitialized = !!supabase;
      const clientReady = isSupabaseReady();

      let connectionTested = false;
      let connectionSuccessful = false;
      let connectionError = '';

      // Test connection
      if (supabase && clientReady) {
        try {
          const { error } = await supabase.auth.getSession();
          connectionTested = true;
          connectionSuccessful = !error;
          if (error) {
            connectionError = error.message;
          }
        } catch (err: any) {
          connectionTested = true;
          connectionSuccessful = false;
          connectionError = err.message;
        }
      }

      setStatus({
        url: {
          exists: urlExists,
          value: url || 'NOT_SET',
          isValid: urlIsValid
        },
        key: {
          exists: keyExists,
          value: keyExists ? `${key.substring(0, 20)}...` : 'NOT_SET',
          isValid: keyIsValid
        },
        client: {
          initialized: clientInitialized,
          ready: clientReady
        },
        connection: {
          tested: connectionTested,
          successful: connectionSuccessful,
          error: connectionError
        }
      });
    };

    checkEnvironment();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
      <h3 className="text-lg font-semibold mb-4">🔧 Environment Variables Verification</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">VITE_SUPABASE_URL:</h4>
          <div className="bg-white p-2 rounded border">
            <p>✅ Exists: {status.url.exists ? '✅ Yes' : '❌ No'}</p>
            <p>✅ Valid: {status.url.isValid ? '✅ Yes' : '❌ No'}</p>
            <p className="text-xs text-gray-600 mt-1">Value: {status.url.value}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">VITE_SUPABASE_ANON_KEY:</h4>
          <div className="bg-white p-2 rounded border">
            <p>✅ Exists: {status.key.exists ? '✅ Yes' : '❌ No'}</p>
            <p>✅ Valid: {status.key.isValid ? '✅ Yes' : '❌ No'}</p>
            <p className="text-xs text-gray-600 mt-1">Value: {status.key.value}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Supabase Client:</h4>
          <div className="bg-white p-2 rounded border">
            <p>✅ Initialized: {status.client.initialized ? '✅ Yes' : '❌ No'}</p>
            <p>✅ Ready: {status.client.ready ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Connection Test:</h4>
          <div className="bg-white p-2 rounded border">
            <p>✅ Tested: {status.connection.tested ? '✅ Yes' : '⏳ Testing...'}</p>
            <p>✅ Successful: {status.connection.successful ? '✅ Yes' : '❌ No'}</p>
            {status.connection.error && (
              <p className="text-xs text-red-600 mt-1">Error: {status.connection.error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
        <p><strong>🔍 Debug Info:</strong></p>
        <p>Environment Mode: {import.meta.env.MODE}</p>
        <p>Base URL: {import.meta.env.BASE_URL}</p>
        <p>All Env Vars: {Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).join(', ')}</p>
      </div>
    </div>
  );
};

export default EnvVerification;
