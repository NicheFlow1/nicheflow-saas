'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const EXAMPLE_PILLS = [
  'keto meal prep', 'AI productivity tools', 'micro SaaS for lawyers',
  'longevity supplements', 'pet health monitors', 'solopreneur systems',
];

const WHAT_YOULL_GET = [
  { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'GO / WAIT / WATCH signal with score' },
  { icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', label: 'Google Trends 12-month chart' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Competition density analysis' },
  { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'AI opportunity analysis (niche-specific)' },
  { icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', label: 'Top keywords with volume + difficulty' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Revenue potential estimate' },
];

function ValidateInner() {
  const params = useSearchParams();
  const [niche, setNiche] = useState(params.get('niche') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    loadRecentReports();
    if (params.get('niche')) setTimeout(() => run(params.get('niche')!), 300);
  }, []);

  const loadRecentReports = async () => {
    try {
      const { data: { session } } = await SB.auth.getSession();
      if (!session) return;
      const { data } = await SB.from('validation_reports')
        .select('id, niche, score, result, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setRecentReports(data);
    } catch {}
  };

  const run = async (overrideNiche?: string) => {
    const keyword = (overrideNiche ?? niche).trim();
    if (!keyword) return;
    if (!overrideNiche) setNiche(keyword);
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_niche', niche: keyword }),
      });
      const data = await res.json();
      if (data.error === 'not_a_niche') {
        setError(`"${keyword}" appears to be a news event, not a business niche. Try something like "AI productivity tools for lawyers" or "pet health monitoring devices".`);
        setLoading(false);
        return;
      }
      if (data.error) throw new Error(data.error);
      setResult(data);
      // Save with dedup check
      const { data: { session } } = await SB.auth.getSession();
      if (session) {
        const today = new Date(); today.setHours(0,0,0,0);
        const { data: existing } = await SB.from('validation_reports')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('niche', keyword)
          .gte('created_at', today.toISOString())
          .single();
        if (!existing) {
          await SB.from('validation_reports').insert({
            user_id: session.user.id,
            niche: keyword,
            score: data.overall_score ?? 0,
            result: data,
          }).catch(() => {});
        }
        setSaved(true);
        loadRecentReports();
      }
    } catch (e: any) {
      setError(e.message || 'Validation failed.');
    }
    setLoading(false);
  };

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';
  const signal = result?.overall_score >= 70 ? 'GO' : result?.overall_score >= 40 ? 'WATCH' : 'WAIT';
  const signalColor = signal === 'GO' ? '#10b981' : signal === 'WATCH' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '32px', maxWidth: '860px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Niche Validator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Get a full viability score with market size, competition, monetization, and trend data.</p>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="e.g. AI productivity tools, keto meal prep, Shopify micro-SaaS…"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
        <button onClick={() => run()} disabled={loading || !niche.trim()}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 24px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Validating…' : 'Validate'}
        </button>
      </div>

      {/* Example pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>Try:</span>
        {EXAMPLE_PILLS.map(p => (
          <button key={p} onClick={() => { setNiche(p); run(p); }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
            {p}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
          <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '60px 0' }}>
          <div style={{ width: 44, height: 44, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>Analyzing niche signals…</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Checking Google Trends, competition density, and market opportunity</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Signal banner */}
          <div style={{ background: 'var(--bg-card)', border: `2px solid ${signalColor}`, borderRadius: '16px', padding: '28px', display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Signal</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: signalColor, letterSpacing: '-0.5px', lineHeight: 1 }}>{signal}</div>
            </div>
            <div style={{ width: '1px', height: '60px', background: 'var(--border)' }} />
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Score</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: scoreColor(result.overall_score ?? 0), lineHeight: 1 }}>{result.overall_score ?? '—'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{result.verdict || (result.overall_score >= 70 ? 'Strong opportunity' : result.overall_score >= 40 ? 'Worth monitoring' : 'Proceed with caution')}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 10px', lineHeight: 1.6 }}>{result.summary || result.analysis || 'Analysis complete.'}</p>
              {saved && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>✓ Saved to Reports</span>}
            </div>
          </div>

          {/* Sub-scores */}
          {result.scores && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '12px' }}>
              {Object.entries(result.scores).map(([k, v]: [string, any]) => (
                <div key={k} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: scoreColor(Number(v)) }}>{v}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          )}

          {/* Key metrics */}
          {(result.market_size || result.competition_level || result.trend) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {result.market_size && <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}><div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>MARKET SIZE</div><div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{result.market_size}</div></div>}
              {result.competition_level && <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}><div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>COMPETITION</div><div style={{ fontWeight: 700, color: result.competition_level?.toLowerCase() === 'low' ? '#10b981' : result.competition_level?.toLowerCase() === 'high' ? '#ef4444' : '#f59e0b', fontSize: '15px' }}>{result.competition_level}</div></div>}
              {result.trend && <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}><div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>TREND</div><div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{result.trend}</div></div>}
            </div>
          )}

          {/* Top keywords */}
          {result.keywords && result.keywords.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Top Keywords</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.keywords.map((kw: string, i: number) => (
                  <span key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href={`/autopilot?niche=${encodeURIComponent(niche)}`}
              style={{ background: 'var(--accent)', color: '#fff', borderRadius: '10px', padding: '12px 24px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Build Starter Kit →
            </Link>
            <Link href={`/dashboard/keywords?seed=${encodeURIComponent(niche)}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '10px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Find Keywords →
            </Link>
            <Link href="/projects"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '10px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              View Reports →
            </Link>
          </div>
        </div>
      )}

      {/* Empty state — recent reports + what you'll get */}
      {!result && !loading && !error && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Recent validations */}
          {recentReports.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>Recent Validations</div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {recentReports.map((r: any) => {
                  const s = r.score || 0;
                  const sig = s >= 70 ? 'GO' : s >= 40 ? 'WATCH' : 'WAIT';
                  const sigCol = sig === 'GO' ? '#10b981' : sig === 'WATCH' ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: `${sigCol}20`, color: sigCol, fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', border: `1px solid ${sigCol}40` }}>{sig}</span>
                      <span style={{ flex: 1, fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{r.niche}</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: scoreColor(s) }}>{s}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                      <button onClick={() => { setNiche(r.niche); setResult(r.result); setSaved(true); }}
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        View →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* What you'll get */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px' }}>Your validation report will include:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '10px' }}>
              {WHAT_YOULL_GET.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d={item.icon} />
                  </svg>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ValidatePage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: 'var(--text-muted)' }}>Loading…</div>}>
      <ValidateInner />
    </Suspense>
  );
}
