import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Settings {
  analytics_id: string;
  site_domain: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({
    analytics_id: '',
    site_domain: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        .select('analytics_id, site_domain')
        .single();

      if (error) {
        // If no settings record exists, use empty defaults
        if (error.code === 'PGRST116') {
          setSettings({ analytics_id: '', site_domain: '' });
        } else {
          throw error;
        }
      } else {
        setSettings({
          analytics_id: data.analytics_id || '',
          site_domain: data.site_domain || ''
        });
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
          site_domain: settings.site_domain,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }

      setHasChanges(false);
      toast.success('Settings saved successfully!');
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
      [field]: value
    }));
    setHasChanges(true);
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Site Settings
          {hasChanges && (
            <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Manage your website's global settings and analytics configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="analytics_id">Google Analytics ID</Label>
            <Input
              id="analytics_id"
              type="text"
              value={settings.analytics_id}
              onChange={(e) => handleInputChange('analytics_id', e.target.value)}
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)
            </p>
          </div>

          <div>
            <Label htmlFor="site_domain">Website Domain</Label>
            <Input
              id="site_domain"
              type="text"
              value={settings.site_domain}
              onChange={(e) => handleInputChange('site_domain', e.target.value)}
              placeholder="example.com"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your website's primary domain (without https://)
            </p>
          </div>
        </div>

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

          <Button
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
            className="min-w-[120px]"
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
