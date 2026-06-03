'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U');

interface Pick { rank: number; niche: string; signal: string; tam: string; competition: string; entry_angle: string; platform: string; time_sensitive: boolean; score: number; }

export default function DailyPicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data: { session } } = await SB.auth.getSession();
      const token = session?.access_token || '';
      try {
        const r = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'daily_picks' }) });
        const d = await r.json();
        setPicks(d.picks || []);
      } catch { setPicks(FALLBACK); }
      setLoading(false);
    })();
  }, []);

  const addToWatchlist = async (pick: Pick) => {
    setAdding(pick.niche);
    const { data: { session } } = await SB.auth.getSession();
    await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` }, body: JSON.stringify({ action: 'watchlist_add', niche: pick.niche, score: pick.score, signal: pick.signal, category: pick.platform }) });
    setAdded(prev => new Set([...prev, pick.niche]));
    setAdding(null);
  };

  const scoreColor = (s: number) => s >= 88 ? '#22c55e' : s >= 78 ? '#f59e0b' : '#6b7280';
  const competColor = (c: string) => c === 'Low' ? '#22c55e' : c === 'Medium' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Daily Picks</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0' }}>5 AI-curated niche opportunities — refreshed every 24 hrs</p>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: '6px 12px', borderRadius: '8px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', padding: '60px 0' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>Loading today\'s picks from AI...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {picks.map((p, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-base)', padding: '22px 24px', display: 'flex', gap: '20px' }}>
              {/* Rank + Score */}
              <div style={{ flexShrink: 0, width: '56px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>#{p.rank || i+1}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: scoreColor(p.score), lineHeight: 1 }}>{p.score}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>score</div>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.niche}</span>
                  {p.time_sensitive && <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ef444422', color: '#ef4444', letterSpacing: '0.3px' }}>TIME-SENSITIVE</span>}
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#7c3aed22', color: '#7c3aed' }}>{p.platform}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: '0 0 12px', lineHeight: 1.6 }}>{p.signal}</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <div><div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Market Size</div><div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.tam}</div></div>
                  <div><div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Competition</div><div style={{ fontSize: '14px', fontWeight: 700, color: competColor(p.competition) }}>{p.competition}</div></div>
                </div>
                <div style={{ background: 'var(--bg-hover)', borderRadius: '8px', padding: '10px 14px', fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Entry angle: </span>{p.entry_angle}
                </div>
                <button onClick={() => addToWatchlist(p)} disabled={added.has(p.niche) || adding === p.niche} style={{ background: added.has(p.niche) ? 'var(--bg-hover)' : 'var(--brand-purple)', color: added.has(p.niche) ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: added.has(p.niche) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  {added.has(p.niche) ? 'Saved to Watchlist' : adding === p.niche ? 'Saving...' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const FALLBACK: Pick[] = [
  { rank:1, niche:'AI Voice Cloning Tools', signal:'Voice synthesis costs dropped 90% — SaaS gap wide open for creators and podcasters.', tam:'$1.8B', competition:'Low', entry_angle:'Niche tool for content creators needing consistent voice branding across platforms.', platform:'TikTok', time_sensitive:true, score:89 },
  { rank:2, niche:'Longevity Protocol Coaching', signal:'Bryan Johnson effect driving massive search volume surge — longevity is the new wellness.', tam:'$890M', competition:'Medium', entry_angle:'Affordable online coaching + curated supplement stack guide for men 35-55.', platform:'YouTube', time_sensitive:false, score:84 },
  { rank:3, niche:'Micro SaaS for Real Estate Agents', signal:'NAR rule changes creating urgent tool demand among buyer agents nationwide.', tam:'$3.2B', competition:'Medium', entry_angle:'Lead follow-up automation specifically designed for post-NAR buyer agents.', platform:'LinkedIn', time_sensitive:true, score:81 },
  { rank:4, niche:'Solopreneur Legal Templates', signal:'Spike in freelancers needing contract protection as gig economy grows post-2025.', tam:'$420M', competition:'Low', entry_angle:'Notion/PDF template pack sold on Gumroad targeting new freelancers and consultants.', platform:'Reddit', time_sensitive:false, score:77 },
  { rank:5, niche:'Pet Longevity Products', signal:'Human longevity trend crossing into pet care — proven demand with pet humanization wave.', tam:'$650M', competition:'Medium', entry_angle:'DTC supplement brand for senior dogs and cats with transparent vet partnerships.', platform:'Instagram', time_sensitive:false, score:75 },
];
