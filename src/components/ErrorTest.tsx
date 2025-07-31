import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ErrorTest = () => {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const testSupabase = async () => {
      const logs: string[] = [];
      
      logs.push('🔍 Starting Supabase error diagnosis...');
      logs.push(`URL: ${import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}`);
      logs.push(`Key: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`);
      logs.push(`Client exists: ${!!supabase}`);
      
      if (supabase) {
        try {
          logs.push('Attempting to query pages table...');
          const { data, error } = await supabase
            .from('pages')
            .select('*')
            .limit(1);
            
          if (error) {
            logs.push(`❌ ERROR DETAILS:`);
            logs.push(`  Message: ${error.message}`);
            logs.push(`  Code: ${error.code}`);
            logs.push(`  Details: ${error.details}`);
            logs.push(`  Hint: ${error.hint}`);
            logs.push(`  Full error: ${JSON.stringify(error, null, 2)}`);
          } else {
            logs.push(`✅ Success! Data: ${JSON.stringify(data)}`);
          }
        } catch (err: any) {
          logs.push(`❌ CATCH ERROR:`);
          logs.push(`  Message: ${err.message}`);
          logs.push(`  Name: ${err.name}`);
          logs.push(`  Stack: ${err.stack}`);
        }
      } else {
        logs.push('❌ Supabase client is null');
      }
      
      setResults(logs);
      console.log('Error test results:', logs);
    };

    testSupabase();
  }, []);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
      <h3 className="font-bold mb-2">🐛 Error Diagnosis</h3>
      <div className="text-xs font-mono space-y-1 max-h-60 overflow-auto">
        {results.map((result, index) => (
          <div key={index} className={
            result.includes('❌') ? 'text-red-600' : 
            result.includes('✅') ? 'text-green-600' : 
            'text-gray-700'
          }>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorTest;
