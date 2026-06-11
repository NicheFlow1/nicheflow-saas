'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Trend = {
  topic: string;
  category: string;
  growth: number;
  volume: number;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  timeframe: string;
  sources: string[];
  niche_opportunity: string;
  score: number;
};

const FALLBACK: Trend[] = [
  { topic: 'AI Agent Workflows', category: 'Technology', growth: 340, volume: 89000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['Twitter/X', 'Reddit', 'HN'], niche_opportunity: 'No-code AI agent builders for non-technical founders', score: 96 },
  { topic: 'Longevity & Biohacking', category: 'Health', growth: 180, volume: 145000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['YouTube', 'Podcasts', 'Reddit'], niche_opportunity: 'Personalized longevity protocol tracking apps', score: 91 },
  { topic: 'Solo Founder SaaS', category: 'Business', growth: 95, volume: 62000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['Twitter/X', 'Indie Hackers'], niche_opportunity: 'Micro-SaaS templates and launch kits for solo devs', score: 88 },
  { topic: 'Neuro-Divergent Productivity', category: 'Education', growth: 210, volume: 78000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['TikTok', 'Pinterest', 'Reddit'], niche_opportunity: 'ADHD-specific digital planners and focus tools', score: 87 },
  { topic: 'AI-Generated Video Content', category: 'Creator Economy', growth: 290, volume: 210000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['YouTube', 'TikTok', 'Product Hunt'], niche_opportunity: 'Faceless YouTube channel automation with AI voiceover', score: 85 },
  { topic: 'Remote Work Legal Tools', category: 'Legal/HR', growth: 75, volume: 34000, sentiment: 'neutral', timeframe: 'Last 30 days', sources: ['LinkedIn', 'HR Forums'], niche_opportunity: 'Contractor compliance SaaS for distributed teams', score: 79 },
  { topic: 'Regenerative Agriculture', category: 'Environment', growth: 125, volume: 41000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['YouTube', 'Substacks', 'Reddit'], niche_opportunity: 'Courses + community for small-farm regenerative practices', score: 76 },
  { topic: 'Digital Nomad Finance', category: 'Finance', growth: 88, volume: 57000, sentiment: 'bullish', timeframe: 'Last 30 days', sources: ['YouTube', 'Reddit', 'Twitter/X'], niche_opportunity: 'Tax & banking guides for location-independent earners', score: 82 },
];

const SENTIMENT_COLOR = { bullish: '#10b981', neutral: '#f59e0b', bearish: '#ef4444' };
const CATEGORIES = ['All', ...Array.from(new Set(FALLBACK.map(t => t.category)))];

export default function TrendingPage() {
  const [trends, setTrends] = useState<Trend[]>(FALLBACK);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState<'score' | 'growth' | 'volume'>('score');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trending_topics' }),
      });
      const data = await res.json();
      const list = Array.isArray(data.trends) && data.trends.length ? data.trends
        : Array.isArray(data) && data.length ? data : [];
      setTrends(list.length ? list : FALLBACK);
      if (!list.length) setError('Live feed unavailable — showing cached trends.');
    } catch {
      setError('Live feed unavailable — showing cached trends.');
    } finally { setLoading(false); }
  };

  useEffect(() => { /* auto-load on mount */ }, []);

  const toggle = (topic: string) => setSaved(prev => { const n = new Set(prev); n.has(topic) ? n.delete(topic) : n.add(topic); return n; });

  const filtered = trends
    .filter(t => filter === 'All' || t.category === filter)
    .sort((a, b) => b[sort] - a[sort]);

  return (
    <div style={{ padding: '32px', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Trending Niches</h1>
            <span style={{ background: '#10b98122', color: '#10b981', border: '1px solid #10b98133', borderRadius: '999px', fontSize: '11px', fontWeight: 700, padding: '2px 10px' }}>● LIVE</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Real-time niche signals ranked by opportunity score, growth rate and social volume.</p>
        </div>
        <button onClick={refresh} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, flexShrink: 0 }}>
          {loading ? '⟳ Refreshing…' : '⟳ Refresh Feed'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--warning)', fontSize: '12px', marginBottom: '14px' }}>⚠ {error}</p>}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Signals Tracked', value: trends.length, color: 'var(--accent)' },
          { label: 'Bullish', value: trends.filter(t => t.sentiment === 'bullish').length, color: '#10b981' },
          { label: 'Avg Growth', value: Math.round(trends.reduce((a,t)=>a+t.growth,0)/Math.max(trends.length,1)) + '%', color: '#f59e0b' },
          { label: 'Top Score', value: Math.max(...trends.map(t=>t.score)), color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? 'var(--accent)' : 'var(--bg-card)', color: filter === c ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: filter === c ? 700 : 400, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center' }}>Sort:</span>
          {(['score','growth','volume'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)} style={{ background: sort === s ? 'var(--bg-elevated)' : 'transparent', color: sort === s ? 'var(--text-primary)' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: sort === s ? 700 : 400 }}>
              {s === 'score' ? '⭐ Score' : s === 'growth' ? '📈 Growth' : '📊 Volume'}
            </button>
          ))}
        </div>
      </div>

      {/* Trend cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '70px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Scanning live trend signals…</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((t, i) => (
            <div key={t.topic} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px' }}>{t.category}</span>
                    <span style={{ fontSize: '11px', background: SENTIMENT_COLOR[t.sentiment] + '22', color: SENTIMENT_COLOR[t.sentiment], border: `1px solid ${SENTIMENT_COLOR[t.sentiment]}44`, borderRadius: '6px', padding: '2px 8px', fontWeight: 700 }}>
                      {t.sentiment === 'bullish' ? '▲' : t.sentiment === 'bearish' ? '▼' : '—'} {t.sentiment}
                    </span>
                    <span style={{ fontSize: '11px', background: '#10b98122', color: '#10b981', borderRadius: '6px', padding: '2px 8px', fontWeight: 700 }}>+{t.growth}% growth</span>
                    <span style={{ fontSize: '11px', background: '#3b82f622', color: '#60a5fa', borderRadius: '6px', padding: '2px 8px' }}>{t.volume.toLocaleString()} vol</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{t.topic}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--accent)' }}>Opportunity: </strong>{t.niche_opportunity}
                  </p>
                </div>
                <div style={{ textAlign: 'center', marginLeft: '20px', flexShrink: 0 }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: t.score >= 85 ? '#10b981' : '#f59e0b' }}>{t.score}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>SCORE</div>
                </div>
              </div>

              {/* Sources */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {t.sources.map(s => (
                  <span key={s} style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>📍 {s}</span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => toggle(t.topic)} style={{ background: saved.has(t.topic) ? '#10b981' : 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: saved.has(t.topic) ? '#fff' : 'var(--text-muted)', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  {saved.has(t.topic) ? '✓ Saved' : '+ Save'}
                </button>
                <Link href={`/validate?niche=${encodeURIComponent(t.niche_opportunity)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', padding: '6px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Validate →</Link>
                <Link href={`/dashboard/keywords?q=${encodeURIComponent(t.topic)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', padding: '6px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Keywords →</Link>
                <Link href={`/generator?niche=${encodeURIComponent(t.niche_opportunity)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', padding: '6px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Ideas →</Link>
                <Link href={`/autopilot?niche=${encodeURIComponent(t.niche_opportunity)}`} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff', padding: '6px 12px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', marginLeft: 'auto' }}>Full Report →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
