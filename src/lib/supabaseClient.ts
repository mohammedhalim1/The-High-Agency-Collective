import { createClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  return url && 
         key && 
         url !== 'your_supabase_project_url_here' && 
         key !== 'your_supabase_anon_key_here' &&
         url.startsWith('http')
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
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
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
