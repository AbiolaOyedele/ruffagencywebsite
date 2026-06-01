import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'

/**
 * Single Supabase client for both server and client contexts.
 * All CMS data is publicly readable — anon key is safe here.
 */
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
