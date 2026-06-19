'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const SB_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';

const NICHES = [
  { name: 'AI Voice Cloning Tools', score: 94, signal: 'GO', platform: 'Twitter/X', mentions: 48200, growth: 312, related: ['text-to-speech APIs', 'podcast cloning', 'voice AI'], trend_direction: 'up' },
  { name: 'Longevity Supplements', score: 91, signal: 'GO', platform: 'Reddit', mentions: 31400, growth: 187, related: ['NAD+ boosters', 'rapamycin protocols', 'biohacking stacks'], trend_direction: 'up' },
  { name: 'Micro-SaaS for Lawyers', score: 88, signal: 'GO', platform: 'LinkedIn', mentions: 19800, growth: 143, related: ['legal AI tools', 'contract automation', 'solo attorney software'], trend_direction: 'up' },
  { name: 'Pet Health Wearables', score: 85, signal: 'GO', platform: 'TikTok', mentions: 27600, growth: 221, related: ['dog GPS trackers', 'pet vitals monitors', 'vet telehealth'], trend_direction: 'up' },
  { name: 'Solopreneur Productivity Systems', score: 82, signal: 'GO', platform: 'Twitter/X', mentions: 15900, growth: 98, related: ['second brain tools', 'async workflows', 'indie hacker stacks'], trend_direction: 'up' },
  { name: 'AI-Powered Content Repurposing', score: 79, signal: 'WATCH', platform: 'LinkedIn', mentions: 22400, growth: 156, related: ['clip generation', 'transcript-to-blog', 'shorts automation'], trend_direction: 'stable' },
  { name: 'Regenerative Agriculture Tech', score: 76, signal: 'WATCH', platform: 'Reddit', mentions: 8700, growth: 67, related: ['soil microbiome', 'carbon credits', 'vertical farming AI'], trend_direction: 'up' },
  { name: 'Mental Health for Founders', score: 74, signal: 'WATCH', platform: 'Twitter/X', mentions: 18300, growth: 89, related: ['burnout prevention', 'founder therapy', 'async mental health'], trend_direction: 'stable' },
];

function TrendingInner() {
  const [niches, setNiches] = useState(NICHES);
  const [search, setSearch] = useState('');
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const filtered = niches.filter(n => !search || n.name.toLowerCase().includes(search.toLowerCase()));

  const getAnalysis = async (niche: typeof NICHES[0]) => {
    if (analyses[niche.name]) return;
    setLoadingAnalysis(niche.name);
    try {
      const res = await fetch('/api/trending-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });
      const data = await res.json();
      setAnalyses(prev => ({ ...prev, [niche.name]: data }));
    } catch { }
    setLoadingAnalysis(null);
  };

  const saveToWatchlist = async (name: string, score: number, signal: string) => {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ niche_name: name, score, signal }),
      });
      if (r.ok) setSaved(prev => ({ ...prev, [name]: true }));
    } catch { }
  };

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';
  const signalBg = (sig: string) => sig === 'GO' ? 'rgba(16,185,129,0.12)' : sig === 'WATCH' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
  const signalColor = (sig: string) => sig === 'GO' ? '#10b981' : sig === 'WATCH' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Trending Now</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Live niche signals ranked by social buzz, trend velocity, and business opportunity score.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search niches…"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '14px', width: '280px', outline: 'none' }} />
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {filtered.map((niche, i) => {
          const analysis = analyses[niche.name];
          const isLoadingThis = loadingAnalysis === niche.name;
          return (
            <div key={niche.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: analysis || isLoadingThis ? '16px' : '0' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, width: '20px', textAlign: 'center' }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px', marginBottom: '4px' }}>{niche.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {niche.platform} · {(niche.mentions / 1000).toFixed(0)}k mentions · +{niche.growth}% in 30d
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginRight: '8px' }}>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: scoreColor(niche.score), lineHeight: 1 }}>{niche.score}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>score</div>
                </div>
                <span style={{ background: signalBg(niche.signal), color: signalColor(niche.signal), fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', border: `1px solid ${signalColor(niche.signal)}30` }}>
                  {niche.signal}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => getAnalysis(niche)} disabled={isLoadingThis || !!analysis}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {isLoadingThis ? 'Analyzing…' : analysis ? '✓ Analyzed' : 'Analyze →'}
                  </button>
                  <button onClick={() => saveToWatchlist(niche.name, niche.score, niche.signal)} disabled={saved[niche.name]}
                    style={{ background: saved[niche.name] ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)', border: `1px solid ${saved[niche.name] ? '#10b981' : 'var(--border)'}`, borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: saved[niche.name] ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer' }}>
                    {saved[niche.name] ? '✓ Saved' : '+ Save'}
                  </button>
                </div>
              </div>

              {isLoadingThis && (
                <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Generating niche-specific analysis…
                </div>
              )}

              {analysis && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Why Trending</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{analysis.why_trending}</p>
                  </div>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Opportunity</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{analysis.opportunity}</p>
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link href={`/validate?niche=${encodeURIComponent(niche.name)}`} style={{ background: 'var(--accent)', color: '#fff', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>Validate →</Link>
                    <Link href={`/autopilot?niche=${encodeURIComponent(niche.name)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', textDecoration: 'none' }}>Build Kit →</Link>
                    <Link href={`/dashboard/keywords?seed=${encodeURIComponent(niche.name)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', textDecoration: 'none' }}>Keywords →</Link>
                    <Link href={`/dashboard/audience?niche=${encodeURIComponent(niche.name)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', textDecoration: 'none' }}>Audience →</Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: 'var(--text-muted)' }}>Loading trends…</div>}>
      <TrendingInner />
    </Suspense>
  );
}
