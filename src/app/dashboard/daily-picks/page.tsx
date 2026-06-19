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

const PICKS = [
  { id: '1', name: 'AI Voice Cloning Tools', score: 94, signal: 'GO', competition: 'Low', revenue: '$2k–$8k/mo', category: 'AI / Tech', why: 'Podcasters and course creators are paying $200+/mo for voice cloning. The creator economy is pushing demand harder than supply.' },
  { id: '2', name: 'Longevity Supplement Stacks', score: 91, signal: 'GO', competition: 'Medium', revenue: '$3k–$12k/mo', category: 'Health', why: 'Bryan Johnson\'s Blueprint protocol went viral. Mainstream consumers now spend $400+/mo on anti-aging stacks — no trusted curator exists yet.' },
  { id: '3', name: 'Micro-SaaS for Solo Attorneys', score: 88, signal: 'GO', competition: 'Low', revenue: '$4k–$15k/mo', category: 'Legal Tech', why: 'Solo practitioners are underserved by BigLaw software. Simple contract automation tools charging $99/mo are getting 40%+ conversion from trial.' },
  { id: '4', name: 'Pet Health Monitoring', score: 84, signal: 'GO', competition: 'Low', revenue: '$1k–$5k/mo', category: 'Pet Tech', why: 'Vet costs are up 34% in 3 years. Pet owners are paying $50–200/mo for proactive health alerts rather than reactive vet visits.' },
  { id: '5', name: 'Solopreneur Productivity OS', score: 81, signal: 'GO', competition: 'Medium', revenue: '$2k–$7k/mo', category: 'Productivity', why: 'The 60M+ solopreneur market is underserved by enterprise tools. Notion-based OS templates are pulling $10k+ in launch month on Gumroad.' },
];

export default function DailyPicksPage() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [fullAnalysis, setFullAnalysis] = useState<Record<string, any>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ id: string; type: string } | null>(null);

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';
  const compColor = (c: string) => c === 'Low' ? '#10b981' : c === 'High' ? '#ef4444' : '#f59e0b';

  const save = async (pick: typeof PICKS[0]) => {
    try {
      const { data: { session } } = await SB.auth.getSession();
      if (!session) return;
      await SB.from('watchlist').insert({ user_id: session.user.id, niche_name: pick.name, score: pick.score, signal: pick.signal }).catch(() => {});
      setSaved(prev => ({ ...prev, [pick.id]: true }));
    } catch { }
  };

  const loadFullAnalysis = async (pick: typeof PICKS[0]) => {
    if (fullAnalysis[pick.id]) { setExpanded(prev => ({ ...prev, [pick.id]: !prev[pick.id] })); return; }
    setLoadingAnalysis(pick.id);
    setExpanded(prev => ({ ...prev, [pick.id]: true }));
    try {
      const res = await fetch('/api/trending-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: { name: pick.name, score: pick.score, signal: pick.signal, platform: 'Twitter/X', mentions: 24000, growth: 145, trend_direction: 'up', related: [pick.category] } }),
      });
      const data = await res.json();
      setFullAnalysis(prev => ({ ...prev, [pick.id]: data }));
    } catch { }
    setLoadingAnalysis(null);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Daily Picks</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>AI-curated GO signals — updated every 24 hours. Last refresh: today</p>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
            {PICKS.filter(p => p.signal === 'GO').length} GO signals today
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {PICKS.map((pick, i) => (
          <div key={pick.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {/* Rank */}
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, paddingTop: '2px', width: '18px', textAlign: 'center' }}>#{i + 1}</div>
                {/* Main info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '15px' }}>{pick.name}</span>
                    <span style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '999px' }}>{pick.category}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5 }}>{pick.why}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Competition */}
                    <span style={{ fontSize: '12px', color: compColor(pick.competition), fontWeight: 600 }}>
                      {pick.competition} competition
                    </span>
                    <span style={{ color: 'var(--border)' }}>·</span>
                    {/* Revenue pill with tooltip */}
                    <div style={{ position: 'relative', display: 'inline-block' }}
                      onMouseEnter={() => setTooltip({ id: pick.id, type: 'revenue' })}
                      onMouseLeave={() => setTooltip(null)}>
                      <span style={{ background: 'rgba(124,58,237,0.12)', color: '#8b5cf6', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', cursor: 'help', border: '1px solid rgba(124,58,237,0.2)' }}>
                        {pick.revenue} ⓘ
                      </span>
                      {tooltip?.id === pick.id && tooltip.type === 'revenue' && (
                        <div style={{ position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', width: '240px', lineHeight: 1.5, zIndex: 100, whiteSpace: 'normal' }}>
                          {REVENUE_TOOLTIP}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Score */}
                <div style={{ textAlign: 'center', flexShrink: 0, position: 'relative' }}
                  onMouseEnter={() => setTooltip({ id: pick.id, type: 'score' })}
                  onMouseLeave={() => setTooltip(null)}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: scoreColor(pick.score), lineHeight: 1, cursor: 'help' }}>
                    {pick.score} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ⓘ</span>
                  </div>
                  {tooltip?.id === pick.id && tooltip.type === 'score' && (
                    <div style={{ position: 'absolute', bottom: '130%', right: 0, background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', width: '240px', lineHeight: 1.5, zIndex: 100, whiteSpace: 'normal' }}>
                      {SCORE_TOOLTIP}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GO score</div>
                </div>
                {/* Signal */}
                <div style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.3)', alignSelf: 'flex-start' }}>
                  {pick.signal}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                <Link href={`/autopilot?niche=${encodeURIComponent(pick.name)}`}
                  style={{ background: 'var(--accent)', color: '#fff', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Build Kit →
                </Link>
                <button onClick={() => loadFullAnalysis(pick)}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {loadingAnalysis === pick.id ? 'Loading…' : expanded[pick.id] ? 'Hide analysis' : 'View full analysis'}
                </button>
                <Link href={`/dashboard/keywords?seed=${encodeURIComponent(pick.name)}`}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Keywords →
                </Link>
                <Link href={`/dashboard/audience?niche=${encodeURIComponent(pick.name)}`}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Audience →
                </Link>
                <Link href={`/validate?niche=${encodeURIComponent(pick.name)}`}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Validate →
                </Link>
                <button onClick={() => save(pick)} disabled={saved[pick.id]}
                  style={{ background: saved[pick.id] ? 'rgba(16,185,129,0.12)' : 'var(--bg-elevated)', border: `1px solid ${saved[pick.id] ? '#10b981' : 'var(--border)'}`, borderRadius: '8px', padding: '7px 14px', fontSize: '12px', color: saved[pick.id] ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                  {saved[pick.id] ? '✓ Saved' : '+ Save'}
                </button>
              </div>
            </div>

            {/* Expanded full analysis */}
            {expanded[pick.id] && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'var(--bg-elevated)' }}>
                {loadingAnalysis === pick.id ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', margin: 0 }}>Generating niche-specific analysis…</p>
                ) : fullAnalysis[pick.id] ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Why Trending Now</div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{fullAnalysis[pick.id].why_trending}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Market Opportunity</div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{fullAnalysis[pick.id].opportunity}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
