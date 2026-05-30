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
  Instagram: '#e1306c', Twitter: '#1da1f2', LinkedIn: '#0077b5', Google: '#4285f4'
};

export default function DailyPicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => { loadPicks(); }, []);

  async function loadPicks() {
    setLoading(true);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'daily_picks' })
      });
      const data = await res.json();
      setPicks(data.picks || []);
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  }

  const compColor = (c: string) => c === 'Low' ? '#22c55e' : c === 'Medium' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Daily Picks</h1>
            <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#ef444422', color: '#ef4444', textTransform: 'uppercase' }}>NEW</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>5 AI-curated niche opportunities refreshed every day.</p>
        </div>
        <button onClick={loadPicks} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ height: '120px', borderRadius: '12px', background: 'var(--bg-secondary)', opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {picks.map((pick, i) => (
            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', color: '#fff', flexShrink: 0 }}>
                #{pick.rank}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '17px', fontWeight: 600, margin: 0 }}>{pick.niche}</h3>
                  {pick.time_sensitive && (
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#ef444422', color: '#ef4444', textTransform: 'uppercase' }}>Time-sensitive</span>
                  )}
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: (PLATFORM_COLORS[pick.platform] || '#6366f1') + '22', color: PLATFORM_COLORS[pick.platform] || '#6366f1' }}>{pick.platform}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 10px', lineHeight: 1.5 }}>{pick.signal}</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>TAM: <strong style={{ color: 'var(--text-primary)' }}>{pick.tam}</strong></span>
                  <span>Competition: <strong style={{ color: compColor(pick.competition) }}>{pick.competition}</strong></span>
                  <span>Score: <strong style={{ color: 'var(--accent)' }}>{pick.score}</strong></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Entry: {pick.entry_angle}</span>
                </div>
              </div>
              <button
                onClick={() => saveToWatchlist(pick)}
                disabled={saving === pick.niche || saved.has(pick.niche)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: saved.has(pick.niche) ? '#22c55e22' : 'var(--accent)', color: saved.has(pick.niche) ? '#22c55e' : '#fff', fontSize: '13px', fontWeight: 600, cursor: saved.has(pick.niche) ? 'default' : 'pointer', flexShrink: 0, opacity: saving === pick.niche ? 0.6 : 1 }}
              >
                {saved.has(pick.niche) ? 'Saved!' : saving === pick.niche ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}