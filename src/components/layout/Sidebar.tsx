'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',       label: 'Dashboard',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/daily-picks',     label: 'Daily Picks',    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { href: '/trending',        label: 'Trending',       icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { href: '/watchlist',       label: 'Watchlist',      icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
  { href: '/keywords',        label: 'Keywords',       icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { href: '/audience',        label: 'Audience',       icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { section: 'AI Tools' },
  { href: '/autopilot',       label: 'Autopilot',      icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/validate',        label: 'Validate',       icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/radar',           label: 'Radar',          icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
  { href: '/generator',       label: 'Generator',      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  { href: '/content',         label: 'Content Studio', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { href: '/ai-chat',         label: 'AI Chat',        icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { section: 'Account' },
  { href: '/projects',        label: 'Reports',        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href: '/settings',        label: 'Settings',       icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function Sidebar({ profile }: { profile?: null | { email?: string; full_name?: string } }) {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, width: '220px', height: '100vh',
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 100, overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>NicheFlow</div>
            <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pro</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={idx} style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '10px 10px 4px', marginTop: idx === 0 ? 0 : 6 }}>
                {item.section}
              </div>
            );
          }
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href!));
          return (
            <Link key={item.href} href={item.href!} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 10px', borderRadius: '8px', marginBottom: '1px',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
              textDecoration: 'none', fontSize: '13px', fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={item.icon}/>
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {profile?.full_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'N'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name || 'NicheFlow User'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.email || 'Pro plan'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
