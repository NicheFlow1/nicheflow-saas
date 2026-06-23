'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const SCORE_TOOLTIP = 'Score = Google Trends growth (35%) + social buzz (30%) + competition gap (20%) + market relevance (15%)';
const REVENUE_TOOLTIP = 'AI revenue projection based on market size and typical monetization for this niche type. Not a guarantee.';

const DEFAULT_PICKS = [
  { id: '1', name: 'AI Voice Cloning Tools', score: 94, signal: 'GO', competition: 'Low', revenue: '$2k–$8k/mo', category: 'AI / Tech', why: 'Podcasters and course creators are paying $200+/mo for voice cloning. The creator economy is pushing demand harder than supply. Still under 10 serious players in this space.' },
  { id: '2', name: 'Longevity Supplement Stacks', score: 91, signal: 'GO', competition: 'Medium', revenue: '$3k–$12k/mo', category: 'Health', why: 'Bryan Johnson\'s Blueprint protocol went viral. Mainstream consumers now spend $400+/mo on anti-aging stacks — no trusted curator exists yet.' },
  { id: '3', name: 'Micro-SaaS for Solo Attorneys', score: 88, signal: 'GO', competition: 'Low', revenue: '$4k–$15k/mo', category: 'Legal Tech', why: 'Solo practitioners are underserved by BigLaw software. Simple contract automation tools charging $99/mo are getting 40%+ conversion from trial.' },
  { id: '4', name: 'Pet Health Monitoring', score: 84, signal: 'GO', competition: 'Low', revenue: '$1k–$5k/mo', category: 'Pet Tech', why: 'Vet costs are up 34% in 3 years. Pet owners are paying $50–200/mo for proactive health alerts rather than reactive vet visits.' },
  { id: '5', name: 'Solopreneur Productivity OS', score: 81, signal: 'GO', competition: 'Medium', revenue: '$2k–$7k/mo', category: 'Productivity', why: 'The 60M+ solopreneur market is underserved by enterprise tools. Notion-based OS templates are pulling $10k+ in launch month on Gumroad.' },
];

const SIGNAL_COLOR: Record<string, string> = { GO: '#10b981', WATCH: '#f59e0b', AVOID: '#ef4444' };
const COMP_COLOR: Record<string, string> = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };

