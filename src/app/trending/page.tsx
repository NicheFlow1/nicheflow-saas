'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { TrendingUp, Zap, RefreshCw, ExternalLink, Flame, ArrowUp } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

const CATEGORIES = ['All','AI & Tech','Health & Wellness','Finance','Creator Economy','SaaS','E-commerce','Education','Climate & Green'];

export default function TrendingPage() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [category, setCategory] = useState('All');
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [error, setError] = useState('');
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

  async function discover() {
    if (!session) return;
    setLoading(true); setError(''); setTrends([]);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'discover_trending', category: category === 'All' ? null : category }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) throw new Error((await r.json().catch(()=>({}))).error || 'Failed');
      const data = await r.json();
      setTrends(data.trends || []);
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Timed out. Please try again.');
      else setError(e.message || 'Failed to load trends');
    } finally { setLoading(false); }
  }

  if (!ready) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>;
  if (!session) { if (typeof window !== 'undefined') window.location.href='/auth/login'; return null; }

  return (
    <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
          <Flame size={20} color="#f59e0b"/>
          <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:0 }}>Trending Now</h1>
          <span style={{ fontSize:10,fontWeight:700,background:'rgba(245,158,11,.15)',color:'#f59e0b',padding:'2px 8px',borderRadius:20,border:'1px solid rgba(245,158,11,.3)' }}>LIVE</span>
        </div>
        <p style={{ fontSize:14,color:'var(--text-muted)',margin:0 }}>Discover what is trending RIGHT NOW — before it goes mainstream. Powered by real data signals.</p>
      </div>

      <div style={{ display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={()=>setCategory(c)} style={{ padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',border:category===c?'none':'1px solid var(--border-base)',background:category===c?'var(--brand-purple)':'transparent',color:category===c?'#fff':'var(--text-muted)' }}>{c}</button>
        ))}
      </div>

      <button onClick={discover} disabled={loading} style={{ display:'flex',alignItems:'center',gap:8,background:'var(--brand-purple)',color:'#fff',border:'none',padding:'11px 24px',borderRadius:9,fontSize:14,fontWeight:600,cursor:loading?'not-allowed':'pointer',marginBottom:24,opacity:loading?0.8:1 }}>
        <RefreshCw size={14} style={{ animation:loading?'spin 0.8s linear infinite':undefined }}/>{loading?`Scanning${dots}`:'Scan Trending Topics'}
      </button>

      {error && <div style={{ padding:'12px 16px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,marginBottom:20,fontSize:13,color:'#ef4444' }}>{error}</div>}

      {trends.length === 0 && !loading && (
        <div style={{ textAlign:'center',padding:'48px 24px',border:'1px dashed var(--border-base)',borderRadius:14 }}>
          <Flame size={36} color="var(--text-disabled)" style={{ marginBottom:12 }}/>
          <p style={{ fontSize:14,color:'var(--text-muted)',marginBottom:6 }}>No trends loaded yet.</p>
          <p style={{ fontSize:13,color:'var(--text-disabled)' }}>Click "Scan Trending Topics" to discover what is blowing up right now.</p>
        </div>
      )}

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
        {trends.map((t: any, i: number) => (
          <div key={i} style={{ background:'var(--bg-card)',border:`1px solid ${t.signal==='GO'?'rgba(16,185,129,.2)':'var(--border-base)'}`,borderRadius:13,padding:18,display:'flex',flexDirection:'column',gap:10 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:5 }}>
                  {t.signal === 'GO' && <span style={{ fontSize:10,fontWeight:700,background:'rgba(16,185,129,.15)',color:'#10b981',padding:'2px 7px',borderRadius:10 }}>GO</span>}
                  {t.category && <span style={{ fontSize:10,color:'var(--text-muted)',background:'var(--bg-hover)',padding:'2px 7px',borderRadius:8 }}>{t.category}</span>}
                </div>
                <h3 style={{ fontSize:14,fontWeight:700,color:'var(--text-primary)',margin:'0 0 4px',lineHeight:1.3 }}>{t.name}</h3>
                <p style={{ fontSize:12,color:'var(--text-muted)',margin:0,lineHeight:1.5 }}>{t.why_trending}</p>
              </div>
              <div style={{ textAlign:'center' as const,marginLeft:12,flexShrink:0 }}>
                <div style={{ fontSize:22,fontWeight:800,color:t.score>=70?'#10b981':t.score>=50?'#f59e0b':'var(--text-muted)' }}>{t.score}</div>
                <div style={{ fontSize:9,color:'var(--text-muted)',textTransform:'uppercase' as const }}>score</div>
              </div>
            </div>
            {t.growth && (
              <div style={{ display:'flex',alignItems:'center',gap:5,fontSize:12 }}>
                <ArrowUp size={11} color="#10b981"/>
                <span style={{ color:'#10b981',fontWeight:600 }}>{t.growth}</span>
                <span style={{ color:'var(--text-muted)' }}>growth · {t.stage || 'emerging'}</span>
              </div>
            )}
            {t.opportunity && <p style={{ fontSize:12,color:'var(--text-secondary)',lineHeight:1.5,margin:0,padding:'8px 10px',background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.12)',borderRadius:8 }}>💡 {t.opportunity}</p>}
            <div style={{ display:'flex',gap:7,marginTop:2 }}>
              <a href={`/generator?keyword=${encodeURIComponent(t.name)}`} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.2)',color:'#a5b4fc',padding:'7px',borderRadius:8,fontSize:12,fontWeight:600,textDecoration:'none' }}>
                <Zap size={11}/>Analyze
              </a>
              <a href={`/autopilot/starter?keyword=${encodeURIComponent(t.name)}`} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)',color:'#10b981',padding:'7px',borderRadius:8,fontSize:12,fontWeight:600,textDecoration:'none' }}>
                <TrendingUp size={11}/>Build Kit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
