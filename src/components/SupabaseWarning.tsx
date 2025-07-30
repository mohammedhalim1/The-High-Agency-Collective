import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ExternalLink, Settings } from 'lucide-react'

export default function SupabaseWarning() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-2xl">Supabase Configuration Required</CardTitle>
          </div>
          <CardDescription>
            The admin panel requires Supabase to be configured to manage content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertTitle>Configuration Missing</AlertTitle>
            <AlertDescription>
              Your Supabase environment variables are not properly configured. 
              The website will display fallback content, but the admin panel won't work.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Copy your Project URL and anon key from Settings → API</li>
              <li>Update the <code className="bg-gray-100 px-1 rounded">.env.local</code> file with your credentials</li>
              <li>Run the SQL setup commands from <code className="bg-gray-100 px-1 rounded">supabase-setup.md</code></li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Expected .env.local format:</p>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
            </pre>
          </div>

          <div className="flex space-x-3">
            <Button asChild>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase Dashboard
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Note:</strong> The public website will continue to work with fallback content. 
              Only the admin panel functionality requires Supabase configuration.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
