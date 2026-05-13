'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(async ({ data: { session } }: any) => {
      if (!session) { router.replace('/auth/login'); return; }
      setUser(session.user);
      const { data } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data);
      setReady(true);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e: any, session: any) => {
      if (!session) { router.replace('/auth/login'); return; }
      setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className="app-shell">
      <Sidebar profile={profile} />
      <div className="main-wrap">
        <Topbar user={user} profile={profile} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
