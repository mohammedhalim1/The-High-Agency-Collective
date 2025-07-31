import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries into their own chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          'supabase': ['@supabase/supabase-js', '@supabase/ssr'],
          'query': ['@tanstack/react-query'],
          'charts': ['recharts'],
          'utils': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'date-fns',
            'uuid'
          ]
        }
      }
    },
    // Increase chunk size warning limit to 600kb
    chunkSizeWarningLimit: 600,
    // Enable source maps for better debugging in production
    sourcemap: mode === 'development'
  }
}));
