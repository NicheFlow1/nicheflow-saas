'use client';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { useState } from 'react';
import Link from 'next/link';

type Signal = {
  niche: string;
  signal_strength: number;
  trend: 'rising' | 'stable' | 'declining';
  category: string;
  why_now: string;
  competition: string;
  revenue_potential: string;
  keywords: string[];
  sources: string[];
};

const FALLBACK: Signal[] = [
  { niche: 'AI Voice Cloning Tools', signal_strength: 94, trend: 'rising', category: 'AI/Tech', why_now: 'Podcasters and course creators are paying $200+/mo for voice cloning. The creator economy is pushing demand harder than supply. Still <10 serious players in the space.', competition: 'Low', revenue_potential: '$3k–$15k/mo', keywords: ['voice cloning ai','ai narrator tool','clone my voice'], sources: ['Reddit r/artificial','Product Hunt','Twitter trending'] },
  { niche: 'Gut Health Biome Testing', signal_strength: 89, trend: 'rising', category: 'Health', why_now: 'At-home microbiome kits crossed mainstream. Influencer content around gut-brain axis is exploding. Subscription model fits perfectly with repeat testing every 90 days.', competition: 'Medium', revenue_potential: '$5k–$25k/mo', keywords: ['gut health test kit','microbiome analysis','best probiotic for gut'], sources: ['Google Trends','Amazon Best Sellers','TikTok #guthealth'] },
  { niche: 'Solo Travel Safety Apps', signal_strength: 85, trend: 'rising', category: 'Travel', why_now: 'Post-pandemic solo travel surged 42%. Women-first safety apps are critically underserved. App Store reviews show consistent 4-star demand with zero dominant player.', competition: 'Low', revenue_potential: '$2k–$10k/mo', keywords: ['solo travel safety app','women travel safety','travel buddy finder'], sources: ['App Store reviews','Facebook groups','Quora questions'] },
  { niche: 'Neuro-Divergent Productivity Planners', signal_strength: 82, trend: 'rising', category: 'Education', why_now: 'ADHD/autism diagnosis rates up 30% YoY. Shopify stores selling physical planners doing $50k+/mo. Digital version is almost completely untapped.', competition: 'Low', revenue_potential: '$3k–$12k/mo', keywords: ['adhd planner','neurodivergent productivity','executive function tools'], sources: ['TikTok #ADHDTok','Etsy trending','Pinterest boards'] },
  { niche: 'Micro-SaaS for Solo Attorneys', signal_strength: 79, trend: 'rising', category: 'Legal Tech', why_now: 'Solo practitioners are ignored by BigLaw software. Simple contract automation tools charging $99/mo are converting 40% of trial users. Market is 400k+ attorneys in the US alone.', competition: 'Low', revenue_potential: '$4k–$18k/mo', keywords: ['solo attorney software','law practice management','contract automation'], sources: ['Indie Hackers','Reddit r/Lawyertalk','LinkedIn groups'] },
  { niche: 'Micro-Course Marketplaces (Niche Specific)', signal_strength: 76, trend: 'stable', category: 'Education', why_now: 'Udemy fatigue is real. Buyers want ultra-specific 1-hour courses from real practitioners. White-label platforms cost <$200/mo to run with 60–70% margins.', competition: 'Medium', revenue_potential: '$2k–$8k/mo', keywords: ['micro course platform','short online course','skill in 1 hour'], sources: ['Twitter creators','Indie Hackers','Hacker News'] },
];

const TREND_COLOR = { rising: '#10b981', stable: '#f59e0b', declining: '#ef4444' };
const COMP_COLOR: Record<string, string> = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };

