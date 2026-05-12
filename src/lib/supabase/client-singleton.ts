import { createBrowserClient } from '@supabase/ssr';

export const SUPABASE_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
export const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';

// Single instance — created once, reused everywhere
let _client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // SSR: return a fresh client (won't be stored)
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  }
  if (!_client) {
    _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _client;
}

// Backward-compatible named export used by existing pages
// This is the actual Supabase client instance
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop) {
    return (getSupabaseClient() as any)[prop];
  }
});
