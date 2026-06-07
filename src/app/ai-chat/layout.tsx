'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Sidebar from '@/components/layout/Sidebar';
const SB = createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U');
export default function AIChatLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<{ email?: string; full_name?: string } | null>(null);
  useEffect(() => { SB.auth.getSession().then(({ data: { session } }) => { if (session?.user) setProfile({ email: session.user.email, full_name: session.user.user_metadata?.full_name }); }); }, []);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: '220px', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>{children}</main>
    </div>
  );
}