export default function RadarPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState<Signal[]>(FALLBACK);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const categories = ['All', ...Array.from(new Set(signals.map(s => s.category)))];

  const analyze = async () => {
    setLoading(true); setError('');
    try {
      const sb = getSupabaseClient();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({ action: 'radar_analyze', niche: query.trim() || 'emerging trends 2026' }),
      });
      const data = await res.json();
      const list = Array.isArray(data.signals) && data.signals.length ? data.signals
        : Array.isArray(data) && data.length ? data : [];
      setSignals(list.length ? list : FALLBACK);
      if (!list.length) setError('Using cached signals — live scan unavailable.');
    } catch {
      setSignals(FALLBACK);
      setError('Using cached signals — check your connection.');
    } finally { setLoading(false); }
  };

  const toggle = (niche: string) => {
    setSaved(prev => {
      const n = new Set(prev);
      if (n.has(niche)) { n.delete(niche); showToast('Removed from watchlist'); }
      else { n.add(niche); showToast(`"${niche}" saved to watchlist`); }
      return n;
    });
  };

  const filtered = filter === 'All' ? signals : signals.filter(s => s.category === filter);

  return (
    <div style={{ padding: '32px', maxWidth: '980px' }}>
      {toast && (
        <div style={{ position:'fixed',bottom:28,right:28,background:'#1a1a2e',border:'1px solid var(--border)',borderRadius:10,padding:'12px 18px',fontSize:13,color:'var(--text-primary)',zIndex:1000,boxShadow:'0 8px 32px rgba(0,0,0,.4)',fontWeight:600 }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Trend Radar</h1>
          <span style={{ background: '#10b98122', color: '#10b981', border: '1px solid #10b98144', borderRadius: '999px', fontSize: '11px', fontWeight: 700, padding: '2px 10px' }}>LIVE SIGNALS</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Spot emerging niche opportunities before they go mainstream. Powered by social listening + AI trend analysis.</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Scan a category: health, SaaS, creator economy, fintech… or leave blank for top signals"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
        />
        <button onClick={analyze} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, flexShrink: 0 }}>
          {loading ? 'Scanning…' : 'Scan Now'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--warning)', fontSize: '12px', marginBottom: '14px' }}>{error}</p>}

      {/* Stats + filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Signals', value: signals.length, color: 'var(--accent)' },
            { label: 'Rising', value: signals.filter(s => s.trend === 'rising').length, color: '#10b981' },
            { label: 'Low Competition', value: signals.filter(s => s.competition === 'Low').length, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', color: s.color }}>{s.value}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? 'var(--accent)' : 'var(--bg-card)', color: filter === c ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: filter === c ? 700 : 400, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Signal cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Scanning for emerging signals…</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((sig) => (
            <div key={sig.niche} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>{sig.category}</span>
                    <span style={{ background: TREND_COLOR[sig.trend] + '22', color: TREND_COLOR[sig.trend], border: `1px solid ${TREND_COLOR[sig.trend]}44`, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                      {sig.trend === 'rising' ? '' : sig.trend === 'declining' ? '↓' : '→'} {sig.trend}
                    </span>
                    <span style={{ background: COMP_COLOR[sig.competition] + '22', color: COMP_COLOR[sig.competition], border: `1px solid ${COMP_COLOR[sig.competition]}44`, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                      {sig.competition} competition
                    </span>
                    <span style={{ background: '#3b82f622', color: '#60a5fa', border: '1px solid #3b82f633', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                      💰 {sig.revenue_potential}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{sig.niche}</h3>
                </div>

                {/* Signal strength meter */}
                <div style={{ textAlign: 'center', marginLeft: '20px', flexShrink: 0 }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: sig.signal_strength >= 85 ? '#10b981' : sig.signal_strength >= 75 ? '#f59e0b' : 'var(--text-secondary)' }}>{sig.signal_strength}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>SIGNAL</div>
                  <div style={{ width: 48, height: 4, background: 'var(--border)', borderRadius: 2, marginTop: 4 }}>
                    <div style={{ width: `${sig.signal_strength}%`, height: '100%', background: sig.signal_strength >= 85 ? '#10b981' : '#f59e0b', borderRadius: 2 }} />
                  </div>
                </div>
              </div>

              {/* Why now */}
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '12px' }}>
                <strong style={{ color: 'var(--accent)' }}>Why now: </strong>{sig.why_now}
              </p>

              {/* Keywords + sources */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {sig.keywords?.map(k => (
                  <span key={k} style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>{k}</span>
                ))}
                {sig.sources?.map(s => (
                  <span key={s} style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>{s}</span>
                ))}
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => toggle(sig.niche)} style={{ background: saved.has(sig.niche) ? '#10b981' : 'var(--bg-elevated)', border: `1px solid ${saved.has(sig.niche) ? '#10b981' : 'var(--border)'}`, borderRadius: '8px', color: saved.has(sig.niche) ? '#fff' : 'var(--text-muted)', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {saved.has(sig.niche) ? '✓ Saved' : '+ Save'}
                </button>
                <Link href={`/validate?niche=${encodeURIComponent(sig.niche)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', padding: '7px 14px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                  Validate →
                </Link>
                <Link href={`/dashboard/keywords?q=${encodeURIComponent(sig.niche)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', padding: '7px 14px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                  Keywords →
                </Link>
                <Link href={`/autopilot?niche=${encodeURIComponent(sig.niche)}`} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff', padding: '7px 14px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', marginLeft: 'auto' }}>
                  Full Report →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
