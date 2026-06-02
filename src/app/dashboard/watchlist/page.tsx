'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface WatchItem { id: string; niche: string; score: number; added: string; trend: string; }

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_watchlist' }) })
      .then(r => r.json())
      .then(d => { setItems(d.watchlist || []); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#3b82f622', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Watchlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Niches you are tracking</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '40px 0' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading watchlist...
        </div>
      ) : items.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-base)', padding: '48px', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', display: 'block' }}>
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Your watchlist is empty</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Save niches from Trending or Daily Picks to track them here.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/dashboard/trending" style={{ background: 'var(--brand-purple)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Browse Trending</Link>
            <Link href="/dashboard/daily-picks" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, border: '1px solid var(--border-base)' }}>Daily Picks</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.niche}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Added {item.added} · Trend: {item.trend}</div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: item.score >= 80 ? '#22c55e' : '#f59e0b' }}>{item.score}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
