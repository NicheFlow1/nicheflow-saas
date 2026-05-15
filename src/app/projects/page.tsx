'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient, SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase/client-singleton';
import { TrendingUp, Search, Trash2, ExternalLink, X, Copy, Check } from 'lucide-react';

export default function ProjectsPage() {
  const [session, setSession] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(async ({ data }: any) => {
      setSession(data.session);
      if (data.session) loadReports(data.session.access_token);
    });
  }, []);

  async function loadReports(token: string) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/validation_reports?select=*&order=created_at.desc`, { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` } });
    if (r.ok) { const d = await r.json(); setReports(d); setFiltered(d); }
  }

  useEffect(() => {
    let list = reports;
    if (filter === 'go') list = list.filter(r => r.signal === 'GO');
    if (filter === 'real') list = list.filter(r => r.real_data);
    if (search) list = list.filter(r => r.keyword?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [search, filter, reports]);

  async function deleteReport(id: string) {
    if (!session) return;
    await fetch(`${SUPABASE_URL}/rest/v1/validation_reports?id=eq.${id}`, { method:'DELETE', headers:{ apikey: SUPABASE_ANON, Authorization:`Bearer ${session.access_token}`, Prefer:'return=minimal' } });
    setReports(prev => prev.filter(r => r.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:'0 0 4px' }}>Validation Reports</h1>
          <p style={{ fontSize:13,color:'var(--text-muted)',margin:0 }}>{filtered.length} reports</p>
        </div>
        <a href="/validate" style={{ display:'inline-flex',alignItems:'center',gap:6,background:'var(--brand-purple)',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none' }}>
          <Search size={13}/> New Validation
        </a>
      </div>

      <div style={{ display:'flex',gap:10,marginBottom:20,flexWrap:'wrap' as const }}>
        <div style={{ flex:1,minWidth:200,display:'flex',alignItems:'center',gap:8,background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:8,padding:'8px 12px' }}>
          <Search size={14} color="var(--text-muted)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reports..." style={{ flex:1,background:'none',border:'none',outline:'none',color:'var(--text-primary)',fontSize:13 }}/>
        </div>
        {['all','go','real'].map(f => <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',border:filter===f?'none':'1px solid var(--border-base)',background:filter===f?'var(--brand-purple)':'transparent',color:filter===f?'#fff':'var(--text-muted)' }}>{f==='all'?'All':f==='go'?'GO Signals':'Real Data'}</button>)}
      </div>

      {filtered.length === 0 && <div style={{ textAlign:'center',padding:'48px 24px',border:'1px dashed var(--border-base)',borderRadius:12 }}><p style={{ color:'var(--text-muted)',fontSize:13 }}>No reports yet. <a href="/validate" style={{ color:'var(--brand-purple)',textDecoration:'none' }}>Validate your first trend</a></p></div>}

      <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:'14px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:12 }} onClick={()=>setSelected(r)}>
            <TrendingUp size={16} color="#6366f1"/>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:2 }}>
                <span style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{r.keyword}</span>
                <span style={{ fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:10,background:r.signal==='GO'?'rgba(16,185,129,.12)':'rgba(245,158,11,.12)',color:r.signal==='GO'?'#10b981':'#f59e0b',flexShrink:0 }}>{r.signal||'WATCH'}</span>
                {r.real_data && <span style={{ fontSize:10,fontWeight:700,color:'#6366f1',background:'rgba(99,102,241,.1)',padding:'2px 7px',borderRadius:8,flexShrink:0 }}>REAL DATA</span>}
              </div>
              <div style={{ fontSize:12,color:'var(--text-muted)',display:'flex',gap:12 }}>
                <span>Score {r.overall_score||0}</span>
                <span>Trend {r.trend_score||0}</span>
                <span>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button onClick={e=>{e.stopPropagation();deleteReport(r.id)}} style={{ background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',padding:4,flexShrink:0 }}><Trash2 size={14}/></button>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:100,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'32px 16px',overflowY:'auto' }} onClick={()=>setSelected(null)}>
          <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:16,padding:28,maxWidth:700,width:'100%',position:'relative' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20 }}>
              <div>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:6 }}>
                  <h2 style={{ fontSize:18,fontWeight:700,color:'var(--text-primary)',margin:0 }}>{selected.keyword}</h2>
                  <span style={{ fontSize:12,fontWeight:700,padding:'3px 10px',borderRadius:12,background:selected.signal==='GO'?'rgba(16,185,129,.15)':'rgba(245,158,11,.15)',color:selected.signal==='GO'?'#10b981':'#f59e0b' }}>{selected.signal||'WATCH'}</span>
                </div>
                <p style={{ fontSize:12,color:'var(--text-muted)',margin:0 }}>{new Date(selected.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={()=>copy(JSON.stringify(selected,null,2))} style={{ display:'flex',alignItems:'center',gap:4,background:'var(--bg-hover)',border:'1px solid var(--border-base)',color:'var(--text-muted)',padding:'6px 12px',borderRadius:8,cursor:'pointer',fontSize:12 }}>{copied?<><Check size={12} color="#10b981"/>Copied</>:<><Copy size={12}/>Export</>}</button>
                <button onClick={()=>setSelected(null)} style={{ background:'var(--bg-hover)',border:'1px solid var(--border-base)',color:'var(--text-muted)',padding:'6px 10px',borderRadius:8,cursor:'pointer' }}><X size={14}/></button>
              </div>
            </div>

            <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20 }}>
              {[['Overall',selected.overall_score||0,'#6366f1'],['Trend',selected.trend_score||0,'#10b981'],['Demand',selected.demand_score||0,'#f59e0b'],['Timing',selected.timing_score||0,'#8b5cf6']].map(([l,v,c])=>(
                <div key={l as string} style={{ background:'var(--bg-base)',borderRadius:10,padding:12,textAlign:'center' }}>
                  <div style={{ fontSize:22,fontWeight:700,color:c as string }}>{v as number}</div>
                  <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>{l as string}</div>
                </div>
              ))}
            </div>

            {selected.ai_summary && <div style={{ marginBottom:16 }}><h4 style={{ fontSize:13,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8 }}>AI Analysis</h4><p style={{ fontSize:14,color:'var(--text-primary)',lineHeight:1.65,margin:0 }}>{selected.ai_summary}</p></div>}
            {selected.best_angle && <div style={{ marginBottom:16 }}><h4 style={{ fontSize:13,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8 }}>Best Entry Angle</h4><p style={{ fontSize:14,color:'var(--text-primary)',lineHeight:1.65,margin:0 }}>{selected.best_angle}</p></div>}
            {selected.monetization_paths?.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <h4 style={{ fontSize:13,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8 }}>Monetization Paths</h4>
                {selected.monetization_paths.map((m: any,i: number) => <div key={i} style={{ padding:'8px 12px',background:'var(--bg-base)',borderRadius:8,marginBottom:6,fontSize:13,color:'var(--text-primary)' }}>{typeof m==='string'?m:`${m.model||''} — ${m.potential||''}`}</div>)}
              </div>
            )}
            {selected.rising_queries?.length > 0 && (
              <div>
                <h4 style={{ fontSize:13,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8 }}>Rising Searches</h4>
                <div style={{ display:'flex',flexWrap:'wrap' as const,gap:6 }}>
                  {selected.rising_queries.map((q: string,i: number) => <span key={i} style={{ fontSize:12,padding:'4px 10px',background:'rgba(99,102,241,.08)',color:'var(--brand-purple)',borderRadius:20,border:'1px solid rgba(99,102,241,.2)' }}>{q}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
