import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esycojhodxcymcrfynxm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeWNvamhvZHhjeW1jcmZ5bnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDMwMzgsImV4cCI6MjA2ODUxOTAzOH0.i8zj-O-OyWgk-52RxWO9xR1BgJ0wE7IjC9-GjvAUwTk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Basic connection and table list
    console.log('\n1. Testing basic connection...')
    const { data: tables, error: tablesError } = await supabase
      .from('pages')
      .select('*')
      .limit(1)
    
    if (tablesError) {
      console.log('❌ Error accessing pages table:', tablesError.message)
      console.log('Full error:', tablesError)
    } else {
      console.log('✅ Successfully connected to pages table')
      console.log('Sample data:', tables)
    }

    // Test 2: Try to fetch specific content
    console.log('\n2. Testing content fetching...')
    const { data: homeData, error: homeError } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .single()
    
    if (homeError) {
      console.log('❌ Error fetching home content:', homeError.message)
      console.log('Error code:', homeError.code)
    } else {
      console.log('✅ Successfully fetched home content')
      console.log('Home data:', JSON.stringify(homeData, null, 2))
    }

    // Test 3: List all available pages
    console.log('\n3. Listing all pages...')
    const { data: allPages, error: allError } = await supabase
      .from('pages')
      .select('slug, updated_at')
    
    if (allError) {
      console.log('❌ Error listing pages:', allError.message)
    } else {
      console.log('✅ Available pages:')
      allPages.forEach(page => {
        console.log(`  - ${page.slug} (updated: ${page.updated_at})`)
      })
    }

    // Test 4: Check RLS policies
    console.log('\n4. Testing insert permissions...')
    const { data: insertTest, error: insertError } = await supabase
      .from('pages')
      .upsert({ slug: 'test-' + Date.now(), content: { test: true } })
      .select()
    
    if (insertError) {
      console.log('❌ Insert permission error:', insertError.message)
      console.log('This might indicate RLS (Row Level Security) is blocking inserts')
    } else {
      console.log('✅ Insert permissions working')
      
      // Clean up test data
      await supabase
        .from('pages')
        .delete()
        .eq('slug', insertTest[0].slug)
    }

  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
  }
}

testConnection()
