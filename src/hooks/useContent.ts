import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseReady } from '@/lib/supabase'
import { toast } from 'sonner'

export interface PageContent {
  id?: string
  slug: string
  content: any
  updated_at?: string
}

// Hook to fetch page content
export function usePageContent(slug: string) {
  return useQuery({
    queryKey: ['page-content', slug],
    queryFn: async () => {
      if (!supabase || !isSupabaseReady()) {
        console.warn('Supabase not configured. Using fallback content.')
        return null
      }

      try {
        const timestamp = Date.now()
        const fetchId = Math.random().toString(36).substr(2, 9)

        console.group(`🔍 SUPABASE FETCH [${fetchId}] - ${slug}`)
        console.log('🕐 Start Time:', new Date(timestamp).toISOString())
        console.log('📍 URL:', import.meta.env.VITE_SUPABASE_URL + '/rest/v1/pages')
        console.log('🔑 Using Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No')
        console.log('🎯 Target Slug:', slug)
        console.log('🌐 Browser:', navigator.userAgent.split(' ').pop())
        console.log('🔄 Network Mode: Fresh fetch (no cache)')

        const startPerformance = performance.now()

        // Force fresh fetch with cache busting - add timestamp to prevent ANY caching
        const { data, error, status, statusText, count } = await supabase
          .from('pages')
          .select('*', { count: 'exact' })
          .eq('slug', slug)
          .order('updated_at', { ascending: false }) // Get latest version
          .single()

        const endPerformance = performance.now()
        const duration = endPerformance - startPerformance

        console.log('⏱️ Request Duration:', `${duration.toFixed(2)}ms`)
        console.log('📊 Response Status:', status, statusText)
        console.log('📈 Total Count:', count)

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
          console.error(`❌ Supabase error for ${slug}:`, {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            fullError: error
          })
          throw error
        }

        if (data) {
          console.log(`✅ FRESH content loaded for ${slug} (updated: ${data.updated_at})`)
          console.log('Fresh content preview:', {
            slug: data.slug,
            updated_at: data.updated_at,
            hasContent: !!data.content,
            fetchedAt: new Date().toISOString()
          })
        } else {
          console.log(`ℹ️ No content found for ${slug}, will use defaults`)
        }

        return data
      } catch (error: any) {
        console.error(`⚠️ Failed to fetch content from Supabase for ${slug}:`, {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          stack: error?.stack,
          fullError: error
        })
        return null
      }
    },
    // ZERO CACHING - Always fetch fresh data from Supabase
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't cache anything (was cacheTime in v4)
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchInterval: false, // Don't auto-refetch on interval
    retry: 2, // Retry failed requests
    networkMode: 'always', // Always attempt to fetch
  })
}

// Hook to update page content
export function useUpdatePageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ slug, content }: { slug: string; content: any }) => {
      if (!supabase || !isSupabaseReady()) {
        throw new Error('Supabase is not configured. Please set up your Supabase credentials to save content.')
      }

      const { data, error } = await supabase
        .from('pages')
        .upsert(
          { slug, content, updated_at: new Date().toISOString() },
          { onConflict: 'slug' }
        )
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Invalidate and refetch the specific page content AND all related queries
      queryClient.invalidateQueries({ queryKey: ['page-content', data.slug] })
      queryClient.refetchQueries({ queryKey: ['page-content', data.slug] })

      // Also invalidate all page content queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['page-content'] })

      toast.success('Content updated successfully! Changes should appear for all users.')
      console.log('✅ Content updated and cache invalidated for:', data.slug)
    },
    onError: (error: any) => {
      if (error.message.includes('Supabase is not configured')) {
        toast.error('Please configure Supabase to save content. Check your .env.local file.')
      } else {
        toast.error(`Failed to update content: ${error.message}`)
      }
    },
  })
}

// Hook for auto-save functionality
export function useAutoSave(slug: string, content: any, delay = 2000) {
  const updateContent = useUpdatePageContent()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!content) return

    const timer = setTimeout(async () => {
      try {
        setIsSaving(true)
        await updateContent.mutateAsync({ slug, content })
        setLastSaved(new Date())
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [content, slug, delay])

  return { lastSaved, isSaving }
}

// Force refresh all content (useful for debugging)
export function useForceRefresh() {
  const queryClient = useQueryClient()

  return () => {
    console.log('🔄 Force refreshing all content...')
    queryClient.invalidateQueries({ queryKey: ['page-content'] })
    queryClient.refetchQueries({ queryKey: ['page-content'] })
    toast.info('Refreshing all content...')
  }
}

// Ultra-fresh data hook - forces network fetch on every component mount
export function useUltraFreshPageContent(slug: string) {
  const { data, isLoading, error, refetch } = usePageContent(slug);

  useEffect(() => {
    // Force a fresh fetch on every component mount
    console.log(`🚀 ULTRA-FRESH: Force fetching fresh data for ${slug}`);
    refetch();
  }, [slug, refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to listen for real-time content changes
export function useRealtimeContent(slug: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!supabase || !isSupabaseReady()) {
      console.warn('Supabase not configured. Real-time updates disabled.')
      return
    }

    try {
      const channel = supabase
        .channel(`page-content-${slug}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pages',
            filter: `slug=eq.${slug}`,
          },
          (payload) => {
            console.log('🔄 Real-time update received for:', slug, payload)
            // Invalidate and immediately refetch when content changes
            queryClient.invalidateQueries({ queryKey: ['page-content', slug] })
            queryClient.refetchQueries({ queryKey: ['page-content', slug] })

            // Show a toast notification for real-time updates
            if (payload.eventType === 'UPDATE') {
              toast.info('Page content updated! Refreshing...')
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.warn('Failed to set up real-time updates:', error)
    }
  }, [slug, queryClient])
}
