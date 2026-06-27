'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const QUICK = [
  { href: '/dashboard/daily-picks', label: 'Daily Picks',    color: '#7c3aed', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', desc: '5 AI-curated picks today' },
  { href: '/validate',               label: 'Validate Niche', color: '#10b981', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', desc: 'Score any niche instantly' },
  { href: '/radar',                  label: 'Radar',          color: '#f59e0b', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0', desc: 'Spot emerging trends' },
  { href: '/autopilot',              label: 'Autopilot',      color: '#3b82f6', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Full AI market research' },
  { href: '/dashboard/keywords',     label: 'Keywords',       color: '#ef4444', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', desc: 'SEO keyword clusters' },
  { href: '/generator',              label: 'Generator',      color: '#8b5cf6', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', desc: 'Business idea generator' },
];

type Stats = { validations: number; watchlist: number; kits: number; reports: number };

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [stats, setStats] = useState<Stats>({ validations: 0, watchlist: 0, kits: 0, reports: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    SB.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) return;
      const uid = session.user.id;
      const [v, w, k, r] = await Promise.all([
        SB.from('niche_validations').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        SB.from('watchlist').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        SB.from('starter_kits').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        SB.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      ]);
      setStats({
        validations: v.count ?? 0,
        watchlist:   w.count ?? 0,
        kits:        k.count ?? 0,
        reports:     r.count ?? 0,
      });
      setStatsLoaded(true);
    });
  }, []);

  const STATS = [
    { label: 'Niches Validated', value: statsLoaded ? String(stats.validations) : '—', delta: 'total validations',  color: '#7c3aed' },
    { label: 'Watchlist',        value: statsLoaded ? String(stats.watchlist)   : '—', delta: 'niches tracked',     color: '#10b981' },
    { label: 'Starter Kits',     value: statsLoaded ? String(stats.kits)        : '—', delta: 'kits generated',     color: '#f59e0b' },
    { label: 'Reports',          value: statsLoaded ? String(stats.reports)     : '—', delta: 'saved reports',      color: '#3b82f6' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          {greet}{user?.email ? ', ' + user.email.split('@')[0] : ''}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — Here&apos;s your niche intelligence briefing.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {QUICK.map(q => (
            <Link key={q.href} href={q.href} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = q.color}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: q.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={q.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={q.icon}/></svg>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{q.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{q.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed22, #4f46e522)', border: '1px solid var(--accent)', borderRadius: '16px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Today&apos;s AI picks are ready</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>5 fresh niche opportunities curated by NicheFlow AI — updated every 24 hours.</div>
        </div>
        <Link href="/dashboard/daily-picks" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
          View Picks →
        </Link>
      </div>
    </div>
  );
}
