import { useState, useEffect } from 'react';
import { usePageContent } from '@/hooks/useContent';

interface PageFetchVerificationProps {
  slug: string;
  show?: boolean;
}

const PageFetchVerification = ({ slug, show = false }: PageFetchVerificationProps) => {
  const { data, isLoading, error } = usePageContent(slug);
  const [fetchHistory, setFetchHistory] = useState<Array<{
    timestamp: string;
    source: 'supabase' | 'fallback';
    data?: any;
    error?: any;
  }>>([]);

  useEffect(() => {
    const entry = {
      timestamp: new Date().toISOString(),
      source: data ? 'supabase' : 'fallback' as const,
      data: data ? {
        slug: data.slug,
        updated_at: data.updated_at,
        hasContent: !!data.content
      } : null,
      error: error ? {
        message: error.message,
        code: error.code
      } : null
    };

    setFetchHistory(prev => [entry, ...prev].slice(0, 10));
  }, [data, error]);

  if (!show) return null;

  return (
    <div className="fixed top-0 right-0 w-80 h-screen bg-black bg-opacity-90 text-white p-4 overflow-auto z-50 text-xs">
      <div className="space-y-4">
        <div className="border-b border-gray-600 pb-2">
          <h3 className="font-bold">🔍 Page Fetch Verification</h3>
          <p>Slug: <span className="text-yellow-300">{slug}</span></p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Current Status:</h4>
          <div className="bg-gray-800 p-2 rounded">
            <p>Loading: {isLoading ? '🔄 Yes' : '✅ No'}</p>
            <p>Data Source: {data ? '🌐 Supabase' : '📄 Fallback'}</p>
            <p>Has Error: {error ? '❌ Yes' : '✅ No'}</p>
            <p>Last Updated: {data?.updated_at || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Fetch History:</h4>
          <div className="space-y-2">
            {fetchHistory.map((entry, index) => (
              <div 
                key={index}
                className={`p-2 rounded text-xs ${
                  entry.source === 'supabase' ? 'bg-green-800' : 'bg-orange-800'
                }`}
              >
                <div className="flex justify-between">
                  <span>{entry.source === 'supabase' ? '🌐 Supabase' : '📄 Fallback'}</span>
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
                {entry.data && (
                  <div className="mt-1 opacity-75">
                    Updated: {entry.data.updated_at}
                  </div>
                )}
                {entry.error && (
                  <div className="mt-1 text-red-300">
                    Error: {entry.error.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs opacity-75">
          <p>🔄 Refresh page to see fresh fetch</p>
          <p>🌐 Green = Supabase data</p>
          <p>📄 Orange = Fallback data</p>
        </div>
      </div>
    </div>
  );
};

export default PageFetchVerification;
