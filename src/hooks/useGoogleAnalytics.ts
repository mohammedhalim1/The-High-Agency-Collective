import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    console.log('Google Analytics loaded with ID:', id);
  }
};

export const useGoogleAnalytics = () => {
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('analytics_id')
          .single();

        if (!error && data?.analytics_id) {
          const analyticsId = data.analytics_id.trim();
          // Validate the format
          const isValid = /^(G-[A-Z0-9]{10}|UA-\d{4,9}-\d{1,4})$/.test(analyticsId);
          if (isValid) {
            insertAnalyticsScript(analyticsId);
          }
        }
      } catch (err) {
        // Silently fail - analytics is not critical
        console.log('Analytics auto-load failed:', err);
      }
    };

    loadAnalytics();
  }, []);
};

export { insertAnalyticsScript };
