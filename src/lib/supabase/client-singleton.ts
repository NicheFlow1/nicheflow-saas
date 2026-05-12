import { createBrowserClient } from '@supabase/ssr';

export const SUPABASE_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
export const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';

let _instance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!_instance) {
    _instance = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _instance;
}

// Named export so existing imports like: import { supabase } from '...' still work
export const supabase = {
  get auth() { return getSupabaseClient().auth; },
  from: (table: string) => getSupabaseClient().from(table),
};
