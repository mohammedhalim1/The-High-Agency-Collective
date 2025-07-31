import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Copy, CheckCircle } from 'lucide-react';

export default function SetupInstructions() {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Create settings table for website configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  analytics_id TEXT,
  site_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default record
INSERT INTO settings (id, analytics_id, site_domain) 
VALUES (1, '', '') 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on settings" ON settings
  USING (true)
  WITH CHECK (true);`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Database className="h-5 w-5" />
          Database Setup Required
        </CardTitle>
        <CardDescription className="text-blue-700">
          Run this SQL script in your Supabase dashboard to create the settings table
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">SQL Script:</span>
            <Button
              onClick={copyToClipboard}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">
            {sqlScript}
          </pre>
        </div>
        
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-2">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Copy the SQL script above</li>
            <li>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
            <li>Go to the SQL Editor</li>
            <li>Paste and run the script</li>
            <li>Refresh this page to start managing settings</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
