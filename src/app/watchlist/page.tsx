'use client';
import { useState, useEffect } from 'react';

interface WatchlistItem {
  id: string;
  niche: string;
  score: number;
  category: string;
  trend: string;
  saved_at: string;
  forecast?: { m3: number; m6: number; m12: number };
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [forecasts, setForecasts] = useState<Record<string, { m3: number; m6: number; m12: number; verdict: string }>>({});

  useEffect(() => { loadWatchlist(); }, []);

  async function loadWatchlist() {
    setLoading(true);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({ action: 'watchlist_get' })
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    await fetch('/api/autopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
      body: JSON.stringify({ action: 'watchlist_remove', id })
    });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function reanalyze(niche: string) {
    setAnalyzing(niche);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({ action: 'forecast', niche })
      });
      const data = await res.json();
      if (data.forecast) {
        setForecasts(prev => ({ ...prev, [niche]: data.forecast }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(null);
    }
  }

  const trendColor = (t: string) => {
    if (t === 'rising') return '#22c55e';
    if (t === 'stable') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Watchlist</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>
          Track niches you are monitoring. Re-analyze any saved niche for a fresh forecast.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: '100px', borderRadius: '12px', background: 'var(--bg-secondary)', animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#128203;</div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>Your watchlist is empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Save niches from Trending or Daily Picks to track them here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '17px', fontWeight: 600, margin: 0 }}>{item.niche}</h3>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: trendColor(item.trend) + '22', color: trendColor(item.trend), textTransform: 'uppercase' }}>{item.trend}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <span>Score: <strong style={{ color: 'var(--accent)' }}>{item.score}</strong></span>
                    <span>Category: <strong style={{ color: 'var(--text-primary)' }}>{item.category}</strong></span>
                    <span>Saved: {new Date(item.saved_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => reanalyze(item.niche)}
                    disabled={analyzing === item.niche}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: analyzing === item.niche ? 0.6 : 1 }}
                  >
                    {analyzing === item.niche ? 'Analyzing...' : 'Re-analyze'}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {forecasts[item.niche] && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-tertiary, var(--bg-primary))', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forecast</div>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {(['m3','m6','m12'] as const).map(k => (
                      <div key={k} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>{forecasts[item.niche][k]}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{k === 'm3' ? '3mo' : k === 'm6' ? '6mo' : '12mo'}</div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#22c55e22', color: '#22c55e' }}>{forecasts[item.niche].verdict}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}