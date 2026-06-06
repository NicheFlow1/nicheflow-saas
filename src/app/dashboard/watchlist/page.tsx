'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

type WatchItem = { id: string; niche: string; score: number; added_at: string; notes?: string };

const DEMO: WatchItem[] = [
  { id: '1', niche: 'AI-Powered Pet Health Monitors', score: 91, added_at: new Date().toISOString(), notes: 'High potential — check hardware costs' },
  { id: '2', niche: 'Longevity Supplements Stack', score: 88, added_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', niche: 'Micro-SaaS for Shopify Sellers', score: 87, added_at: new Date(Date.now() - 172800000).toISOString(), notes: 'Research existing Shopify apps first' },
];

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await SB.auth.getSession();
        if (!session) { setItems(DEMO); setLoading(false); return; }
        const { data, error } = await SB.from('watchlist').select('*').order('added_at', { ascending: false });
        setItems(data?.length ? data : DEMO);
      } catch { setItems(DEMO); }
      finally { setLoading(false); }
    })();
  }, []);

  const remove = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await SB.from('watchlist').delete().eq('id', id).catch(() => {});
  };

  return (
    <div style={{ padding: '32px', maxWidth: '860px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Watchlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Niches you&apos;re tracking. Save from Daily Picks or any analysis.</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>{items.length}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>tracked</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading watchlist…</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔖</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>No saved niches yet</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Save picks from Daily Picks or your analysis results.</p>
          <Link href="/dashboard/daily-picks" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Browse Daily Picks</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.niche}</span>
                  <span style={{ background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>{item.score}</span>
                </div>
                {item.notes && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px' }}>📝 {item.notes}</p>}
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Added {new Date(item.added_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <button onClick={() => remove(item.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', flexShrink: 0, marginLeft: '12px' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
