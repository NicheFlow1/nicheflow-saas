'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Search, AlertCircle, RefreshCw, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/validate-keyword';

export default function ValidatePage() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(({ data }: any) => { setSession(data.session); setReady(true); });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e: any, s: any) => { setSession(s); setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) { setDots(''); return; }
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, [loading]);

  async function validate() {
    if (!session || !keyword.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ keyword: keyword.trim() }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `Error ${r.status}`); }
      setResult(await r.json());
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(e.message || 'Validation failed');
    } finally { setLoading(false); }
  }

  if (!ready) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>;
  if (!session) { if (typeof window !== 'undefined') window.location.href = '/auth/login'; return null; }

  return (
    <div style={{ maxWidth:780,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
          <Search size={20} color="var(--brand-purple)"/>
          <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:0 }}>Validate Trend</h1>
        </div>
        <p style={{ fontSize:14,color:'var(--text-muted)',margin:0 }}>Deep market analysis using real Google Trends data.</p>
      </div>

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:24 }}>
        <label style={{ display:'block',fontSize:13,fontWeight:600,color:'var(--text-primary)',marginBottom:8 }}>Keyword or Market</label>
        <div style={{ display:'flex',gap:10 }}>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && validate()}
            placeholder="e.g. AI productivity tools, longevity supplements..."
            disabled={loading}
            style={{ flex:1,background:'var(--bg-base)',border:'1px solid var(--border-base)',borderRadius:8,padding:'10px 14px',color:'var(--text-primary)',fontSize:14,outline:'none' }}
          />
          <button
            onClick={validate}
            disabled={loading || !keyword.trim()}
            style={{ display:'flex',alignItems:'center',gap:6,background:!loading&&keyword.trim()?'var(--brand-purple)':'var(--bg-hover)',color:!loading&&keyword.trim()?'#fff':'var(--text-muted)',border:'none',padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:600,cursor:!loading&&keyword.trim()?'pointer':'not-allowed',whiteSpace:'nowrap' as const }}
          >
            <Search size={13}/>{loading ? `Validating${dots}` : 'Validate'}
          </button>
        </div>
        {loading && <p style={{ fontSize:12,color:'var(--text-muted)',margin:'10px 0 0' }}>Fetching real Google Trends data + AI analysis · 20-40 seconds</p>}
      </div>

      {error && (
        <div style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,marginBottom:20 }}>
          <AlertCircle size={15} color="#ef4444"/>
          <span style={{ fontSize:13,color:'#ef4444',flex:1 }}>{error}</span>
          <button onClick={validate} style={{ display:'flex',alignItems:'center',gap:4,background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:12 }}><RefreshCw size={11}/>Retry</button>
        </div>
      )}

      {result && (
        <div>
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))',border:'1px solid rgba(139,92,246,.22)',borderRadius:14,padding:22,marginBottom:20 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14 }}>
              <div>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
                  <h2 style={{ fontSize:18,fontWeight:700,color:'var(--text-primary)',margin:0 }}>{result.keyword}</h2>
                  <span style={{ fontSize:12,fontWeight:700,padding:'3px 10px',borderRadius:12,background:result.signal==='GO'?'rgba(16,185,129,.15)':'rgba(245,158,11,.15)',color:result.signal==='GO'?'#10b981':'#f59e0b' }}>{result.signal||'WATCH'}</span>
                  {result.real_data && <span style={{ fontSize:10,fontWeight:700,color:'#6366f1',background:'rgba(99,102,241,.1)',padding:'2px 8px',borderRadius:8 }}>REAL DATA</span>}
                </div>
                {result.go_reason && <p style={{ fontSize:13,color:'var(--text-muted)',margin:0 }}>{result.go_reason}</p>}
              </div>
              <div style={{ textAlign:'right' as const }}>
                <div style={{ fontSize:32,fontWeight:800,color:'var(--brand-purple)' }}>{result.overall_score||0}</div>
                <div style={{ fontSize:11,color:'var(--text-muted)' }}>Overall Score</div>
              </div>
            </div>

            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
              {[['Trend',result.trend_score,'#10b981'],['Demand',result.demand_score,'#6366f1'],['Timing',result.timing_score,'#f59e0b']].map(([l,v,c])=>(
                <div key={l as string} style={{ background:'var(--bg-base)',borderRadius:10,padding:'12px',textAlign:'center' as const }}>
                  <div style={{ fontSize:20,fontWeight:700,color:c as string }}>{v||0}</div>
                  <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>{l as string}</div>
                </div>
              ))}
            </div>
          </div>

          {result.ai_summary && (
            <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18,marginBottom:14 }}>
              <h4 style={{ fontSize:12,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,letterSpacing:'0.05em',marginBottom:8 }}>AI Analysis</h4>
              <p style={{ fontSize:14,color:'var(--text-primary)',lineHeight:1.65,margin:0 }}>{result.ai_summary}</p>
            </div>
          )}

          {result.rising_queries?.length > 0 && (
            <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18,marginBottom:14 }}>
              <h4 style={{ fontSize:12,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,letterSpacing:'0.05em',marginBottom:10 }}>Rising Searches</h4>
              <div style={{ display:'flex',flexWrap:'wrap' as const,gap:6 }}>
                {result.rising_queries.map((q: string,i: number) => <span key={i} style={{ fontSize:12,padding:'4px 12px',background:'rgba(99,102,241,.08)',color:'var(--brand-indigo)',borderRadius:20,border:'1px solid rgba(99,102,241,.2)' }}>{q}</span>)}
              </div>
            </div>
          )}

          {result.best_angle && (
            <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18,marginBottom:14 }}>
              <h4 style={{ fontSize:12,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,letterSpacing:'0.05em',marginBottom:8 }}>Best Entry Angle</h4>
              <p style={{ fontSize:14,color:'var(--text-primary)',lineHeight:1.65,margin:0 }}>{result.best_angle}</p>
            </div>
          )}

          {result.green_flags?.length > 0 && (
            <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:18 }}>
              <h4 style={{ fontSize:12,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase' as const,letterSpacing:'0.05em',marginBottom:10 }}>Key Signals</h4>
              <div style={{ display:'flex',flexDirection:'column' as const,gap:6 }}>
                {result.green_flags.map((f: string,i: number) => <div key={i} style={{ display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-secondary)' }}><CheckCircle size={13} color="#10b981"/>{f}</div>)}
                {result.red_flags?.map((f: string,i: number) => <div key={i} style={{ display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-secondary)' }}><XCircle size={13} color="#ef4444"/>{f}</div>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
