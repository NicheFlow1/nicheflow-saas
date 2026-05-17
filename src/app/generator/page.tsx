'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { useSearchParams } from 'next/navigation';
import { Zap, AlertCircle, RefreshCw, TrendingUp, Target, Users, DollarSign, Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/analyze-opportunity';

const MODES = [
  { id:'deep', label:'Deep Analysis', sub:'Full surgical breakdown' },
  { id:'discover', label:'Discover 3 Niches', sub:'Find hidden opportunities' },
  { id:'trend', label:'Trend Analysis', sub:'Lifecycle & timing intel' },
  { id:'compete', label:'Competition X-Ray', sub:'Map the full battlefield' },
];

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,marginBottom:12,overflow:'hidden' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%',display:'flex',alignItems:'center',gap:8,padding:'13px 16px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const }}>
        {icon}
        <span style={{ fontSize:13,fontWeight:700,color:'var(--text-primary)',flex:1,textTransform:'uppercase' as const,letterSpacing:'0.04em' }}>{title}</span>
        {open ? <ChevronUp size={14} color="var(--text-muted)"/> : <ChevronDown size={14} color="var(--text-muted)"/>}
      </button>
      {open && <div style={{ padding:'0 16px 16px' }}>{children}</div>}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4 }}>
        <span style={{ color:'var(--text-muted)' }}>{label}</span>
        <span style={{ color,fontWeight:700 }}>{value}/100</span>
      </div>
      <div style={{ height:5,background:'var(--bg-hover)',borderRadius:3,overflow:'hidden' }}>
        <div style={{ height:'100%',width:`${value}%`,background:color,borderRadius:3,transition:'width 0.6s ease' }}/>
      </div>
    </div>
  );
}