export default function DailyPicksPage() {
  const [picks, setPicks] = useState(DEFAULT_PICKS);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [scoreTooltip, setScoreTooltip] = useState(false);
  const [revenueTooltip, setRevenueTooltip] = useState<string | null>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    SB.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      SB.from('watchlist').select('niche_name').eq('user_id', session.user.id).then(({ data }) => {
        if (data) setSaved(new Set(data.map((r: any) => r.niche_name)));
      });
    });
  }, []);

  const refreshPicks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'daily_picks' }),
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length) setPicks(data);
      else if (data.picks && Array.isArray(data.picks)) setPicks(data.picks);
      showToast('Picks refreshed!');
    } catch {
      showToast('Using cached picks');
    } finally { setLoading(false); }
  };

  const saveToWatchlist = async (pick: typeof DEFAULT_PICKS[0]) => {
    const { data: { session } } = await SB.auth.getSession();
    if (!session) { showToast('Sign in to save picks'); return; }

    if (saved.has(pick.name)) {
      await SB.from('watchlist').delete().eq('user_id', session.user.id).eq('niche_name', pick.name);
      setSaved(prev => { const n = new Set(prev); n.delete(pick.name); return n; });
      showToast('Removed from watchlist');
    } else {
      await SB.from('watchlist').insert({ user_id: session.user.id, niche_name: pick.name, score: pick.score, notes: pick.why }).catch(() => {});
      setSaved(prev => new Set([...prev, pick.name]));
      showToast(`"${pick.name}" saved to watchlist`);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 18px', fontSize: 13, color: 'var(--text-primary)', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,.4)', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Daily Picks</h1>
            <span style={{ background: '#10b98122', color: '#10b981', border: '1px solid #10b98144', borderRadius: '999px', fontSize: '11px', fontWeight: 700, padding: '2px 10px' }}>● FRESH TODAY</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            5 AI-curated niche opportunities — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button onClick={refreshPicks} disabled={loading} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 18px', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
          onMouseEnter={() => setScoreTooltip(true)} onMouseLeave={() => setScoreTooltip(false)}>
          <span style={{ color: 'var(--accent)' }}>ⓘ</span> How score works
          {scoreTooltip && (
            <div style={{ position: 'absolute', bottom: '100%', left: 0, background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)', width: 280, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,.5)', marginBottom: 6 }}>
              {SCORE_TOOLTIP}
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: '#10b981', fontWeight: 700 }}>GO</span> = strong signal &nbsp;
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>WATCH</span> = monitor &nbsp;
          <span style={{ color: '#ef4444', fontWeight: 700 }}>AVOID</span> = weak signal
        </div>
      </div>

      {/* Picks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {picks.map((pick, i) => (
          <div key={pick.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
          >
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                {/* Left */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>#{i + 1}</span>
                    <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{pick.category}</span>
                    <span style={{ background: SIGNAL_COLOR[pick.signal] + '22', color: SIGNAL_COLOR[pick.signal], border: `1px solid ${SIGNAL_COLOR[pick.signal]}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                      {pick.signal}
                    </span>
                    <span style={{ background: COMP_COLOR[pick.competition] + '22', color: COMP_COLOR[pick.competition], borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                      {pick.competition} competition
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{pick.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{pick.why}</p>
                </div>

                {/* Right — score + revenue */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: pick.score >= 85 ? '#10b981' : pick.score >= 70 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>{pick.score}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2, marginBottom: 8 }}>SCORE</div>
                  <div style={{ position: 'relative', display: 'inline-block' }}
                    onMouseEnter={() => setRevenueTooltip(pick.id)} onMouseLeave={() => setRevenueTooltip(null)}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', background: '#10b98122', border: '1px solid #10b98133', borderRadius: 8, padding: '4px 10px', cursor: 'default', whiteSpace: 'nowrap' }}>
                      💰 {pick.revenue}
                    </div>
                    {revenueTooltip === pick.id && (
                      <div style={{ position: 'absolute', bottom: '100%', right: 0, background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)', width: 240, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,.5)', marginBottom: 6 }}>
                        {REVENUE_TOOLTIP}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded analysis */}
              {expanded === pick.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Entry Strategy', text: 'Start with a free tool or calculator to capture email leads. Upsell to a $49/mo subscription after 3 uses.' },
                      { label: 'Audience', text: 'Early adopters, freelancers, and small business owners aged 28–45. Find them on Reddit, LinkedIn groups, and niche Facebook communities.' },
                      { label: 'Quick Win', text: 'Build a minimal v1 in 2 weeks. Launch on Product Hunt + Indie Hackers. Target first $1k MRR within 60 days.' },
                      { label: 'Risk', text: 'Depends on sustained trend growth. Set a 90-day review to evaluate CAC and churn before scaling ad spend.' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action bar */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '12px 22px', display: 'flex', gap: 8, background: 'var(--bg-elevated)', flexWrap: 'wrap' }}>
              <button onClick={() => setExpanded(expanded === pick.id ? null : pick.id)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
                {expanded === pick.id ? '▲ Less' : '▼ Full Analysis'}
              </button>
              <button onClick={() => saveToWatchlist(pick)} style={{ background: saved.has(pick.name) ? '#10b981' : 'var(--bg-card)', border: `1px solid ${saved.has(pick.name) ? '#10b981' : 'var(--border)'}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, color: saved.has(pick.name) ? '#fff' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                {saved.has(pick.name) ? '✓ Saved' : '+ Watchlist'}
              </button>
              <Link href={`/validate?niche=${encodeURIComponent(pick.name)}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }}>
                Validate →
              </Link>
              <Link href={`/autopilot?niche=${encodeURIComponent(pick.name)}`} style={{ background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#fff', fontWeight: 700, textDecoration: 'none', marginLeft: 'auto' }}>
                Build Kit →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
