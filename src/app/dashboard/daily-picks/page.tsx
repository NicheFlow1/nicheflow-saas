'use client';
import { useState, useEffect } from 'react';

interface Pick {
  rank: number;
  niche: string;
  signal: string;
  tam: string;
  competition: string;
  entry_angle: string;
  platform: string;
  time_sensitive: boolean;
  score: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  TikTok: '#ff0050', Reddit: '#ff4500', YouTube: '#ff0000',
  Instagram: '#e1306c', Twitter: '#1da1f2', LinkedIn: '#0077b5', Google: '#4285f4', Default: '#6366f1'
};

export default function DailyPicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => { loadPicks(); }, []);

  async function loadPicks() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'daily_picks' })
      });
      const data = await res.json();
      if (data.picks && data.picks.length > 0) {
        setPicks(data.picks);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('No picks returned. Try refreshing.');
      }
    } catch (e) {
      setError('Failed to load picks. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  async function saveToWatchlist(pick: Pick) {
    setSaving(pick.niche);
    try {
      await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'watchlist_add', niche: pick.niche, score: pick.score, category: pick.platform, trend: 'rising' })
      });
      setSaved(prev => new Set([...prev, pick.niche]));
    } finally {
      setSaving(null);
    }
  }

  const compColor = (c: string) => c === 'Low' ? '#22c55e' : c === 'Medium' ? '#f59e0b' : '#ef4444';
  const pColor = (p: string) => PLATFORM_COLORS[p] || PLATFORM_COLORS.Default;

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Daily Picks</h1>
            <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#ef444422', color: '#ef4444' }}>NEW</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>5 AI-curated niche opportunities — refreshed daily, powered by real trend signals.</p>
        </div>
        <button onClick={loadPicks} disabled={loading} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', fontWeight: 500, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: '#ef444415', border: '1px solid #ef444433', borderRadius: '10px', color: '#ef4444', marginBottom: '24px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ height: '140px', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', opacity: 1.1 - i * 0.15 }} />
          ))}
        </div>
      ) : picks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {picks.map((pick, i) => (
            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', padding: '22px', display: 'flex', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap', transition: 'border-color 0.2s' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: '#fff', flexShrink: 0 }}>
                {pick.rank}
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '17px', fontWeight: 600, margin: 0 }}>{pick.niche}</h3>
                  {pick.time_sensitive && (
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#ef444422', color: '#ef4444', textTransform: 'uppercase' }}>Time-sensitive</span>
                  )}
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: pColor(pick.platform) + '22', color: pColor(pick.platform) }}>{pick.platform}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.6 }}>{pick.signal}</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>TAM: <strong style={{ color: 'var(--text-primary)' }}>{pick.tam}</strong></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Competition: <strong style={{ color: compColor(pick.competition) }}>{pick.competition}</strong></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Score: <strong style={{ color: '#7c3aed' }}>{pick.score}/100</strong></span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: '6px', borderLeft: '3px solid #7c3aed' }}>
                  Entry angle: {pick.entry_angle}
                </div>
              </div>
              <button
                onClick={() => saveToWatchlist(pick)}
                disabled={saving === pick.niche || saved.has(pick.niche)}
                style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: saved.has(pick.niche) ? '#22c55e22' : 'var(--accent)', color: saved.has(pick.niche) ? '#22c55e' : '#fff', fontSize: '13px', fontWeight: 600, cursor: saved.has(pick.niche) ? 'default' : 'pointer', flexShrink: 0, opacity: saving === pick.niche ? 0.6 : 1, transition: 'all 0.2s' }}
              >
                {saved.has(pick.niche) ? 'Saved' : saving === pick.niche ? '...' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}