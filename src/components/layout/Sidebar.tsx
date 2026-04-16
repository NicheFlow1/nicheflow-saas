'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Radio, TrendingUp, Settings, LogOut, Zap, MessageCircle, BookOpen, Library } from 'lucide-react';
import { supabase } from '@/lib/supabase/client-singleton';
import type { Profile } from '@/types/database';
import { PLAN_LIMITS } from '@/types/database';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/autopilot', label: 'Autopilot', icon: Zap, badge: 'NEW' },
  { href: '/validate', label: 'Validate Trend', icon: Search },
  { href: '/radar', label: 'Market Radar', icon: Radio },
  { href: '/ai-chat', label: 'AI Assistant', icon: MessageCircle },
  { href: '/content', label: 'Content Studio', icon: Library },
  { href: '/projects', label: 'Past Reports', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NicheFlowLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg1)"/>
      <path d="M16 6 L12 16 L17 16 L14 26 L22 14 L17 14 L20 6 Z" fill="white" opacity="0.95"/>
      <circle cx="8" cy="10" r="2" fill="white" opacity="0.4"/>
      <circle cx="24" cy="22" r="1.5" fill="white" opacity="0.3"/>
    </svg>
  );
}

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const plan = (profile?.plan || 'free') as keyof typeof PLAN_LIMITS;
  const used = profile?.generations_used || 0;
  const limit = profile?.generations_limit || 7;
  const pct = Math.min((used / limit) * 100, 100);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <NicheFlowLogo />
        <div>
          <div className="logo-text">NicheFlow</div>
          <div className="logo-badge">AI SCOUT</div>
        </div>
      </div>
      <nav className="nav-section">
        <div className="nav-label">Navigation</div>
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} className={'nav-item' + (active ? ' active' : '')}>
              <Icon size={14} />{label}
              {badge && <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'rgba(99,102,241,.15)', color: 'var(--brand-purple)', border: '1px solid rgba(99,102,241,.2)', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '.05em' }}>{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="usage-widget">
          <div className="usage-label">
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{PLAN_LIMITS[plan]?.label || 'Free'}</span>
            <span style={{ fontSize: 10, color: 'var(--text-disabled)' }}>{used}/{limit}</span>
          </div>
          <div className="usage-track"><div className="usage-fill" style={{ width: pct + '%' }} /></div>
          {plan === 'free' && <Link href="/settings/billing" style={{ display: 'block', marginTop: 8, fontSize: 10, color: 'var(--brand-purple)', textDecoration: 'none', fontWeight: 600 }}>Upgrade to Pro &rarr;</Link>}
        </div>
        <button className="btn-signout" onClick={signOut}><LogOut size={13} />Sign out</button>
      </div>
    </aside>
  );
}
