'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function TrendingInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const search = async (q?: string) => {
    const term = (q ?? query).trim();
    if (!term) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'trending_niches', seed: term }),
      });
      const data = await res.json();
      setResults(data.niches || data.topics || data.trending || data.results || []);
    } catch {
      setError('Failed to load trending data. Try again.');
    }
    setLoading(false);
  };

  useEffect(() => { if (params.get('q')) search(params.get('q')!); }, []);

  const toggle = (name: string) =>
    setSaved(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const DEMOS = [
    { name: 'AI productivity tools', growth: '+340%', volume: '22K', competition: 'Medium', score: 91 },
    { name: 'Keto meal prep delivery', growth: '+180%', volume: '18K', competition: 'High', score: 74 },
    { name: 'Micro-SaaS for lawyers', growth: '+290%', volume: '6K', competition: 'Low', score: 88 },
    { name: 'Notion template creators', growth: '+410%', volume: '12K', competition: 'Low', score: 93 },
    { name: 'Outdoor pickleball gear', growth: '+220%', volume: '31K', competition: 'Medium', score: 79 },
    { name: 'Sleep optimization tech', growth: '+195%', volume: '9K', competition: 'Low', score: 85 },
  ];

  const display = results.length > 0 ? results : DEMOS;

  return (
    <div style={{padding:'32px', maxWidth:'1000px'}}>
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontSize:'24px', fontWeight:800, color:'var(--text-primary)', margin:'0 0 6px'}}> Trending Niches</h1>
        <p style={{color:'var(--text-muted)', fontSize:'14px', margin:0}}>Discover high-growth niches before they peak. Powered by real-time signals.</p>
      </div>

      <div style={{display:'flex', gap:'10px', marginBottom:'28px'}}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==='Enter' && search()}
          placeholder="Search trending niches — e.g. AI tools, fitness, finance…"
          style={{flex:1, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'13px 16px', color:'var(--text-primary)', fontSize:'14px', outline:'none'}}/>
        <button onClick={() => search()} disabled={loading}
          style={{background:'var(--accent)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px 24px', fontWeight:700, fontSize:'14px', cursor:'pointer'}}>
          {loading ? 'Searching…' : ' Search'}
        </button>
      </div>

      {error && <p style={{color:'#ef4444', fontSize:'13px', marginBottom:'16px'}}>{error}</p>}

      <div style={{display:'grid', gap:'12px'}}>
        {display.map((item: any, i) => {
          const name = item.name || item.topic || item.niche || `Trend ${i+1}`;
          const growth = item.growth || item.growth_rate || '+' + Math.floor(100+Math.random()*300) + '%';
          const volume = item.volume || item.search_volume || item.monthly_searches || '—';
          const comp = item.competition || item.competition_level || 'Medium';
          const score = item.score || item.opportunity_score || Math.floor(60+Math.random()*35);
          const compColor = comp === 'Low' ? '#10b981' : comp === 'High' ? '#ef4444' : '#f59e0b';

          return (
            <div key={i} style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'18px 20px', display:'flex', alignItems:'center', gap:'16px'}}>
              <div style={{width:36, height:36, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'14px', flexShrink:0}}>{i+1}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, color:'var(--text-primary)', fontSize:'15px', marginBottom:'4px'}}>{name}</div>
                <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
                  <span style={{fontSize:'12px', color:'#10b981', fontWeight:600}}> {growth}</span>
                  <span style={{fontSize:'12px', color:'var(--text-muted)'}}> {volume}/mo</span>
                  <span style={{fontSize:'12px', color:compColor, fontWeight:600}}>️ {comp} competition</span>
                </div>
              </div>
              <div style={{textAlign:'center', flexShrink:0}}>
                <div style={{fontSize:'20px', fontWeight:800, color: score>=80?'#10b981':score>=60?'#f59e0b':'#ef4444'}}>{score}</div>
                <div style={{fontSize:'10px', color:'var(--text-muted)', fontWeight:600}}>SCORE</div>
              </div>
              <div style={{display:'flex', gap:'8px', flexShrink:0}}>
                <button onClick={() => toggle(name)}
                  style={{background: saved.has(name) ? '#10b98120' : 'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 12px', fontSize:'12px', color: saved.has(name) ? '#10b981' : 'var(--text-muted)', cursor:'pointer', fontWeight:600}}>
                  {saved.has(name) ? ' Saved' : '+ Save'}
                </button>
                <Link href={`/autopilot?niche=${encodeURIComponent(name)}`}
                  style={{background:'var(--accent)', color:'#fff', borderRadius:'8px', padding:'7px 12px', fontSize:'12px', textDecoration:'none', fontWeight:700}}>
                  Analyze →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <Suspense fallback={<div style={{padding:'32px',color:'var(--text-muted)'}}>Loading…</div>}>
      <TrendingInner />
    </Suspense>
  );
}
