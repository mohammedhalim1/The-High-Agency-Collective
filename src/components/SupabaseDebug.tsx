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
      console.log('Supabase ready:', isSupabaseReady());
      console.log('Supabase client:', supabase);

      if (!supabase || !isSupabaseReady()) {
        setConnectionStatus('❌ Supabase not configured');
        return;
      }

      // Test 1: Basic table access
      const { data, error } = await supabase
        .from('pages')
        .select('*');

      if (error) {
        console.error('❌ Error accessing pages table:', error);
        setConnectionStatus(`❌ Error: ${error.message}`);
        toast.error(`Database error: ${error.message}`);
        return;
      }

      console.log('✅ Successfully connected!');
      console.log('Table data:', data);
      setTableData(data || []);
      setConnectionStatus(`✅ Connected! Found ${data?.length || 0} records`);
      
      // Test fetch specific content
      const { data: homeData, error: homeError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'home')
        .single();

      if (homeError && homeError.code !== 'PGRST116') {
        console.error('❌ Error fetching home:', homeError);
      } else {
        console.log('✅ Home data:', homeData);
      }

    } catch (error: any) {
      console.error('❌ Connection test failed:', error);
      setConnectionStatus(`❌ Failed: ${error.message}`);
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRealTimeUpdate = async () => {
    if (!supabase) return;

    try {
      const testData = {
        slug: 'home',
        content: {
          test: true,
          timestamp: new Date().toISOString(),
          message: 'This is a real-time test update from debug panel',
          hero: {
            title: "TEST UPDATE - " + new Date().toLocaleTimeString(),
            subtitle: "If you see this, real-time updates are working!",
            description: "Updated at " + new Date().toLocaleString()
          }
        }
      };

      console.log('📤 Sending test update:', testData);

      const { data, error } = await supabase
        .from('pages')
        .upsert(testData, { onConflict: 'slug' })
        .select();

      if (error) {
        console.error('❌ Update test failed:', error);
        toast.error(`Update failed: ${error.message}`);
      } else {
        console.log('✅ Update successful:', data);
        toast.success('Update test successful! Check the homepage to see if it updated immediately.');
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

        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button onClick={testRealTimeUpdate} variant="outline">
            Test Update
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
