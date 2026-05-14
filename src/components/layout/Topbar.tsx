'use client';
import React from 'react';
import Link from 'next/link';

interface TopbarProps { user?: any; profile?: any; }

export default function Topbar({ user, profile }: TopbarProps) {
  const plan = profile?.plan || 'free';
  const initials = (user?.email || 'U')[0].toUpperCase();
  return (
    <header style={{ height: 56, borderBottom: '1px solid var(--border-base)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', gap: 12, background: 'var(--bg-base)', position: 'sticky', top: 0, zIndex: 10 }}>
      {plan === 'free' && (
        <Link href="/settings/billing" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-purple)', background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.25)', padding: '5px 14px', borderRadius: 20, textDecoration: 'none' }}>
          Upgrade
        </Link>
      )}
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
        {initials}
      </div>
    </header>
  );
}
