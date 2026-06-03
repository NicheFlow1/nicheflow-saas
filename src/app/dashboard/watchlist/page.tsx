'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U');

interface WatchItem { id: string; niche: string; score: number; signal: string; category: string; notes: string; last_checked: string; created_at: string; }

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = async () => {
    const { data: { session } } = await SB.auth.getSession();
    const token = session?.access_token || '';
    try {
      const r = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'watchlist_get' }) });
      const d = await r.json();
      setItems(d.items || []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    setRemoving(id);
    const { data: { session } } = await SB.auth.getSession();
    await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` }, body: JSON.stringify({ action: 'watchlist_remove', id }) });
    setItems(prev => prev.filter(i => i.id !== id));
    setRemoving(null);
  };

  const signalColor = (s: string) => s === 'GO' ? '#22c55e' : s === 'WATCH' ? '#f59e0b' : '#ef4444';
  const scoreColor = (s: number) => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Watchlist</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0' }}>{items.length} niche{items.length !== 1 ? 's' : ''} being tracked</p>
          </div>
        </div>
        <Link href="/dashboard/daily-picks" style={{ background: 'var(--brand-purple)', color: '#fff', padding: '9px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Add from Daily Picks
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', padding: '60px 0' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>Loading your watchlist...</span>
        </div>
      ) : items.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-base)', padding: '60px', textAlign: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Your watchlist is empty</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px' }}>Save niches from Trending or Daily Picks to monitor and re-analyze them here.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/dashboard/trending" style={{ background: 'var(--brand-purple)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Browse Trending</Link>
            <Link href="/dashboard/daily-picks" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, border: '1px solid var(--border-base)' }}>Daily Picks</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.niche}</div>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: signalColor(item.signal) + '22', color: signalColor(item.signal) }}>{item.signal}</span>
                  {item.category && <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: '10px' }}>{item.category}</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Saved {new Date(item.created_at).toLocaleDateString()} · Last checked {new Date(item.last_checked).toLocaleDateString()}</div>
                {item.notes && <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px', fontStyle: 'italic' }}>{item.notes}</div>}
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: scoreColor(item.score), lineHeight: 1 }}>{item.score}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>score</div>
              </div>
              <button onClick={() => remove(item.id)} disabled={removing === item.id} style={{ background: 'none', border: '1px solid var(--border-base)', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }} title="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
