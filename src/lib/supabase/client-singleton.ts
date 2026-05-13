import { createBrowserClient } from '@supabase/ssr';

export const SUPABASE_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
export const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';

let _client: any = null;

function getClient() {
  if (typeof window === 'undefined') return createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  if (!_client) _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  return _client;
}

export function getSupabaseClient() { return getClient(); }

export const supabase = new Proxy({} as any, {
  get(_t, prop) { return (getClient() as any)[prop]; }
});

export const PLAN_LIMITS: Record<string, number> = { free: 7, pro: 100, agency: 500 };
export type Profile = { id: string; plan: string; generations_used: number; generations_limit: number; full_name?: string; avatar_url?: string; };
