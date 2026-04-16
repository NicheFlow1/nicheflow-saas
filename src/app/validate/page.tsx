'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client-singleton';
import { TrendingUp, Search, CheckCircle, XCircle, AlertTriangle, ArrowRight, Copy, Zap, BarChart3, Target, DollarSign, Users, Clock } from 'lucide-react';

const VALIDATE_FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/validate-keyword';
const AUTOPILOT_FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

function ScoreBar({ label, score, explanation }: { label: string; score: number; explanation?: string }) {
  const color = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 900, color }}>{score}/100</span>
      </div>
      <div style={{ height: 6, background: 'var(--border-base)', borderRadius: 99, overflow: 'hidden', marginBottom: explanation ? 4 : 0 }}>
        <div style={{ height: '100%', width: score + '%', background: color, borderRadius: 99, transition: 'width 1s ease' }} />
      </div>
      {explanation && <div style={{ fontSize: 10, color: 'var(--text-disabled)', lineHeight: 1.4 }}>{explanation}</div>}
    </div>
  );
}

function ValidateContent() {
  const params = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview'|'deep'|'content'|'monetize'>('overview');

  useEffect(() => {
    const k = params?.get('keyword');
    if (k) setKeyword(k);
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
  }, []);

  async function validate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!keyword.trim() || !session) return;
    setLoading(true); setError(''); setReport(null);
    const { data: { session: fr } } = await supabase.auth.getSession();
    try {
      const res = await fetch(VALIDATE_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (fr?.access_token || session.access_token) }, body: JSON.stringify({ keyword: keyword.trim() }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      setReport(d.report);
      setActiveTab('overview');
    } catch (e: any) { setError(e.message || 'Failed'); }
    finally { setLoading(false); }
  }

  const signalColor = report?.signal === 'GO' ? 'var(--success)' : report?.signal === 'WAIT' ? 'var(--warning)' : 'var(--danger)';
  const signalBg = report?.signal === 'GO' ? 'rgba(34,197,94,.1)' : report?.signal === 'WAIT' ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)';

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={15} style={{ color: 'white' }} />
          </div>
          <h1>Validate Trend</h1>
        </div>
        <p>Deep market analysis using real Google Trends data, AI-powered competitive intelligence, and opportunity scoring</p>
      </div>

      <form onSubmit={validate} style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Enter a keyword, niche, or market to validate..." className="input" style={{ fontSize: 14 }} />
        <button type="submit" disabled={!keyword.trim() || loading || !session} className="btn btn-grad" style={{ flexShrink: 0, gap: 6 }}>
          {loading ? <><div className="spinner" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white' }} />Analyzing...</> : <><Search size={13} />Validate</>}
        </button>
      </form>

      {error && <div style={{ padding: '12px 16px', background: 'var(--surface-nogo)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, fontSize: 13, color: 'var(--danger)', marginBottom: 20 }}>{error}</div>}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BarChart3 size={22} style={{ color: 'white' }} />
          </div>
          <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Deep analyzing "{keyword}"</h3>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 20 }}>Fetching 5-year Google Trends data, analyzing competition, scoring monetization potential...</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
            {['Trend Data', '5-Year Chart', 'Competition', 'Monetization', 'AI Analysis', 'Opportunity Score'].map((s, i) => (
              <span key={i} style={{ padding: '3px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: 'rgba(99,102,241,.08)', color: 'var(--brand-purple)', border: '1px solid rgba(99,102,241,.15)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {report && !loading && (
        <div>
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.04))', border: '1px solid rgba(99,102,241,.2)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: signalBg, border: '1px solid ' + signalColor, fontSize: 12, fontWeight: 900, color: signalColor, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    {report.signal === 'GO' ? <CheckCircle size={12} /> : report.signal === 'WAIT' ? <AlertTriangle size={12} /> : <XCircle size={12} />}
                    {report.signal}
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: signalColor }}>{report.overall_score}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>/ 100</span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: 6 }}>{report.keyword}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>{report.summary}</p>
                {report.opportunity && (
                  <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,.07)', borderLeft: '3px solid var(--brand-purple)', borderRadius: '0 10px 10px 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--brand-purple)' }}>Opportunity: </strong>{report.opportunity}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, minWidth: 200 }}>
                {[
                  { label: '12-Month Avg', val: report.raw_trend_avg + '/100', icon: TrendingUp },
                  { label: '5-Year Growth', val: (report.growth_5y > 0 ? '+' : '') + report.growth_5y + '%', icon: BarChart3 },
                  { label: 'Recent Momentum', val: (report.recent_momentum > 0 ? '+' : '') + report.recent_momentum + '%', icon: Zap },
                  { label: 'Peak Interest', val: report.peak_value + '/100', icon: Target },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-overlay)', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 2 }}>{m.val}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 0 }}>
            {[['overview','Overview'],['deep','Deep Analysis'],['content','Content Angles'],['monetize','Monetize']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id as any)} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === id ? '2px solid var(--brand-purple)' : '2px solid transparent', fontSize: 12.5, fontWeight: activeTab === id ? 700 : 500, color: activeTab === id ? 'var(--brand-purple)' : 'var(--text-tertiary)', cursor: 'pointer', marginBottom: -1, fontFamily: 'inherit' }}>{label}</button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 16 }}>Opportunity Scores</div>
                {report.scores && Object.entries(report.scores).map(([key, val]) => (
                  <ScoreBar key={key} label={key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} score={Number(val)} explanation={report.score_explanations?.[key]} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {report.green_flags?.length > 0 && (
                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Green Flags</div>
                    {report.green_flags.map((f: string, i: number) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}><CheckCircle size={13} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span></div>)}
                  </div>
                )}
                {report.red_flags?.length > 0 && (
                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Watch Out For</div>
                    {report.red_flags.map((f: string, i: number) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}><XCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span></div>)}
                  </div>
                )}
                {report.immediate_actions?.length > 0 && (
                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Immediate Actions</div>
                    {report.immediate_actions.map((a: string, i: number) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}><ArrowRight size={13} style={{ color: 'var(--brand-purple)', flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a}</span></div>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'deep' && (
            <div style={{ display: 'grid', gap: 14 }}>
              {report.market_insight && <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Key Insight</div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic' }}>"{report.market_insight}"</div>
              </div>}
              {report.best_entry_angle && <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Best Entry Angle</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{report.best_entry_angle}</div>
              </div>}
              {report.competitors?.length > 0 && <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Competitor Gaps</div>
                {report.competitors.map((c: any, i: number) => <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-overlay)', borderRadius: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>Weakness: {c.weakness}</div>
                  <div style={{ fontSize: 11, color: 'var(--success)' }}>Opportunity: {c.opportunity}</div>
                </div>)}
              </div>}
              {report.pain_points?.length > 0 && <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Customer Pain Points</div>
                {report.pain_points.map((p: string, i: number) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><Target size={13} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p}</span></div>)}
              </div>}
            </div>
          )}

          {activeTab === 'content' && (
            <div style={{ display: 'grid', gap: 12 }}>
              {report.content_angles?.map((a: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(99,102,241,.1)', color: 'var(--brand-purple)', textTransform: 'uppercase' }}>{a.platform}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{a.angle}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.5 }}>"{a.hook}"</div>
                </div>
              ))}
              {report.rising_angles?.length > 0 && (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Rising Sub-Niches</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {report.rising_angles.map((a: string, i: number) => <span key={i} style={{ padding: '5px 10px', background: 'var(--bg-overlay)', border: '1px solid var(--border-base)', borderRadius: 99, fontSize: 12, color: 'var(--text-secondary)' }}>{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'monetize' && (
            <div style={{ display: 'grid', gap: 12 }}>
              {report.monetization_ideas?.map((m: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{m.model}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: m.difficulty === 'easy' ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)', color: m.difficulty === 'easy' ? 'var(--success)' : 'var(--warning)', textTransform: 'uppercase' }}>{m.difficulty}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-disabled)' }}>{m.time_to_revenue} to revenue</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--success)' }}>{m.price}</div>
                  </div>
                </div>
              ))}
              {report.keyword_variations?.length > 0 && (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Related Keywords to Target</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {report.keyword_variations.map((k: string, i: number) => <span key={i} style={{ padding: '5px 10px', background: 'var(--bg-overlay)', border: '1px solid var(--border-base)', borderRadius: 99, fontSize: 12, color: 'var(--text-secondary)' }}>{k}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <a href={'/autopilot/starter?keyword=' + encodeURIComponent(report.keyword)} className="btn btn-grad" style={{ gap: 8 }}><Zap size={14} />Build Starter Kit</a>
            <button onClick={() => { setReport(null); setKeyword(''); }} className="btn btn-ghost" style={{ gap: 8 }}><Search size={13} />New Search</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ValidatePage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}><div className="spinner" style={{ width: 22, height: 22, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)' }} /></div>}>
      <ValidateContent />
    </Suspense>
  );
}
