'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const DEMOS = [
  { niche: 'AI Journaling Apps', score: 91, growth: '+340%', volume: '14K/mo', competition: 'Low', tags: ['SaaS','AI','Wellness'], why: 'Search volume tripled in 90 days. No dominant player under $20/mo.' },
  { niche: 'Micro-SaaS for Etsy Sellers', score: 88, growth: '+270%', volume: '9K/mo', competition: 'Low', tags: ['SaaS','eCommerce'], why: 'Etsy has 7.5M sellers with almost no dedicated tooling ecosystem.' },
  { niche: 'Gut Health Supplements', score: 84, growth: '+195%', volume: '33K/mo', competition: 'Medium', tags: ['Health','CPG'], why: 'Microbiome research going mainstream. Repeat-purchase category.' },
  { niche: 'Pickleball Training Gear', score: 79, growth: '+220%', volume: '28K/mo', competition: 'Medium', tags: ['Sports','Physical'], why: 'Fastest growing sport in the US — accessory market still wide open.' },
  { niche: 'Pet Tech Wearables', score: 76, growth: '+160%', volume: '11K/mo', competition: 'Medium', tags: ['Pet','Hardware'], why: 'Premium pet spending at all-time high. GPS + health tracking converging.' },
];

export default function DailyPicksPage() {
  const [picks, setPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/autopilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
          body: JSON.stringify({ action: 'daily_picks' }),
        });
        const data = await res.json();
        const list = data.picks || data.niches || data.results || [];
        setPicks(list.length > 0 ? list : DEMOS);
      } catch { setPicks(DEMOS); }
      setLoading(false);
    })();
  }, []);

  const saveToWatchlist = async (item: any) => {
    const key = item.niche || item.name;
    setSavingId(key);
    try {
      const { data: { session } } = await SB.auth.getSession();
      if (session) {
        await SB.from('watchlist').insert({
          user_id: session.user.id,
          niche: key,
          score: item.score ?? 0,
          metadata: item,
        }).catch(() => {});
      }
      setSaved(prev => new Set(prev).add(key));
    } catch {}
    setSavingId(null);
  };

  const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';
  const compColor  = (c: string) => c === 'Low' ? '#10b981' : c === 'High' ? '#ef4444' : '#f59e0b';

  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  return (
    <div style={{padding:'32px', maxWidth:'1000px'}}>
      <div style={{marginBottom:'28px', display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'24px', fontWeight:800, color:'var(--text-primary)', margin:'0 0 4px'}}> Daily Picks</h1>
          <p style={{color:'var(--text-muted)', fontSize:'13px', margin:0}}>{today} · AI-curated high-opportunity niches</p>
        </div>
        <Link href="/trending" style={{fontSize:'13px', color:'var(--accent)', textDecoration:'none', fontWeight:600}}>See all trending →</Link>
      </div>

      {loading ? (
        <div style={{display:'grid', gap:'12px'}}>
          {[1,2,3].map(i => <div key={i} style={{height:140, background:'var(--bg-card)', borderRadius:'14px', opacity:0.5, animation:'pulse 1.5s ease-in-out infinite'}}/>)}
        </div>
      ) : (
        <div style={{display:'grid', gap:'14px'}}>
          {picks.map((item: any, i) => {
            const name = item.niche || item.name || item.topic || `Pick ${i+1}`;
            const isSaved = saved.has(name);
            const isSaving = savingId === name;
            return (
              <div key={i} style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px', display:'flex', gap:'16px', alignItems:'flex-start'}}>
                {/* Rank */}
                <div style={{width:40, height:40, borderRadius:'50%', background: i===0?'var(--accent)':'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px', color: i===0?'#fff':'var(--text-muted)', flexShrink:0}}>
                  {i+1}
                </div>

                {/* Main */}
                <div style={{flex:1}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px', flexWrap:'wrap'}}>
                    <span style={{fontWeight:800, fontSize:'16px', color:'var(--text-primary)'}}>{name}</span>
                    {(item.tags||[]).map((t: string) => (
                      <span key={t} style={{background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'6px', padding:'2px 8px', fontSize:'11px', color:'var(--text-muted)'}}>{t}</span>
                    ))}
                  </div>
                  <p style={{color:'var(--text-muted)', fontSize:'13px', margin:'0 0 10px'}}>{item.why || item.reason || item.summary || ''}</p>
                  <div style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
                    {item.growth && <span style={{fontSize:'12px', color:'#10b981', fontWeight:700}}> {item.growth}</span>}
                    {item.volume && <span style={{fontSize:'12px', color:'var(--text-muted)'}}> {item.volume}</span>}
                    {item.competition && <span style={{fontSize:'12px', color:compColor(item.competition), fontWeight:600}}>️ {item.competition} competition</span>}
                  </div>
                </div>

                {/* Score */}
                <div style={{textAlign:'center', flexShrink:0, minWidth:50}}>
                  <div style={{fontSize:'26px', fontWeight:900, color:scoreColor(item.score||0)}}>{item.score||'—'}</div>
                  <div style={{fontSize:'10px', color:'var(--text-muted)', fontWeight:600}}>SCORE</div>
                </div>

                {/* Actions */}
                <div style={{display:'flex', flexDirection:'column', gap:'8px', flexShrink:0}}>
                  <button onClick={() => saveToWatchlist(item)} disabled={isSaved||isSaving}
                    style={{background: isSaved?'#10b98120':'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 14px', fontSize:'12px', color: isSaved?'#10b981':'var(--text-muted)', cursor: isSaved?'default':'pointer', fontWeight:600, whiteSpace:'nowrap'}}>
                    {isSaving ? '…' : isSaved ? ' Saved' : '+ Watchlist'}
                  </button>
                  <Link href={`/validate?niche=${encodeURIComponent(name)}`}
                    style={{background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 14px', fontSize:'12px', color:'var(--text-secondary)', textDecoration:'none', fontWeight:600, textAlign:'center'}}>
                    Validate →
                  </Link>
                  <Link href={`/autopilot?niche=${encodeURIComponent(name)}`}
                    style={{background:'var(--accent)', borderRadius:'8px', padding:'7px 14px', fontSize:'12px', color:'#fff', textDecoration:'none', fontWeight:700, textAlign:'center'}}>
                    Autopilot →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
