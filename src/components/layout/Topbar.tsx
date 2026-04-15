'use client';
import React from 'react';
import { Zap, Bell } from 'lucide-react';
import Link from 'next/link';

export default function Topbar({ user, profile }: { user: any; profile: any }) {
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'NF';
  const plan = profile?.plan || 'free';

  return (
    <header style={{ height: 56, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'var(--bg-base)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(99,102,241,.3)' }}>
          <Zap size={13} style={{ color: 'white' }} />
        </div>
        <div>
          <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-.02em', color: 'var(--text-primary)' }}>NicheFlow</span>
          <span style={{ fontSize: 8, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.08em', marginLeft: 5 }}>AI SCOUT</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {plan === 'free' && (
          <Link href="/settings/billing" style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-purple)', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', padding: '4px 10px', borderRadius: 6, textDecoration: 'none' }}>
            Upgrade
          </Link>
        )}
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', cursor: 'pointer' }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
