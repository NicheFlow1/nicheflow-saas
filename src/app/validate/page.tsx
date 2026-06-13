'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

export default function ValidatePage() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const run = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'validate_niche', niche: niche.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      // Save to DB
      const { data: { session } } = await SB.auth.getSession();
      if (session) {
        await SB.from('validation_reports').insert({
          user_id: session.user.id,
          niche: niche.trim(),
          score: data.overall_score ?? 0,
          result: data,
        }).catch(() => {});
        setSaved(true);
      }
    } catch (e: any) {
      setError(e.message || 'Validation failed.');
    }
    setLoading(false);
  };

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{padding:'32px', maxWidth:'860px'}}>
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontSize:'24px', fontWeight:800, color:'var(--text-primary)', margin:'0 0 6px'}}> Niche Validator</h1>
        <p style={{color:'var(--text-muted)', fontSize:'14px', margin:0}}>Get a full viability score with market size, competition, monetization, and trend data.</p>
      </div>

      <div style={{display:'flex', gap:'10px', marginBottom:'28px'}}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key==='Enter' && run()}
          placeholder="e.g. AI productivity tools, keto meal prep, Shopify micro-SaaS…"
          style={{flex:1, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'13px 16px', color:'var(--text-primary)', fontSize:'14px', outline:'none'}}/>
        <button onClick={run} disabled={loading || !niche.trim()}
          style={{background:'var(--accent)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px 24px', fontWeight:700, fontSize:'14px', cursor:loading?'not-allowed':'pointer'}}>
          {loading ? 'Validating…' : ' Validate'}
        </button>
      </div>

      {error && <p style={{color:'#ef4444', fontSize:'13px', marginBottom:'16px'}}>{error}</p>}

      {result && (
        <div style={{display:'grid', gap:'16px'}}>
          {/* Score banner */}
          <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px', display:'flex', alignItems:'center', gap:'24px'}}>
            <div style={{textAlign:'center', flexShrink:0}}>
              <div style={{fontSize:'56px', fontWeight:900, color:scoreColor(result.overall_score??0), lineHeight:1}}>{result.overall_score ?? '—'}</div>
              <div style={{fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', marginTop:'4px'}}>Overall Score</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:'18px', fontWeight:800, color:'var(--text-primary)', marginBottom:'6px'}}>{result.verdict || (result.overall_score>=70?'Strong opportunity':'Needs more research')}</div>
              <p style={{color:'var(--text-muted)', fontSize:'13px', margin:'0 0 12px'}}>{result.summary || result.analysis || 'Analysis complete.'}</p>
              {saved && <span style={{fontSize:'11px', color:'#10b981', fontWeight:600}}> Saved to Reports</span>}
            </div>
          </div>

          {/* Sub-scores */}
          {result.scores && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'12px'}}>
              {Object.entries(result.scores).map(([k,v]: [string,any]) => (
                <div key={k} style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
                  <div style={{fontSize:'24px', fontWeight:800, color:scoreColor(Number(v))}}>{v}</div>
                  <div style={{fontSize:'11px', color:'var(--text-muted)', marginTop:'4px', textTransform:'capitalize'}}>{k.replace(/_/g,' ')}</div>
                </div>
              ))}
            </div>
          )}

          {/* Key data */}
          {(result.market_size || result.competition_level || result.trend) && (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
              {result.market_size && <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px'}}><div style={{fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px'}}>MARKET SIZE</div><div style={{fontWeight:700, color:'var(--text-primary)'}}>{result.market_size}</div></div>}
              {result.competition_level && <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px'}}><div style={{fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px'}}>COMPETITION</div><div style={{fontWeight:700, color:'var(--text-primary)'}}>{result.competition_level}</div></div>}
              {result.trend && <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px'}}><div style={{fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px'}}>TREND</div><div style={{fontWeight:700, color:'var(--text-primary)'}}>{result.trend}</div></div>}
            </div>
          )}

          {/* CTA */}
          <div style={{display:'flex', gap:'10px'}}>
            <Link href={`/autopilot?niche=${encodeURIComponent(niche)}`}
              style={{background:'var(--accent)', color:'#fff', borderRadius:'10px', padding:'12px 24px', textDecoration:'none', fontSize:'14px', fontWeight:700}}>
               Run Full Autopilot →
            </Link>
            <Link href={`/dashboard/keywords?seed=${encodeURIComponent(niche)}`}
              style={{background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'10px', padding:'12px 20px', textDecoration:'none', fontSize:'14px', fontWeight:600}}>
               Find Keywords →
            </Link>
            <Link href="/projects"
              style={{background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'10px', padding:'12px 20px', textDecoration:'none', fontSize:'14px', fontWeight:600}}>
               View Reports →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
