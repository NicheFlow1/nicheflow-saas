'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const QUICK = [
  { href: '/autopilot',          label: 'Autopilot',           desc: 'AI-powered daily market briefing',  icon: 'M13 10V3L4 14h7v7l9-11h-7z',                                                                                                                                                                                                                                                                                                                   color: '#7c3aed' },
  { href: '/dashboard/trending', label: 'Trending Now',        desc: 'What is blowing up right now',      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',                                                                                                                                                                                                                                                                                                                  color: '#ef4444' },
  { href: '/validate',           label: 'Validate Trend',      desc: 'Score any niche in seconds',        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                                                                                                                                                                                                                                    color: '#22c55e' },
  { href: '/radar',              label: 'Market Radar',        desc: 'Track and signal your markets',     icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', color: '#3b82f6' },
  { href: '/dashboard/keywords', label: 'Keyword Clusters',    desc: 'SEO clusters with intent data',     icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',                                                                                                                      color: '#f59e0b' },
  { href: '/generator',          label: 'Intelligence Engine', desc: 'Deep market analysis',              icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',                                 color: '#6366f1' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ generations: 0, limit: 10, reports: 0, kits: 0, plan: 'FREE' });

  useEffect(() => {
    fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_stats' }) })
      .then(r => r.json()).then(d => { if (d.stats) setStats(d.stats); }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'GENERATIONS', value: `${stats.generations}/${stats.limit}`, accent: '#7c3aed' },
    { label: 'REPORTS',     value: String(stats.reports),                 accent: '#22c55e' },
    { label: 'STARTER KITS',value: String(stats.kits),                   accent: '#f59e0b' },
    { label: 'PLAN',        value: stats.plan,                            accent: '#3b82f6' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Welcome back. Here is your market intelligence overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '20px', borderTop: '3px solid ' + s.accent }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>Quick Access</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
        {QUICK.map(({ href, label, desc, icon, color }) => (
          <Link key={href} href={href} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon} />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feature banners */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link href="/dashboard/daily-picks" style={{ background: 'linear-gradient(135deg,#7c3aed22,#4f46e522)', borderRadius: '14px', border: '1px solid #7c3aed44', padding: '24px', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#7c3aed' }}>Today\'s Daily Picks</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>5 AI-curated niche opportunities waiting for you today.</p>
        </Link>
        <Link href="/dashboard/watchlist" style={{ background: 'linear-gradient(135deg,#3b82f622,#06b6d422)', borderRadius: '14px', border: '1px solid #3b82f644', padding: '24px', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#3b82f6' }}>My Watchlist</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Track and re-analyze your saved niches.</p>
        </Link>
      </div>
    </div>
  );
}
