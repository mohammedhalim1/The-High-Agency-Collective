import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esycojhodxcymcrfynxm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeWNvamhvZHhjeW1jcmZ5bnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDMwMzgsImV4cCI6MjA2ODUxOTAzOH0.i8zj-O-OyWgk-52RxWO9xR1BgJ0wE7IjC9-GjvAUwTk'

export const supabase = createClient(supabaseUrl, supabaseKey)
