'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { useSearchParams } from 'next/navigation';
import { Package, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

function StarterContent() {
  const params = useSearchParams();
  const prefill = params?.get('keyword') || '';
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [keyword, setKeyword] = useState(prefill);
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
    if (prefill && prefill !== keyword) setKeyword(prefill);
  }, [prefill]);

  useEffect(() => {
    if (!loading) { setDots(''); return; }
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, [loading]);

  async function build() {
    if (!session || !keyword.trim()) return;
    setLoading(true); setError('');
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 100000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'generate_starter_kit', keyword: keyword.trim() }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `Error ${r.status}`); }
      const data = await r.json();
      if (data.id) { window.location.href = `/autopilot/kit/${data.id}`; return; }
      throw new Error('Kit saved but no ID returned');
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(e.message || 'Failed to build kit');
    } finally { setLoading(false); }
  }

  if (!ready) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /></div>;
  if (!session) { if (typeof window !== 'undefined') window.location.href = '/auth/login'; return null; }

  return (
    <div style={{ maxWidth:680,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:24 }}>
        <a href="/autopilot" style={{ display:'flex',alignItems:'center',color:'var(--text-muted)',textDecoration:'none' }}><ArrowLeft size={16}/></a>
        <div>
          <h1 style={{ fontSize:18,fontWeight:700,color:'var(--text-primary)',margin:0 }}>Starter Kit Builder</h1>
          <p style={{ fontSize:13,color:'var(--text-muted)',margin:0 }}>Real Google Trends + complete business plan</p>
        </div>
      </div>
      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:24 }}>
        <label style={{ display:'block',fontSize:13,fontWeight:600,color:'var(--text-primary)',marginBottom:8 }}>Market or Keyword</label>
        <input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!loading&&build()} placeholder="e.g. AI productivity tools, sustainable pet products..." disabled={loading} style={{ width:'100%',background:'var(--bg-base)',border:'1px solid var(--border-base)',borderRadius:8,padding:'10px 14px',color:'var(--text-primary)',fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:14,opacity:loading?0.6:1 }}/>
        {error && <div style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,marginBottom:14 }}><AlertCircle size={14} color="#ef4444"/><span style={{ fontSize:13,color:'#ef4444',flex:1 }}>{error}</span><button onClick={build} style={{ display:'flex',alignItems:'center',gap:4,background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:12 }}><RefreshCw size={11}/>Retry</button></div>}
        <button onClick={build} disabled={loading||!keyword.trim()} style={{ width:'100%',background:!loading&&keyword.trim()?'var(--brand-purple)':'var(--bg-hover)',color:!loading&&keyword.trim()?'#fff':'var(--text-muted)',border:'none',padding:'11px',borderRadius:8,fontSize:14,fontWeight:600,cursor:!loading&&keyword.trim()?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
          <Package size={15}/>{loading?`Building your kit${dots}`:'Build Complete Starter Kit'}
        </button>
        <p style={{ fontSize:12,color:'var(--text-muted)',textAlign:'center',margin:'10px 0 0' }}>{loading?'Fetching real trend data + AI analysis · 30-60 seconds':'Real Google Trends · Product ideas · Landing page copy · Reddit communities · Revenue path'}</p>
      </div>
    </div>
  );
}

export default function StarterPage() {
  return <Suspense fallback={<div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>}><StarterContent/></Suspense>;
}
