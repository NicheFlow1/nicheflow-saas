'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const SB = createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U');

const STEPS = ['Analyzing market signal…','Generating product ideas…','Writing landing page copy…','Building 7-day action plan…'];

function AutopilotInner() {
  const params = useSearchParams();
  const [niche, setNiche] = useState(params.get('niche') || '');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [kit, setKit] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => { loadHistory(); if (params.get('niche')) setTimeout(() => generate(params.get('niche')!), 400); }, []);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const loadHistory = async () => {
    try {
      const { data: { session } } = await SB.auth.getSession();
      if (!session) return;
      const { data } = await SB.from('starter_kits').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(6);
      if (data) setHistory(data);
    } catch {}
  };

  const generate = async (override?: string) => {
    const keyword = (override ?? niche).trim();
    if (!keyword) return;
    if (!override) setNiche(keyword);
    setLoading(true); setKit(null); setStep(0);
    const interval = setInterval(() => setStep(s => s < 3 ? s + 1 : s), 6000);
    try {
      const res = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` }, body: JSON.stringify({ niche: keyword }) });
      const data = await res.json();
      clearInterval(interval);
      setKit(data);
      const { data: { session } } = await SB.auth.getSession();
      if (session) {
        await SB.from('starter_kits').insert({ user_id: session.user.id, niche_name: keyword, kit_data: data }).catch(() => {});
        loadHistory();
      }
      showToast(`Starter kit ready for "${keyword}"`);
    } catch { clearInterval(interval); }
    setLoading(false);
  };

  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); showToast(`Copied: ${label}`); };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {toast && <div style={{ position:'fixed',bottom:28,right:28,background:'#1a1a2e',border:'1px solid var(--border)',borderRadius:10,padding:'12px 18px',fontSize:13,color:'var(--text-primary)',zIndex:1000,boxShadow:'0 8px 32px rgba(0,0,0,.4)',fontWeight:600 }}>✓ {toast}</div>}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Autopilot — Starter Kit Builder</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Enter any niche and get a complete market starter kit in ~30 seconds.</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="e.g. AI productivity tools for lawyers, keto meal prep…"
          style={{ flex:1,background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:10,padding:'13px 16px',color:'var(--text-primary)',fontSize:14,outline:'none' }} />
        <button onClick={() => generate()} disabled={loading || !niche.trim()}
          style={{ background:'var(--accent)',color:'#fff',border:'none',borderRadius:10,padding:'13px 24px',fontWeight:700,fontSize:14,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1 }}>
          {loading ? 'Building…' : 'Build Kit'}
        </button>
      </div>

      {/* Progress steps */}
      {loading && (
        <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'28px 32px',marginBottom:24 }}>
          <div style={{ fontSize:14,fontWeight:700,color:'var(--text-primary)',marginBottom:20 }}>Building your starter kit…</div>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
              <div style={{ width:22,height:22,borderRadius:'50%',border:`2px solid ${i < step ? '#10b981' : i === step ? 'var(--accent)' : 'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,background:i < step ? '#10b981' : 'transparent',transition:'all 0.3s' }}>
                {i < step ? <span style={{ color:'#fff',fontSize:11 }}>✓</span> : i === step ? <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--accent)',animation:'pulse 1s infinite' }} /> : null}
              </div>
              <span style={{ fontSize:13,color:i <= step ? 'var(--text-primary)' : 'var(--text-muted)',fontWeight:i === step ? 600 : 400 }}>
                Step {i+1}/4: {s}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Kit output */}
      {kit && !loading && (
        <div style={{ display:'grid',gap:16,marginBottom:32 }}>
          <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'24px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
              <h2 style={{ fontSize:18,fontWeight:800,color:'var(--text-primary)',margin:0 }}>Starter Kit: {niche}</h2>
              <div style={{ display:'flex',gap:8 }}>
                <Link href={`/validate?niche=${encodeURIComponent(niche)}`} style={{ background:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--text-secondary)',borderRadius:8,padding:'7px 14px',fontSize:12,textDecoration:'none' }}>Validate →</Link>
                <Link href={`/dashboard/keywords?seed=${encodeURIComponent(niche)}`} style={{ background:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--text-secondary)',borderRadius:8,padding:'7px 14px',fontSize:12,textDecoration:'none' }}>Keywords →</Link>
              </div>
            </div>
            {Object.entries(kit).map(([key, val]: [string, any]) => {
              if (!val || key === 'error') return null;
              const label = key.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase());
              const text = Array.isArray(val) ? val.join('\n') : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
              return (
                <div key={key} style={{ marginBottom:16,borderTop:'1px solid var(--border)',paddingTop:16 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.5px' }}>{label}</div>
                    <button onClick={() => copy(text, label)} style={{ background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:6,padding:'4px 10px',fontSize:11,color:'var(--text-muted)',cursor:'pointer' }}>Copy</button>
                  </div>
                  <div style={{ fontSize:13,color:'var(--text-secondary)',lineHeight:1.7,whiteSpace:'pre-wrap' }}>{text}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:'var(--text-secondary)',marginBottom:12 }}>Recent Kits</div>
          <div style={{ display:'grid',gap:10 }}>
            {history.map((h: any) => (
              <div key={h.id} style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600,color:'var(--text-primary)',fontSize:14 }}>{h.niche_name}</div>
                  <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>{new Date(h.created_at).toLocaleDateString()}</div>
                </div>
                <button onClick={() => { setNiche(h.niche_name); setKit(h.kit_data); }} style={{ background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:8,padding:'6px 14px',fontSize:12,color:'var(--text-secondary)',cursor:'pointer' }}>View kit →</button>
                <Link href={`/autopilot?niche=${encodeURIComponent(h.niche_name)}`} style={{ background:'var(--accent)',color:'#fff',borderRadius:8,padding:'6px 14px',fontSize:12,fontWeight:700,textDecoration:'none' }}>Rebuild</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

export default function AutopilotPage() {
  return <Suspense fallback={<div style={{padding:32,color:'var(--text-muted)'}}>Loading…</div>}><AutopilotInner /></Suspense>;
}
