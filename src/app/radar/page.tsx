'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient, SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase/client-singleton';
import { Radio, Plus, RefreshCw, Zap, Trash2, Bell, X } from 'lucide-react';

export default function RadarPage() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [markets, setMarkets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMarket, setNewMarket] = useState('');
  const [adding, setAdding] = useState(false);
  const [analyzing, setAnalyzing] = useState<string|null>(null);
  const [addError, setAddError] = useState('');
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(({ data }: any) => {
      setSession(data.session);
      setReady(true);
      if (data.session) loadData(data.session.access_token);
    });
  }, []);

  async function loadData(token: string) {
    try {
      const [rm, ra] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/radar?select=*&order=created_at.desc`, { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` } }),
        fetch(`${SUPABASE_URL}/rest/v1/radar_alerts?select=*&dismissed=eq.false&order=created_at.desc&limit=5`, { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` } }),
      ]);
      if (rm.ok) setMarkets(await rm.json());
      if (ra.ok) { const d = await ra.json(); if (Array.isArray(d)) setAlerts(d); }
    } catch {}
  }

  async function addMarket() {
    if (!session || !newMarket.trim()) return;
    setAdding(true); setAddError('');
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/radar`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify({
          user_id: session.user.id,
          market: newMarket.trim(),
          signal: 'WATCH',
          overall_score: 0,
          is_active: true
        })
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || `Error ${r.status}`);
      }
      const data = await r.json();
      const added = Array.isArray(data) ? data[0] : data;
      if (added) setMarkets(prev => [added, ...prev]);
      setNewMarket(''); setShowAdd(false);
    } catch (e: any) {
      setAddError(e.message || 'Failed to add market');
    } finally { setAdding(false); }
  }

  async function deleteMarket(id: string) {
    if (!session) return;
    await fetch(`${SUPABASE_URL}/rest/v1/radar?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${session.access_token}`, Prefer: 'return=minimal' }
    });
    setMarkets(prev => prev.filter(m => m.id !== id));
  }

  async function analyze(market: any) {
    if (!session) return;
    setAnalyzing(market.id);
    try {
      const r = await fetch('https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/validate-keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ keyword: market.market, radar_id: market.id })
      });
      if (r.ok) {
        const data = await r.json();
        setMarkets(prev => prev.map(m => m.id === market.id ? {
          ...m,
          overall_score: data.overall_score || m.overall_score,
          signal: data.signal || m.signal,
          entry_window: data.entry_timing || m.entry_window,
          last_analyzed_at: new Date().toISOString()
        } : m));
      }
    } finally { setAnalyzing(null); }
  }

  const filtered = markets.filter(m => !search || m.market?.toLowerCase().includes(search.toLowerCase()));
  const goCount = markets.filter(m => m.signal === 'GO').length;

  if (!ready) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}>
      <div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
    </div>
  );
  if (!session) { if (typeof window !== 'undefined') window.location.href='/auth/login'; return null; }

  return (
    <div style={{ maxWidth:860,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20 }}>
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:4 }}>
            <Radio size={20} color="var(--brand-purple)"/>
            <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:0 }}>Market Radar</h1>
          </div>
          <p style={{ fontSize:13,color:'var(--text-muted)',margin:0 }}>{markets.length} markets tracked — {goCount} GO signals</p>
        </div>
        <button onClick={()=>{setShowAdd(!showAdd);setAddError('');}} style={{ display:'flex',alignItems:'center',gap:6,background:'var(--brand-purple)',color:'#fff',border:'none',padding:'9px 16px',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer' }}>
          <Plus size={14}/> Add Market
        </button>
      </div>

      {showAdd && (
        <div style={{ background:'var(--bg-card)',border:'1px solid rgba(99,102,241,.3)',borderRadius:12,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',gap:10,marginBottom:addError?10:0 }}>
            <input
              value={newMarket}
              onChange={e=>setNewMarket(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addMarket()}
              placeholder="e.g. AI productivity tools, longevity supplements..."
              style={{ flex:1,background:'var(--bg-base)',border:'1px solid var(--border-base)',borderRadius:8,padding:'9px 13px',color:'var(--text-primary)',fontSize:14,outline:'none' }}
            />
            <button onClick={addMarket} disabled={adding||!newMarket.trim()} style={{ background:'var(--brand-purple)',color:'#fff',border:'none',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:600,cursor:adding?'not-allowed':'pointer',opacity:adding?0.7:1 }}>
              {adding?'Adding...':'Add'}
            </button>
            <button onClick={()=>{setShowAdd(false);setAddError('');}} style={{ background:'var(--bg-hover)',border:'1px solid var(--border-base)',color:'var(--text-muted)',padding:'9px 11px',borderRadius:8,cursor:'pointer' }}>
              <X size={14}/>
            </button>
          </div>
          {addError && <p style={{ fontSize:12,color:'#ef4444',margin:0 }}>{addError}</p>}
        </div>
      )}

      {alerts.filter(a=>!a.dismissed).map(alert => (
        <div key={alert.id} style={{ display:'flex',alignItems:'center',gap:10,padding:'11px 16px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:10,marginBottom:10 }}>
          <Bell size={14} color="#10b981"/>
          <span style={{ fontSize:13,color:'var(--text-secondary)',flex:1 }}>{alert.message}</span>
          <button onClick={async()=>{
            await fetch(`${SUPABASE_URL}/rest/v1/radar_alerts?id=eq.${alert.id}`,{method:'PATCH',headers:{apikey:SUPABASE_ANON,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:'{"dismissed":true}'});
            setAlerts(prev=>prev.filter(a=>a.id!==alert.id));
          }} style={{ background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:12 }}>dismiss</button>
        </div>
      ))}

      <div style={{ display:'flex',alignItems:'center',gap:8,background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:9,padding:'8px 13px',marginBottom:16 }}>
        <Radio size={13} color="var(--text-muted)"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your radar..." style={{ flex:1,background:'none',border:'none',outline:'none',color:'var(--text-primary)',fontSize:13 }}/>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center',padding:'48px 24px',border:'1px dashed var(--border-base)',borderRadius:12 }}>
          <Radio size={32} color="var(--text-disabled)" style={{ marginBottom:12 }}/>
          <p style={{ fontSize:14,color:'var(--text-muted)',marginBottom:6 }}>No markets on your radar yet.</p>
          <button onClick={()=>setShowAdd(true)} style={{ background:'var(--brand-purple)',color:'#fff',border:'none',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer' }}>Add your first market</button>
        </div>
      )}

      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {filtered.map(m => (
          <div key={m.id} style={{ background:'var(--bg-card)',border:`1px solid ${m.signal==='GO'?'rgba(16,185,129,.2)':'var(--border-base)'}`,borderRadius:12,padding:'16px 18px',display:'flex',alignItems:'center',gap:14 }}>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
                <span style={{ fontSize:15,fontWeight:700,color:'var(--text-primary)' }}>{m.market}</span>
                <span style={{ fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:10,background:m.signal==='GO'?'rgba(16,185,129,.15)':m.signal==='WAIT'?'rgba(239,68,68,.12)':'rgba(245,158,11,.15)',color:m.signal==='GO'?'#10b981':m.signal==='WAIT'?'#ef4444':'#f59e0b' }}>{m.signal||'WATCH'}</span>
                {m.lifecycle_stage && <span style={{ fontSize:10,fontWeight:700,color:'var(--text-muted)',background:'var(--bg-hover)',padding:'2px 7px',borderRadius:8,textTransform:'uppercase' as const }}>{m.lifecycle_stage}</span>}
              </div>
              <div style={{ display:'flex',gap:14,fontSize:12,color:'var(--text-muted)' }}>
                {(m.overall_score||0) > 0 && <span>Score <strong style={{ color:'var(--text-primary)' }}>{m.overall_score}</strong></span>}
                {m.entry_window && <span>Entry <strong style={{ color:m.entry_window==='NOW'?'#10b981':'var(--text-primary)' }}>{m.entry_window}</strong></span>}
                {m.last_analyzed_at && <span>Analyzed {new Date(m.last_analyzed_at).toLocaleDateString()}</span>}
                {!m.last_analyzed_at && <span style={{ color:'var(--text-disabled)' }}>Not yet analyzed</span>}
              </div>
            </div>
            <div style={{ display:'flex',gap:8,flexShrink:0 }}>
              <button onClick={()=>analyze(m)} disabled={analyzing===m.id} style={{ display:'flex',alignItems:'center',gap:5,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',color:'#a5b4fc',padding:'7px 13px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' as const }}>
                <RefreshCw size={12} style={{ animation:analyzing===m.id?'spin 0.8s linear infinite':undefined }}/>{analyzing===m.id?'Analyzing...':'Analyze'}
              </button>
              <a href={`/generator?keyword=${encodeURIComponent(m.market||'')}`} style={{ display:'flex',alignItems:'center',gap:5,background:'rgba(139,92,246,.1)',border:'1px solid rgba(139,92,246,.25)',color:'var(--brand-purple)',padding:'7px 13px',borderRadius:8,fontSize:12,fontWeight:600,textDecoration:'none',whiteSpace:'nowrap' as const }}>
                <Zap size={12}/>Deep
              </a>
              <button onClick={()=>deleteMarket(m.id)} style={{ display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.15)',color:'#ef4444',padding:'7px 10px',borderRadius:8,cursor:'pointer' }}>
                <Trash2 size={13}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
