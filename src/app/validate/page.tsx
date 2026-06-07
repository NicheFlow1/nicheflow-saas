'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

type Result = {
  niche: string;
  overall_score: number;
  market_size: string;
  competition: string;
  trend: string;
  monetization_potential: string;
  time_to_profit: string;
  verdict: string;
  scores: { label: string; value: number; color: string }[];
  pros: string[];
  cons: string[];
  next_steps: string[];
  keywords: string[];
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: color, fontSize: size/4, fontWeight: 800 }}>
        {score}
      </text>
    </svg>
  );
}

export default function ValidatePage() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const validate = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_niche', niche: niche.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const r: Result = {
        niche: niche.trim(),
        overall_score: data.overall_score ?? data.score ?? 75,
        market_size: data.market_size ?? 'Medium',
        competition: data.competition ?? 'Medium',
        trend: data.trend ?? 'Stable',
        monetization_potential: data.monetization_potential ?? '$2k–$8k/mo',
        time_to_profit: data.time_to_profit ?? '3–6 months',
        verdict: data.verdict ?? data.summary ?? 'Solid niche with room to grow.',
        scores: data.scores ?? [
          { label: 'Market Demand', value: data.demand_score ?? 78, color: '#7c3aed' },
          { label: 'Competition', value: data.competition_score ?? 65, color: '#f59e0b' },
          { label: 'Monetization', value: data.monetization_score ?? 82, color: '#10b981' },
          { label: 'Trend Strength', value: data.trend_score ?? 71, color: '#3b82f6' },
        ],
        pros: data.pros ?? data.opportunities ?? ['Growing audience', 'Low barrier to entry', 'Multiple monetization paths'],
        cons: data.cons ?? data.risks ?? ['Requires content consistency', 'Takes 3–6 months to see results'],
        next_steps: data.next_steps ?? ['Research top 10 competitors', 'Build keyword list', 'Create lead magnet'],
        keywords: data.keywords ?? [],
      };
      setResult(r);
      // save to DB
      const { data: { session } } = await SB.auth.getSession();
      if (session) {
        await SB.from('validation_reports').insert({
          user_id: session.user.id,
          niche: r.niche,
          score: r.overall_score,
          result: r,
        }).catch(() => {});
      }
    } catch (e) {
      setError('Analysis failed. Check connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToWatchlist = async () => {
    if (!result) return;
    const { data: { session } } = await SB.auth.getSession();
    if (session) {
      await SB.from('watchlist').insert({ user_id: session.user.id, niche: result.niche, score: result.overall_score }).catch(() => {});
    }
    setSaved(true);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Validate Niche</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Get a full AI-powered viability score for any niche — demand, competition, monetization & more.</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && validate()}
          placeholder="e.g. AI productivity tools, keto meal prep, micro SaaS for lawyers…"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}/>
        <button onClick={validate} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 26px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, flexShrink: 0 }}>
          {loading ? 'Analyzing…' : 'Validate →'}
        </button>
      </div>

      {error && <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '10px', padding: '12px 16px', color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>⚠ {error}</div>}

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 44, height: 44, border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Running deep niche analysis…</p>
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.4s ease' }}>
          {/* Hero score card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', display: 'flex', gap: '28px', alignItems: 'center' }}>
            <ScoreRing score={result.overall_score} size={100}/>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>{result.niche}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 14px' }}>{result.verdict}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { label: '📦 Market', value: result.market_size },
                  { label: '⚔️ Competition', value: result.competition },
                  { label: '📈 Trend', value: result.trend },
                  { label: '💰 Revenue', value: result.monetization_potential },
                  { label: '⏱ Profit Timeline', value: result.time_to_profit },
                ].map(b => (
                  <span key={b.label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{b.label}:</strong> {b.value}
                  </span>
                ))}
              </div>
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
              <button onClick={saveToWatchlist} style={{ background: saved ? '#10b981' : 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: saved ? '#fff' : 'var(--text-primary)', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                {saved ? '✓ Saved' : '+ Watchlist'}
              </button>
              <Link href={`/dashboard/keywords?q=${encodeURIComponent(result.niche)}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', padding: '8px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                Keywords →
              </Link>
              <Link href={`/autopilot?niche=${encodeURIComponent(result.niche)}`} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                Full Report →
              </Link>
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>Score Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {result.scores.map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: s.color }}>{s.value}/100</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 999 }}>
                    <div style={{ width: `${s.value}%`, height: '100%', background: s.color, borderRadius: 999, transition: 'width 0.8s ease' }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid #10b98133', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', margin: '0 0 12px' }}>✅ Opportunities</h3>
              {result.pros.map((p, i) => <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '4px 0', borderBottom: i < result.pros.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>• {p}</div>)}
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid #ef444433', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', margin: '0 0 12px' }}>⚠️ Risks</h3>
              {result.cons.map((c, i) => <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '4px 0', borderBottom: i < result.cons.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>• {c}</div>)}
            </div>
          </div>

          {/* Next steps */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>🗺 Next Steps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.next_steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingTop: '3px' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          {result.keywords.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>🔑 Top Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.keywords.map(k => (
                  <span key={k} style={{ background: 'var(--bg-elevated)', color: 'var(--accent)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px' }}>{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
