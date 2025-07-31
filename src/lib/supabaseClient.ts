import { createClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  console.log('🔍 Checking Supabase configuration:', {
    url: url ? '✅ Set' : '❌ Missing',
    urlValue: url,
    key: key ? '✅ Set' : '❌ Missing',
    keyPrefix: key ? `${key.substring(0, 20)}...` : 'None',
    isValidUrl: url?.startsWith('https://'),
    containsSupabase: url?.includes('supabase.co')
  })

  const isConfigured = url &&
         key &&
         url !== 'your_supabase_project_url_here' &&
         key !== 'your_supabase_anon_key_here' &&
         url.startsWith('http')

  console.log('🎯 Supabase configuration result:', isConfigured ? '✅ Valid' : '❌ Invalid')

  return isConfigured
}

// Create Supabase client wrapper
let supabaseClient: any = null

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  if (!supabaseClient) {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // Create client with cache-busting headers
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Supabase-Cache-Bust': Date.now().toString()
          }
        }
      })

      console.log('✅ Supabase client created with cache-busting headers')
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      return null
    }
  }

  return supabaseClient
}

export const isSupabaseReady = () => {
  return isSupabaseConfigured() && getSupabaseClient() !== null
}

// Export the client (will be null if not configured)
export const supabase = getSupabaseClient()

// Types for our content management
export interface PageContent {
  id?: string
  slug: string
  content: any
  updated_at?: string
}

export interface ImageUpload {
  file: File
  path: string
}
