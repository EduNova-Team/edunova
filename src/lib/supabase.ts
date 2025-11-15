import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ianictilujmixjgyalhv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbmljdGlsdWptaXhqZ3lhbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjg2MTQsImV4cCI6MjA3ODc0NDYxNH0.39nzt-cLTzBpql92GTBFNDpNYb84O6nSLmEuRmx7uhk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

