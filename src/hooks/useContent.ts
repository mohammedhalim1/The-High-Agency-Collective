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
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
          throw error
        }

        return data
      } catch (error) {
        console.warn('Failed to fetch content from Supabase:', error)
        return null
      }
    },
    staleTime: 0, // Always fetch fresh data
    cacheTime: 1000 * 60 * 2, // Keep in cache for 2 minutes only
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on component mount
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
            // Invalidate queries when content changes
            queryClient.invalidateQueries({ queryKey: ['page-content', slug] })
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
