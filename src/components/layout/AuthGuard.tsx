'use client';
import { useEffect, useState, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const sbRef = useRef(createClient(SUPABASE_URL, SUPABASE_ANON));

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return; }
      setReady(true);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      if (!session) { router.replace('/auth/login'); }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  return <>{children}</>;
}
