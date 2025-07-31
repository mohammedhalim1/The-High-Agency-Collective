import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import SetupInstructions from './SetupInstructions';

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    gtagScriptAdded?: boolean;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Function to dynamically insert Google Analytics script
const insertAnalyticsScript = (id: string) => {
  if (!window.gtagScriptAdded && id) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');
    `;
    document.head.appendChild(script2);

    window.gtagScriptAdded = true;
    console.log('Google Analytics script loaded with ID:', id);
  }
};

interface Settings {
  analytics_id: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({
    analytics_id: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableExists, setTableExists] = useState(true);

  // Fetch settings from Supabase
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await supabase
        .from('settings')
        .select('analytics_id')
        .single();

      if (error) {
        // If no settings record exists, use empty defaults
        if (error.code === 'PGRST116') {
          setSettings({ analytics_id: '' });
          setTableExists(true);
        } else if (error.code === '42P01') {
          // Table doesn't exist
          setTableExists(false);
          setSettings({ analytics_id: '' });
        } else {
          throw error;
        }
      } else {
        setSettings({
          analytics_id: data.analytics_id || ''
        });
        setTableExists(true);
      }
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
      setError(err.message);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to Supabase
  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1, // Assuming single settings record with id 1
          analytics_id: settings.analytics_id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }

      // If analytics_id is provided and valid, load Google Analytics
      if (settings.analytics_id && isValidAnalyticsId(settings.analytics_id)) {
        insertAnalyticsScript(settings.analytics_id);
        toast.success('Settings saved and Google Analytics loaded successfully!');
      } else {
        toast.success('Settings saved successfully!');
      }

      setHasChanges(false);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setError(err.message);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value.trim()
    }));
    setHasChanges(true);
    // Clear any existing errors when user starts typing
    if (error) setError(null);
  };

  // Validate Google Analytics ID format
  const isValidAnalyticsId = (id: string) => {
    if (!id) return true; // Empty is valid
    return /^(G-[A-Z0-9]{10}|UA-\d{4,9}-\d{1,4})$/.test(id);
  };



  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && !isSaving) {
          saveSettings();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, isSaving]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">Loading settings...</span>
        </CardContent>
      </Card>
    );
  }

  // Show setup instructions if table doesn't exist
  if (!tableExists) {
    return <SetupInstructions />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Site Settings
              {hasChanges && (
                <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Manage your Google Analytics tracking configuration
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (hasChanges && !isSaving) {
              saveSettings();
            }
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="analytics_id">Google Analytics ID</Label>
            <Input
              id="analytics_id"
              type="text"
              value={settings.analytics_id}
              onChange={(e) => handleInputChange('analytics_id', e.target.value)}
              placeholder="G-P7J6CX2JV8"
              className={`mt-1 ${
                settings.analytics_id && !isValidAnalyticsId(settings.analytics_id)
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }`}
            />
            {settings.analytics_id && !isValidAnalyticsId(settings.analytics_id) ? (
              <p className="text-sm text-red-600 mt-1">
                Please enter a valid Google Analytics ID (G-XXXXXXXXXX or UA-XXXXXXXXX-X)
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)
              </p>
            )}
          </div>


        </form>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {!hasChanges && !isSaving && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                All changes saved
              </>
            )}
            {hasChanges && (
              <>
                <AlertCircle className="h-4 w-4 text-orange-500" />
                You have unsaved changes
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={
                !hasChanges ||
                isSaving ||
                (settings.analytics_id && !isValidAnalyticsId(settings.analytics_id))
              }
              className="min-w-[120px]"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <p className="text-xs text-gray-500 text-right">Press Ctrl+S to save</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
