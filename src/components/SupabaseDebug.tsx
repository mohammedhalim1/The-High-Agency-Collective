import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SupabaseDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);

    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('Environment vars:', {
        url: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      });
      console.log('Supabase ready:', isSupabaseReady());
      console.log('Supabase client:', supabase);

      if (!supabase || !isSupabaseReady()) {
        const status = '❌ Supabase not configured properly';
        setConnectionStatus(status);
        console.error(status);
        return;
      }

      // Test 1: Basic table access with detailed error logging
      console.log('Testing basic table access...');
      const { data, error } = await supabase
        .from('pages')
        .select('*');

      if (error) {
        console.error('❌ Error accessing pages table:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: error
        });
        setConnectionStatus(`❌ Error: ${error.message} (Code: ${error.code})`);
        toast.error(`Database error: ${error.message}`);
        return;
      }

      console.log('✅ Successfully connected!');
      console.log('Table data:', data);
      setTableData(data || []);
      setConnectionStatus(`✅ Connected! Found ${data?.length || 0} records`);

      // Test 2: Fetch specific content with detailed error logging
      console.log('Testing specific content fetch...');
      const testSlugs = ['home', 'about', 'services'];

      for (const slug of testSlugs) {
        console.log(`Testing fetch for slug: ${slug}`);
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (pageError) {
          if (pageError.code === 'PGRST116') {
            console.log(`ℹ️ No data found for ${slug} (this is okay)`);
          } else {
            console.error(`❌ Error fetching ${slug}:`, {
              message: pageError.message,
              code: pageError.code,
              details: pageError.details,
              hint: pageError.hint,
              fullError: pageError
            });
          }
        } else {
          console.log(`✅ ${slug} data:`, pageData);
        }
      }

      // Test 3: Table schema inspection
      console.log('Inspecting table schema...');
      const { data: schemaData, error: schemaError } = await supabase
        .from('pages')
        .select('*')
        .limit(1);

      if (schemaError) {
        console.error('Schema inspection failed:', schemaError);
      } else {
        console.log('Schema sample:', schemaData);
      }

    } catch (error: any) {
      console.error('❌ Connection test failed:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        fullError: error
      });
      setConnectionStatus(`❌ Failed: ${error?.message || 'Unknown error'}`);
      toast.error(`Connection failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testRealTimeUpdate = async () => {
    if (!supabase) return;

    try {
      const now = new Date();
      const testData = {
        slug: 'home',
        content: {
          test: true,
          timestamp: now.toISOString(),
          message: '🚀 FRESH DATA TEST - No caching enabled!',
          hero: {
            title: "FRESH UPDATE - " + now.toLocaleTimeString(),
            subtitle: "Zero caching! This should appear IMMEDIATELY!",
            description: "⚡ Updated at " + now.toLocaleString() + " - Fresh fetch every time!"
          }
        },
        updated_at: now.toISOString()
      };

      console.log('📤 Sending FRESH test update:', testData);

      const { data, error } = await supabase
        .from('pages')
        .upsert(testData, { onConflict: 'slug' })
        .select();

      if (error) {
        console.error('❌ Update test failed:', error);
        toast.error(`Update failed: ${error.message}`);
      } else {
        console.log('✅ Update successful:', data);
        toast.success('🚀 FRESH DATA UPDATE! Open homepage in new tab/incognito - should show immediately!');
        // Refresh the table data
        testConnection();
      }
    } catch (error: any) {
      console.error('❌ Update error:', error);
      toast.error(`Update error: ${error.message}`);
    }
  };

  const clearTestData = async () => {
    if (!supabase) return;

    try {
      // Reset home page to remove test data
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('slug', 'home');

      if (error) {
        console.error('❌ Clear failed:', error);
        toast.error(`Clear failed: ${error.message}`);
      } else {
        console.log('✅ Test data cleared');
        toast.success('Test data cleared! Homepage will now show default content.');
        testConnection();
      }
    } catch (error: any) {
      console.error('❌ Clear error:', error);
      toast.error(`Clear error: ${error.message}`);
    }
  };

  const testLegalPagesUpdate = async () => {
    if (!supabase) return;

    try {
      const now = new Date();
      const testData = {
        slug: 'terms-conditions',
        content: {
          title: "🚀 FRESH Terms & Conditions - " + now.toLocaleTimeString(),
          content: "FRESH DATA TEST: Client agrees to these updated terms at " + now.toLocaleString(),
          sections: [{
            title: "⚡ Fresh Fetch Test Section",
            content: "This content was updated at " + now.toISOString() + " and should appear immediately in all browsers!"
          }]
        },
        updated_at: now.toISOString()
      };

      const { data, error } = await supabase
        .from('pages')
        .upsert(testData, { onConflict: 'slug' })
        .select();

      if (error) {
        console.error('❌ Legal pages test failed:', error);
        toast.error(`Legal pages test failed: ${error.message}`);
      } else {
        console.log('✅ Legal pages test successful:', data);
        toast.success('🚀 Legal pages updated! Check /terms-conditions page - should show fresh content immediately!');
        testConnection();
      }
    } catch (error: any) {
      console.error('❌ Legal pages test error:', error);
      toast.error(`Legal pages test error: ${error.message}`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Debug</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Connection Status:</h3>
          <p className="text-sm">{connectionStatus}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button onClick={testRealTimeUpdate} variant="outline">
            Test Real-time Update
          </Button>
          <Button onClick={clearTestData} variant="destructive" size="sm">
            Clear Test Data
          </Button>
          <Button onClick={testLegalPagesUpdate} variant="secondary" size="sm">
            Test Legal Pages
          </Button>
        </div>

        {tableData.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Current Data in Pages Table:</h3>
            <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
              <pre>{JSON.stringify(tableData, null, 2)}</pre>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Environment Check:</h3>
          <ul className="text-sm space-y-1">
            <li>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
            <li>Client Ready: {isSupabaseReady() ? '✅ Yes' : '❌ No'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDebug;