function GeneratorContent() {
  const params = useSearchParams();
  const prefill = params?.get('keyword') || '';
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('deep');
  const [input, setInput] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(async ({ data }: any) => {
      setSession(data.session);
      setReady(true);
      if (data.session) {
        const { data: pr } = await sb.from('profiles').select('generations_used,generations_limit').eq('id', data.session.user.id).single();
        setCredits(pr);
      }
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e: any, s: any) => { setSession(s); setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) { setDots(''); return; }
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, [loading]);

  async function analyze() {
    if (!session || !input.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ niche: input.trim(), mode }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error || `Error ${r.status}`); }
      const data = await r.json();
      setResult(data);
      if (credits) setCredits((c: any) => ({ ...c, generations_used: (c.generations_used||0) + 1 }));
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(e.message || 'Analysis failed');
    } finally { setLoading(false); }
  }

  if (!ready) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>;
  if (!session) { if (typeof window !== 'undefined') window.location.href='/auth/login'; return null; }

  return (
    <div style={{ maxWidth:860,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:'0 0 4px' }}>Intelligence Engine</h1>
          <p style={{ fontSize:14,color:'var(--text-muted)',margin:0 }}>Deep market analysis powered by real Google Trends data</p>
        </div>
        {credits && <span style={{ fontSize:12,fontWeight:600,color:credits.generations_used>=credits.generations_limit?'#ef4444':'var(--text-muted)',background:'var(--bg-card)',border:'1px solid var(--border-base)',padding:'5px 12px',borderRadius:20 }}>{credits.generations_used}/{credits.generations_limit} CREDITS</span>}
      </div>

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:20,marginBottom:20 }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:16 }}>
          {MODES.map(m => (
            <button key={m.id} onClick={()=>setMode(m.id)} style={{ padding:'11px 14px',borderRadius:10,border:`1px solid ${mode===m.id?'rgba(99,102,241,.5)':'var(--border-base)'}`,background:mode===m.id?'rgba(99,102,241,.1)':'var(--bg-base)',cursor:'pointer',textAlign:'left' as const,transition:'all 0.15s' }}>
              <div style={{ fontSize:13,fontWeight:600,color:mode===m.id?'#a5b4fc':'var(--text-primary)',marginBottom:2 }}>{m.label}</div>
              <div style={{ fontSize:11,color:'var(--text-muted)' }}>{m.sub}</div>
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Enter a keyword, niche, or market to analyze..."
          disabled={loading}
          rows={2}
          style={{ width:'100%',background:'var(--bg-base)',border:'1px solid var(--border-base)',borderRadius:8,padding:'10px 14px',color:'var(--text-primary)',fontSize:14,outline:'none',resize:'none',marginBottom:12,opacity:loading?0.6:1,boxSizing:'border-box' as const,fontFamily:'inherit' }}
        />
        {error && <div style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,marginBottom:12 }}><AlertCircle size={14} color="#ef4444"/><span style={{ fontSize:13,color:'#ef4444',flex:1 }}>{error}</span><button onClick={analyze} style={{ display:'flex',alignItems:'center',gap:4,background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:12 }}><RefreshCw size={11}/>Retry</button></div>}
        <button onClick={analyze} disabled={loading||!input.trim()} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:!loading&&input.trim()?'var(--brand-purple)':'var(--bg-hover)',color:!loading&&input.trim()?'#fff':'var(--text-muted)',border:'none',padding:'11px',borderRadius:8,fontSize:14,fontWeight:600,cursor:!loading&&input.trim()?'pointer':'not-allowed',fontFamily:'inherit' }}>
          <Zap size={15}/>{loading?`Analyzing${dots}`:'Run Analysis'}
        </button>
        {loading && <p style={{ fontSize:12,color:'var(--text-muted)',textAlign:'center' as const,margin:'8px 0 0' }}>Fetching real Google Trends + deep AI analysis · 20-45 seconds</p>}
      </div>

      {result && (
        <div>
          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))',border:'1px solid rgba(139,92,246,.25)',borderRadius:14,padding:22,marginBottom:14 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
                  <span style={{ fontSize:12,fontWeight:700,padding:'3px 12px',borderRadius:12,background:result.signal==='GO'?'rgba(16,185,129,.2)':result.signal==='WAIT'?'rgba(239,68,68,.2)':'rgba(245,158,11,.2)',color:result.signal==='GO'?'#10b981':result.signal==='WAIT'?'#ef4444':'#f59e0b' }}>{result.signal}</span>
                  {result.signal_reason && <span style={{ fontSize:13,color:'var(--text-secondary)' }}>{result.signal_reason}</span>}
                </div>
                <h2 style={{ fontSize:19,fontWeight:700,color:'var(--text-primary)',marginBottom:8 }}>{result.title}</h2>
                <p style={{ fontSize:14,color:'var(--text-secondary)',lineHeight:1.7,margin:0 }}>{result.summary}</p>
              </div>
              <div style={{ textAlign:'center' as const,marginLeft:20,flexShrink:0 }}>
                <div style={{ fontSize:38,fontWeight:800,color:'var(--brand-purple)',lineHeight:1 }}>{result.overall_score}</div>
                <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>SCORE</div>
              </div>
            </div>
            {result.key_insight && (
              <div style={{ padding:'11px 14px',background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.2)',borderRadius:10 }}>
                <p style={{ fontSize:13,color:'#a5b4fc',margin:0,fontStyle:'italic',lineHeight:1.6 }}>💡 "{result.key_insight}"</p>
              </div>
            )}
          </div>

          {/* Trend data */}
          {result.trend_data?.current && (
            <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:16,marginBottom:14 }}>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,letterSpacing:'0.06em',marginBottom:12 }}>📊 Real Google Trends Data</div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:result.trend_data.rising?.length?12:0 }}>
                {[['Current',result.trend_data.current+'/100','#6366f1'],['Avg',result.trend_data.avg+'/100','#10b981'],['Growth',(result.trend_data.growth>0?'+':'')+result.trend_data.growth+'%',result.trend_data.growth>0?'#10b981':'#ef4444'],['Direction',result.trend_data.direction,'#f59e0b']].map(([l,v,c])=>(
                  <div key={l as string} style={{ textAlign:'center' as const,padding:10,background:'var(--bg-base)',borderRadius:9 }}>
                    <div style={{ fontSize:15,fontWeight:700,color:c as string }}>{v as string}</div>
                    <div style={{ fontSize:10,color:'var(--text-muted)',marginTop:2,textTransform:'uppercase' as const }}>{l as string}</div>
                  </div>
                ))}
              </div>
              {result.trend_data.rising?.length > 0 && (
                <div>
                  <div style={{ fontSize:11,color:'var(--text-muted)',marginBottom:6 }}>Rising searches:</div>
                  <div style={{ display:'flex',flexWrap:'wrap' as const,gap:5 }}>
                    {result.trend_data.rising.map((q: string,i: number) => <span key={i} style={{ fontSize:11,padding:'3px 9px',background:'rgba(99,102,241,.08)',color:'var(--brand-indigo)',borderRadius:16,border:'1px solid rgba(99,102,241,.15)' }}>{q}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deep Analysis sections */}
          {mode === 'deep' && (
            <div>
              {result.market_size && (
                <Section title="Market Size & Drivers" icon={<TrendingUp size={14} color="#10b981"/>}>
                  <p style={{ fontSize:14,color:'var(--text-primary)',marginBottom:12,lineHeight:1.6 }}>TAM: <strong>{result.market_size}</strong></p>
                  {result.growth_drivers?.map((d: string,i: number) => <div key={i} style={{ display:'flex',gap:8,marginBottom:6,fontSize:13,color:'var(--text-secondary)' }}><span style={{ color:'#10b981',flexShrink:0 }}>↑</span>{d}</div>)}
                </Section>
              )}
              {result.pain_points?.length > 0 && (
                <Section title="Customer Pain Points" icon={<Users size={14} color="#f59e0b"/>}>
                  {result.pain_points.map((p: any,i: number) => (
                    <div key={i} style={{ padding:'10px 12px',background:'var(--bg-base)',borderRadius:9,marginBottom:8 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                        <span style={{ fontSize:13,fontWeight:600,color:'var(--text-primary)' }}>{p.pain}</span>
                        <span style={{ fontSize:10,padding:'2px 7px',borderRadius:8,background:p.intensity==='high'?'rgba(239,68,68,.1)':'rgba(245,158,11,.1)',color:p.intensity==='high'?'#ef4444':'#f59e0b',fontWeight:700 }}>{p.intensity?.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize:12,color:'var(--text-muted)' }}>Segment: {p.who}</div>
                    </div>
                  ))}
                </Section>
              )}
              {result.competitors?.length > 0 && (
                <Section title="Competitor X-Ray" icon={<Target size={14} color="#ef4444"/>}>
                  {result.competitors.map((c: any,i: number) => (
                    <div key={i} style={{ padding:'12px 14px',background:'var(--bg-base)',borderRadius:9,marginBottom:8 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
                        <span style={{ fontSize:14,fontWeight:700,color:'var(--text-primary)' }}>{c.name}</span>
                        <span style={{ fontSize:12,color:'var(--text-muted)' }}>{c.market_share}</span>
                      </div>
                      <div style={{ fontSize:13,color:'#ef4444',marginBottom:4 }}>⚡ Weakness: {c.weakness}</div>
                      {c.pricing && <div style={{ fontSize:12,color:'var(--text-muted)' }}>Pricing: {c.pricing}</div>}
                    </div>
                  ))}
                </Section>
              )}
              {result.white_spaces?.length > 0 && (
                <Section title="White Spaces (Unserved Gaps)" icon={<Zap size={14} color="var(--brand-purple)"/>}>
                  {result.white_spaces.map((w: string,i: number) => <div key={i} style={{ display:'flex',gap:8,marginBottom:8,padding:'9px 12px',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:8,fontSize:13,color:'var(--text-primary)' }}><span style={{ color:'var(--brand-purple)',flexShrink:0 }}>○</span>{w}</div>)}
                </Section>
              )}
              {result.monetization_models?.length > 0 && (
                <Section title="Monetization Models" icon={<DollarSign size={14} color="#10b981"/>}>
                  {result.monetization_models.map((m: any,i: number) => (
                    <div key={i} style={{ padding:'10px 12px',background:'var(--bg-base)',borderRadius:9,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                      <div>
                        <div style={{ fontSize:13,fontWeight:600,color:'var(--text-primary)',marginBottom:3 }}>{m.model}</div>
                        <div style={{ fontSize:12,color:'#10b981' }}>{m.revenue_potential}</div>
                      </div>
                      <span style={{ fontSize:10,padding:'3px 8px',borderRadius:8,background:m.difficulty==='low'?'rgba(16,185,129,.1)':m.difficulty==='high'?'rgba(239,68,68,.1)':'rgba(245,158,11,.1)',color:m.difficulty==='low'?'#10b981':m.difficulty==='high'?'#ef4444':'#f59e0b',fontWeight:700 }}>{m.difficulty?.toUpperCase()} EFFORT</span>
                    </div>
                  ))}
                </Section>
              )}
              {result.first_30_days?.length > 0 && (
                <Section title="30-Day Action Plan" icon={<Target size={14} color="#f59e0b"/>}>
                  {result.first_30_days.map((a: string,i: number) => <div key={i} style={{ display:'flex',gap:10,marginBottom:8,fontSize:13,color:'var(--text-secondary)',lineHeight:1.5 }}><span style={{ color:'#f59e0b',flexShrink:0,fontWeight:700 }}>{i+1}.</span>{a}</div>)}
                  {result.revenue_estimate && (
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:12 }}>
                      {[['Month 1',result.revenue_estimate.month1],['Month 3',result.revenue_estimate.month3],['Month 6',result.revenue_estimate.month6]].map(([l,v])=>(
                        <div key={l as string} style={{ textAlign:'center' as const,padding:10,background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:9 }}>
                          <div style={{ fontSize:14,fontWeight:700,color:'#10b981' }}>{v as string}</div>
                          <div style={{ fontSize:11,color:'var(--text-muted)' }}>{l as string}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              )}
              {result.risk_factors?.length > 0 && (
                <Section title="Risk Factors" icon={<Shield size={14} color="#ef4444"/>}>
                  {result.risk_factors.map((r: string,i: number) => <div key={i} style={{ display:'flex',gap:8,marginBottom:6,fontSize:13,color:'var(--text-secondary)' }}><span style={{ color:'#ef4444',flexShrink:0 }}>⚠</span>{r}</div>)}
                </Section>
              )}
            </div>
          )}

          {/* Discover mode */}
          {mode === 'discover' && result.opportunities?.map((opp: any,i: number) => (
            <div key={i} style={{ background:'var(--bg-card)',border:`1px solid ${opp.signal==='GO'?'rgba(16,185,129,.25)':'var(--border-base)'}`,borderRadius:12,padding:18,marginBottom:12 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <h3 style={{ fontSize:15,fontWeight:700,color:'var(--text-primary)',margin:0 }}>{opp.title}</h3>
                  <span style={{ fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:10,background:opp.signal==='GO'?'rgba(16,185,129,.15)':'rgba(245,158,11,.15)',color:opp.signal==='GO'?'#10b981':'#f59e0b' }}>{opp.signal}</span>
                </div>
                <span style={{ fontSize:20,fontWeight:800,color:'var(--brand-purple)' }}>{opp.score}</span>
              </div>
              <p style={{ fontSize:13,color:'var(--text-secondary)',lineHeight:1.65,marginBottom:10 }}>{opp.description}</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
                {opp.tam && <div style={{ padding:'8px 11px',background:'var(--bg-base)',borderRadius:8,fontSize:12 }}><span style={{ color:'var(--text-muted)' }}>TAM: </span><span style={{ color:'var(--text-primary)',fontWeight:600 }}>{opp.tam}</span></div>}
                {opp.monetization && <div style={{ padding:'8px 11px',background:'var(--bg-base)',borderRadius:8,fontSize:12 }}><span style={{ color:'var(--text-muted)' }}>Revenue: </span><span style={{ color:'#10b981',fontWeight:600 }}>{opp.monetization}</span></div>}
              </div>
              {opp.first_move && <div style={{ marginTop:10,padding:'9px 12px',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:8,fontSize:13,color:'#a5b4fc' }}>🎯 First move: {opp.first_move}</div>}
            </div>
          ))}

          {/* Trend mode */}
          {mode === 'trend' && (
            <div>
              {result.lifecycle && (
                <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18,marginBottom:12 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,marginBottom:12 }}>Lifecycle Position</div>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14 }}>
                    {[['Stage',result.lifecycle.stage,'#6366f1'],['Position',result.lifecycle.position_pct+'%','#10b981'],['Saturation Risk',result.lifecycle.saturation_risk,'#f59e0b']].map(([l,v,c])=>(
                      <div key={l as string} style={{ textAlign:'center' as const,padding:10,background:'var(--bg-base)',borderRadius:9 }}>
                        <div style={{ fontSize:14,fontWeight:700,color:c as string }}>{v as string}</div>
                        <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>{l as string}</div>
                      </div>
                    ))}
                  </div>
                  {result.timing_analysis && <p style={{ fontSize:14,color:'var(--text-primary)',lineHeight:1.7,margin:0 }}>{result.timing_analysis}</p>}
                </div>
              )}
              {result.catalysts?.length > 0 && (
                <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18,marginBottom:12 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,marginBottom:10 }}>Growth Catalysts</div>
                  {result.catalysts.map((c: string,i: number) => <div key={i} style={{ display:'flex',gap:8,marginBottom:7,fontSize:13,color:'var(--text-secondary)' }}><span style={{ color:'#10b981' }}>→</span>{c}</div>)}
                </div>
              )}
              {result.platform_signals?.length > 0 && (
                <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18,marginBottom:12 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,marginBottom:10 }}>Platform Signals</div>
                  {result.platform_signals.map((p: any,i: number) => (
                    <div key={i} style={{ display:'flex',gap:10,marginBottom:8,padding:'9px 12px',background:'var(--bg-base)',borderRadius:8 }}>
                      <span style={{ fontSize:12,fontWeight:700,color:'var(--brand-purple)',minWidth:70 }}>{p.platform}</span>
                      <span style={{ fontSize:13,color:'var(--text-secondary)' }}>{p.signal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Compete mode */}
          {mode === 'compete' && (
            <div>
              {result.market_leaders?.length > 0 && (
                <Section title="Market Leaders" icon={<Target size={14} color="#ef4444"/>}>
                  {result.market_leaders.map((c: any,i: number) => (
                    <div key={i} style={{ padding:'14px',background:'var(--bg-base)',borderRadius:10,marginBottom:10 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                        <span style={{ fontSize:14,fontWeight:700,color:'var(--text-primary)' }}>{c.name}</span>
                        <span style={{ fontSize:12,color:'#10b981',fontWeight:600 }}>{c.estimated_revenue}</span>
                      </div>
                      {c.weaknesses?.map((w: string,j: number) => <div key={j} style={{ fontSize:12,color:'#ef4444',marginBottom:3 }}>⚡ {w}</div>)}
                      {c.customer_complaints?.map((cc: string,j: number) => <div key={j} style={{ fontSize:12,color:'#f59e0b',marginBottom:3,fontStyle:'italic' }}>💬 "{cc}"</div>)}
                    </div>
                  ))}
                </Section>
              )}
              {result.white_spaces?.length > 0 && (
                <Section title="White Spaces to Exploit" icon={<Zap size={14} color="var(--brand-purple)"/>}>
                  {result.white_spaces.map((w: any,i: number) => (
                    <div key={i} style={{ padding:'12px',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:9,marginBottom:8 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:'var(--text-primary)',marginBottom:4 }}>{typeof w==='string'?w:w.gap}</div>
                      {w.opportunity_size && <div style={{ fontSize:12,color:'#10b981' }}>Potential: {w.opportunity_size}</div>}
                    </div>
                  ))}
                </Section>
              )}
              {result.kill_angle && (
                <div style={{ padding:'16px',background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:12,marginBottom:12 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'#ef4444',textTransform:'uppercase' as const,marginBottom:6 }}>🎯 Kill Angle</div>
                  <p style={{ fontSize:14,color:'var(--text-primary)',margin:0,lineHeight:1.65 }}>{result.kill_angle}</p>
                </div>
              )}
            </div>
          )}

          {result.best_entry_angle && mode === 'deep' && (
            <div style={{ padding:'16px 18px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:12,marginTop:4 }}>
              <div style={{ fontSize:11,fontWeight:700,color:'#10b981',textTransform:'uppercase' as const,marginBottom:6 }}>✅ Best Entry Angle</div>
              <p style={{ fontSize:14,color:'var(--text-primary)',margin:0,lineHeight:1.65 }}>{result.best_entry_angle}</p>
            </div>
          )}

          <div style={{ display:'flex',gap:10,marginTop:16,flexWrap:'wrap' as const }}>
            <a href="/autopilot/starter" style={{ display:'inline-flex',alignItems:'center',gap:6,background:'var(--brand-purple)',color:'#fff',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none' }}>
              <Zap size={13}/> Build Starter Kit
            </a>
            <button onClick={()=>setResult(null)} style={{ display:'inline-flex',alignItems:'center',gap:5,background:'var(--bg-card)',border:'1px solid var(--border-base)',color:'var(--text-muted)',padding:'9px 16px',borderRadius:8,fontSize:13,cursor:'pointer' }}>
              <RefreshCw size={12}/> New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GeneratorPage() {
  return <Suspense fallback={<div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>}><GeneratorContent/></Suspense>;
}
