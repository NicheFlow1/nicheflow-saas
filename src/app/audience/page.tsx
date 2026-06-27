'use client';
export const dynamic = 'force-dynamic';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { useState } from 'react';
import Link from 'next/link';

export default function AudiencePage() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({ action: 'audience_intel', niche: niche.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Failed to analyze audience.');
    }
    setLoading(false);
  };

  const DEMO = {
    primary_persona: { name: 'Busy Professional Alex', age: '28–42', income: '$65K–$120K', pain_points: ['No time to research', 'Overwhelmed by options', 'Wants proven shortcuts'] },
    secondary_persona: { name: 'Side-Hustle Sam', age: '22–35', income: '$30K–$60K', pain_points: ['Limited budget', 'Needs quick wins', 'Learning as they go'] },
    channels: ['YouTube tutorials', 'Reddit communities', 'LinkedIn newsletters', 'Twitter/X threads'],
    content_angles: ['How I made $X with zero experience', 'The tool I wish I had on day 1', 'Stop making this mistake', '5-minute daily habit that changed everything'],
    psychographics: { motivations: ['Financial freedom', 'Skill building', 'Status'], fears: ['Wasting money', 'Missing the trend', 'Looking foolish'], values: ['Efficiency', 'Authenticity', 'Results'] },
    market_size: '$2.4B TAM | $340M SAM',
  };

  const d = result || (niche ? null : DEMO);

  return (
    <div style={{padding:'32px', maxWidth:'900px'}}>
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontSize:'24px', fontWeight:800, color:'var(--text-primary)', margin:'0 0 6px'}}> Audience Intelligence</h1>
        <p style={{color:'var(--text-muted)', fontSize:'14px', margin:0}}>Deep persona profiles, psychographics, channels, and content angles for any niche.</p>
      </div>

      <div style={{display:'flex', gap:'10px', marginBottom:'28px'}}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key==='Enter' && run()}
          placeholder="e.g. AI productivity tools, keto supplements, Shopify micro-SaaS…"
          style={{flex:1, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'13px 16px', color:'var(--text-primary)', fontSize:'14px', outline:'none'}}/>
        <button onClick={run} disabled={loading || !niche.trim()}
          style={{background:'var(--accent)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px 24px', fontWeight:700, fontSize:'14px', cursor:loading?'not-allowed':'pointer'}}>
          {loading ? 'Analyzing…' : ' Analyze'}
        </button>
      </div>

      {error && <p style={{color:'#ef4444', fontSize:'13px', marginBottom:'16px'}}>{error}</p>}

      {d && (
        <div style={{display:'grid', gap:'16px'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
            {[d.primary_persona, d.secondary_persona].filter(Boolean).map((p: any, i) => (
              <div key={i} style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px'}}>
                <div style={{fontWeight:700, color:'var(--text-primary)', marginBottom:'4px', fontSize:'15px'}}>{i===0?' Primary':' Secondary'} Persona</div>
                <div style={{fontSize:'14px', color:'var(--accent)', fontWeight:700, marginBottom:'8px'}}>{p.name}</div>
                {p.age && <div style={{fontSize:'12px', color:'var(--text-muted)', marginBottom:'4px'}}>Age: {p.age}</div>}
                {p.income && <div style={{fontSize:'12px', color:'var(--text-muted)', marginBottom:'10px'}}>Income: {p.income}</div>}
                <div style={{fontSize:'12px', fontWeight:600, color:'var(--text-secondary)', marginBottom:'6px'}}>Pain Points</div>
                {(p.pain_points||[]).map((pt: string, j: number) => (
                  <div key={j} style={{fontSize:'12px', color:'var(--text-muted)', padding:'4px 0', borderBottom:'1px solid var(--border)'}}>• {pt}</div>
                ))}
              </div>
            ))}
          </div>

          {d.channels && (
            <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px'}}>
              <div style={{fontWeight:700, color:'var(--text-primary)', marginBottom:'12px'}}> Best Channels to Reach Them</div>
              <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                {d.channels.map((c: string, i: number) => (
                  <span key={i} style={{background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', color:'var(--text-secondary)'}}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {d.content_angles && (
            <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px'}}>
              <div style={{fontWeight:700, color:'var(--text-primary)', marginBottom:'12px'}}>️ Winning Content Angles</div>
              {d.content_angles.map((a: string, i: number) => (
                <div key={i} style={{padding:'10px 0', borderBottom: i<d.content_angles.length-1?'1px solid var(--border)':'none', fontSize:'13px', color:'var(--text-secondary)'}}>"{a}"</div>
              ))}
            </div>
          )}

          {d.psychographics && (
            <div style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px'}}>
              <div style={{fontWeight:700, color:'var(--text-primary)', marginBottom:'12px'}}> Psychographics</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px'}}>
                {Object.entries(d.psychographics).map(([k,v]: [string, any]) => (
                  <div key={k}>
                    <div style={{fontSize:'11px', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'8px'}}>{k}</div>
                    {(Array.isArray(v)?v:[v]).map((i: string, j: number) => (
                      <div key={j} style={{fontSize:'12px', color:'var(--text-secondary)', padding:'3px 0'}}>• {i}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.market_size && (
            <div style={{background:'linear-gradient(135deg,#7c3aed18,#10b98118)', border:'1px solid var(--accent)', borderRadius:'14px', padding:'20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700, color:'var(--text-primary)', marginBottom:'4px'}}> Market Size</div>
                <div style={{fontSize:'20px', fontWeight:800, color:'var(--accent)'}}>{d.market_size}</div>
              </div>
              <Link href={`/dashboard/keywords?seed=${encodeURIComponent(niche)}`}
                style={{background:'var(--accent)', color:'#fff', borderRadius:'10px', padding:'10px 20px', textDecoration:'none', fontSize:'13px', fontWeight:700}}>
                Find Keywords →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
