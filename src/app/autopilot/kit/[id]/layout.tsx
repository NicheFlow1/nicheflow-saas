'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client-singleton';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function KitLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return; }
      setUser(session.user);
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data);
      setReady(true);
    });
  }, []);

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 22, height: 22, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)' }} />
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
