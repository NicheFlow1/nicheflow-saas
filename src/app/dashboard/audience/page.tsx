'use client';
import { useState } from 'react';
import Link from 'next/link';

type Segment = { name: string; age_range: string; income: string; platforms: string[]; pain_points: string[]; desires: string[]; buying_triggers: string[]; content_types: string[] };
type AudienceResult = { niche: string; segments: Segment[]; total_market_size: string; best_platform: string; content_strategy: string };

const FALLBACK: AudienceResult = {
  niche: 'AI Productivity Tools',
  total_market_size: '~45M active users globally',
  best_platform: 'YouTube + LinkedIn',
  content_strategy: 'Tutorial-first content: "How I use AI to save 3 hours/day" performs 4x better than product reviews in this niche.',
  segments: [
    { name: 'Busy Professionals', age_range: '28–45', income: '$60k–$120k', platforms: ['LinkedIn','YouTube','Twitter/X'], pain_points: ['Too many tools, not enough time','Context-switching kills focus','Hard to justify AI tool costs to employer'], desires: ['Save 2+ hours per day','Impress boss with output','Stay ahead of colleagues'], buying_triggers: ['Free trial available','Seen peer use it','Clear ROI calculator'], content_types: ['Case studies','Before/after workflows','Quick tip threads'] },
    { name: 'Solopreneurs', age_range: '25–40', income: '$30k–$80k', platforms: ['Twitter/X','YouTube','TikTok'], pain_points: ['Wearing too many hats','Can\'t afford a team','Revenue inconsistency'], desires: ['Automate repetitive tasks','Scale without hiring','Build in public credibility'], buying_triggers: ['Lifetime deal','Built by solo founder','Integrates with existing stack'], content_types: ['Founder stories','Tool stack reveals','Income reports'] },
  ],
};

export default function AudiencePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AudienceResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const analyze = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'audience_intel', niche: query.trim() }), // fixed: was "topic"
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({
        niche: query.trim(),
        total_market_size: data.total_market_size ?? data.market_size ?? 'Large',
        best_platform: data.best_platform ?? data.top_platform ?? 'YouTube',
        content_strategy: data.content_strategy ?? data.strategy ?? '',
        segments: Array.isArray(data.segments) && data.segments.length ? data.segments : FALLBACK.segments,
      });
      setActiveTab(0);
    } catch {
      setResult({ ...FALLBACK, niche: query.trim() });
      setError('Using sample data — live analysis unavailable.');
    } finally { setLoading(false); }
  };

  const display = result ?? FALLBACK;

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Audience Intelligence</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Deep psychographic profiling of your target market — who they are, what they want, where to find them.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="e.g. keto supplements, remote work tools, pet wellness…"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}/>
        <button onClick={analyze} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 24px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Analyzing…' : 'Analyze →'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--warning)', fontSize: '12px', marginBottom: '16px' }}>{error}</p>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Profiling your audience…</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {[
              { icon: 'globe', label: 'Total Market', value: display.total_market_size },
              { icon: 'megaphone', label: 'Best Platform', value: display.best_platform },
              { icon: 'users', label: 'Segments Found', value: `${display.segments.length} audience types` },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Content strategy */}
          {display.content_strategy && (
            <div style={{ background: 'linear-gradient(135deg,#7c3aed18,#4f46e518)', border: '1px solid var(--accent)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '6px' }}>CONTENT STRATEGY INSIGHT</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{display.content_strategy}</p>
            </div>
          )}

          {/* Segment tabs */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {display.segments.map((s, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: '14px', background: activeTab === i ? 'var(--accent)' : 'none', color: activeTab === i ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: activeTab === i ? 700 : 400, fontSize: '13px', borderRight: i < display.segments.length-1 ? '1px solid var(--border)' : 'none' }}>
                  {s.name}
                </button>
              ))}
            </div>

            {display.segments[activeTab] && (() => {
              const seg = display.segments[activeTab];
              return (
                <div style={{ padding: '24px' }}>
                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {[
                      { label: 'Age', value: seg.age_range },
                      { label: 'Income', value: seg.income },
                      { label: 'Platforms', value: seg.platforms?.join(', ') },
                    ].map(m => (
                      <span key={m.label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{m.label}:</strong> {m.value}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { title: 'Pain Points', items: seg.pain_points, color: '#ef4444' },
                      { title: 'Desires', items: seg.desires, color: '#10b981' },
                      { title: 'Buying Triggers', items: seg.buying_triggers, color: '#f59e0b' },
                      { title: 'Content Types', items: seg.content_types, color: '#3b82f6' },
                    ].map(block => (
                      <div key={block.title} style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: block.color, marginBottom: '10px' }}>{block.title}</div>
                        {block.items?.map((item, i) => (
                          <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '4px 0', borderBottom: i < block.items.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>• {item}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Cross-links */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={`/dashboard/keywords?q=${encodeURIComponent(display.niche)}`} style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textDecoration: 'none', textAlign: 'center', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
              Find Keywords →
            </Link>
            <Link href={`/content?niche=${encodeURIComponent(display.niche)}`} style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textDecoration: 'none', textAlign: 'center', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
              Create Content →
            </Link>
            <Link href={`/validate?niche=${encodeURIComponent(display.niche)}`} style={{ flex: 1, background: 'var(--accent)', border: 'none', borderRadius: '12px', padding: '14px', textDecoration: 'none', textAlign: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
              Validate Niche →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
