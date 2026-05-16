'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { useSearchParams } from 'next/navigation';
import { Zap, AlertCircle, RefreshCw } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/analyze-opportunity';

const MODES = [
  { id:'deep', label:'Deep Analysis', sub:'Surgical market breakdown' },
  { id:'discover', label:'Discover 3 Niches', sub:'Find hidden opportunities' },
  { id:'trend', label:'Trend Analysis', sub:'Lifecycle and timing intel' },
  { id:'compete', label:'Competition X-Ray', sub:'Map the full battlefield' },
];

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
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${session.access_token}` },
        body: JSON.stringify({ niche: input.trim(), mode }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error || `Error ${r.status}`); }
      setResult(await r.json());
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(e.message || 'Analysis failed');
    } finally { setLoading(false); }
  }

  if (!ready) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>;
  if (!session) { if (typeof window !== 'undefined') window.location.href='/auth/login'; return null; }

  return (
    <div style={{ maxWidth:800,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:'0 0 4px' }}>Intelligence Engine</h1>
          <p style={{ fontSize:14,color:'var(--text-muted)',margin:0 }}>Analyze any market — results linked to your Radar</p>
        </div>
        {credits && <span style={{ fontSize:12,fontWeight:600,color:'var(--text-muted)',background:'var(--bg-card)',border:'1px solid var(--border-base)',padding:'4px 10px',borderRadius:20 }}>{credits.generations_used}/{credits.generations_limit} CREDITS</span>}
      </div>

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:20 }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:16 }}>
          {MODES.map(m => (
            <button key={m.id} onClick={()=>setMode(m.id)} style={{ padding:'10px 14px',borderRadius:10,border:`1px solid ${mode===m.id?'rgba(99,102,241,.5)':'var(--border-base)'}`,background:mode===m.id?'rgba(99,102,241,.1)':'var(--bg-base)',cursor:'pointer',textAlign:'left' as const }}>
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
          rows={3}
          style={{ width:'100%',background:'var(--bg-base)',border:'1px solid var(--border-base)',borderRadius:8,padding:'10px 14px',color:'var(--text-primary)',fontSize:14,outline:'none',resize:'vertical',marginBottom:14,opacity:loading?0.6:1,boxSizing:'border-box' as const }}
        />

        {error && <div style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,marginBottom:14 }}><AlertCircle size={14} color="#ef4444"/><span style={{ fontSize:13,color:'#ef4444',flex:1 }}>{error}</span><button onClick={analyze} style={{ display:'flex',alignItems:'center',gap:4,background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:12 }}><RefreshCw size={11}/>Retry</button></div>}

        <button onClick={analyze} disabled={loading||!input.trim()} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:!loading&&input.trim()?'var(--brand-purple)':'var(--bg-hover)',color:!loading&&input.trim()?'#fff':'var(--text-muted)',border:'none',padding:'11px',borderRadius:8,fontSize:14,fontWeight:600,cursor:!loading&&input.trim()?'pointer':'not-allowed' }}>
          <Zap size={15}/>{loading?`Running analysis${dots}`:'Run Analysis'}
        </button>
        {loading && <p style={{ fontSize:12,color:'var(--text-muted)',textAlign:'center' as const,margin:'8px 0 0' }}>AI analysis in progress · 20-45 seconds</p>}
      </div>

      {result && (
        <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14 }}>
            {result.signal && <span style={{ fontSize:12,fontWeight:700,padding:'3px 10px',borderRadius:12,background:result.signal==='GO'?'rgba(16,185,129,.15)':'rgba(245,158,11,.15)',color:result.signal==='GO'?'#10b981':'#f59e0b' }}>{result.signal} {result.signal_reason||''}</span>}
            {result.overall_score && <span style={{ fontSize:13,fontWeight:700,color:'var(--brand-purple)' }}>Score: {result.overall_score}/100</span>}
          </div>
          {result.title && <h2 style={{ fontSize:17,fontWeight:700,color:'var(--text-primary)',marginBottom:10 }}>{result.title}</h2>}
          {result.summary && <p style={{ fontSize:14,color:'var(--text-secondary)',lineHeight:1.65,marginBottom:14 }}>{result.summary}</p>}
          {result.key_insight && <div style={{ padding:'12px 16px',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.2)',borderRadius:10,marginBottom:14 }}><p style={{ fontSize:13,color:'#a5b4fc',margin:0,fontStyle:'italic' }}>"{result.key_insight}"</p></div>}
          {result.opportunities?.map((opp: any,i: number) => (
            <div key={i} style={{ background:'var(--bg-base)',borderRadius:10,padding:14,marginBottom:10 }}>
              <div style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',marginBottom:4 }}>{opp.title||opp.name}</div>
              <p style={{ fontSize:13,color:'var(--text-secondary)',margin:0,lineHeight:1.6 }}>{opp.description||opp.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GeneratorPage() {
  return <Suspense fallback={<div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>}><GeneratorContent/></Suspense>;
}
