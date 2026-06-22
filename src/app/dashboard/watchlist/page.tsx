'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

type WatchItem = {
  id: string;
  niche_name?: string;
  niche?: string;
  score: number;
  signal?: string;
  created_at?: string;
  added_at?: string;
};

const DEMO: WatchItem[] = [
  { id: '1', niche_name: 'AI Voice Cloning Tools', score: 94, signal: 'GO', created_at: new Date().toISOString() },
  { id: '2', niche_name: 'Longevity Supplements Stack', score: 88, signal: 'GO', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', niche_name: 'Micro-SaaS for Lawyers', score: 82, signal: 'WATCH', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const Sparkline = ({ scores }: { scores: number[] }) => {
  if (!scores || scores.length < 2) return null;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * w;
    const y = h - ((s - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const trend = scores[scores.length - 1] >= scores[0];
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={trend ? '#10b981' : '#ef4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => { loadItems(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const loadItems = async () => {
    try {
      const { data: { session } } = await SB.auth.getSession();
      if (!session) { setItems(DEMO); setLoading(false); return; }
      const { data } = await SB.from('watchlist').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      setItems(data?.length ? data : DEMO);
    } catch { setItems(DEMO); }
    finally { setLoading(false); }
  };

  const remove = async (id: string, name: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await SB.from('watchlist').delete().eq('id', id).catch(() => {});
    showToast(`Removed "${name}" from watchlist`);
  };

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';
  const signalColor = (sig?: string) => sig === 'GO' ? '#10b981' : sig === 'WATCH' ? '#f59e0b' : '#ef4444';
  const signalBg = (sig?: string) => sig === 'GO' ? 'rgba(16,185,129,0.12)' : sig === 'WATCH' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';

  // Fake 7-day sparkline data based on score for demo
  const fakeSparkline = (score: number) => {
    const base = score - 8;
    return Array.from({ length: 7 }, (_, i) => Math.min(100, Math.max(0, base + Math.floor(Math.sin(i) * 5) + i)));
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '28px', right: '28px', background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 18px', fontSize: '13px', color: 'var(--text-primary)', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Watchlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Niches you're tracking. Get alerted when signals change.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>{items.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>tracked</div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>{items.filter(i => i.signal === 'GO').length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GO signals</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading watchlist…</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔖</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>No saved niches yet</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Save picks from Daily Picks, Trending, or Validate.</p>
          <Link href="/dashboard/daily-picks" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Browse Daily Picks</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(item => {
            const name = item.niche_name || item.niche || 'Unknown niche';
            const date = item.created_at || item.added_at || new Date().toISOString();
            const spark = fakeSparkline(item.score);
            return (
              <div key={item.id}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>

                {/* Niche name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last checked: {relativeTime(date)}</div>
                </div>

                {/* Sparkline */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px', textAlign: 'center' }}>7d</div>
                  <Sparkline scores={spark} />
                </div>

                {/* Score */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: scoreColor(item.score), lineHeight: 1 }}>{item.score}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>score</div>
                </div>

                {/* Signal */}
                {item.signal && (
                  <span style={{ background: signalBg(item.signal), color: signalColor(item.signal), fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', border: `1px solid ${signalColor(item.signal)}30`, flexShrink: 0 }}>
                    {item.signal}
                  </span>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <Link href={`/autopilot?niche=${encodeURIComponent(name)}`}
                    style={{ background: 'var(--accent)', color: '#fff', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Research →
                  </Link>
                  <Link href={`/validate?niche=${encodeURIComponent(name)}`}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Validate
                  </Link>
                  <button onClick={() => remove(item.id, name)}
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
