'use client';
import Link from 'next/link';

export default function TopBar() {
  return (
    <header style={{
      height: 56, borderBottom: '1px solid var(--border-base)', display: 'flex',
      alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', gap: 12,
      background: 'var(--bg-base)', position: 'sticky', top: 0, zIndex: 10
    }}>
      <Link href="/dashboard/settings?tab=billing" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-purple)', background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.25)', padding: '5px 14px', borderRadius: 20, textDecoration: 'none' }}>Upgrade</Link>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>U</div>
    </header>
  );
}
