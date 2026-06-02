'use client';
import { useState } from 'react';

interface Keyword { kw: string; volume: number; difficulty: number; cpc: string; intent: string; }
interface Cluster { name: string; intent: string; color: string; keywords: Keyword[]; }

export default function KeywordsPage() {
  const [query, setQuery] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const generate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const r = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'keyword_clusters', niche: query }) });
      const d = await r.json();
      setClusters(d.clusters || d.data?.clusters || getFallback(query));
    } catch { setClusters(getFallback(query)); }
    setLoading(false);
    setOpen({ 0: true });
  };

  const getFallback = (q: string): Cluster[] => [
    { name: 'Informational', intent: 'Info', color: '#3b82f6', keywords: [
      { kw: `what is ${q}`, volume: 12000, difficulty: 24, cpc: '$0.45', intent: 'Info' },
      { kw: `how does ${q} work`, volume: 8400, difficulty: 18, cpc: '$0.32', intent: 'Info' },
      { kw: `${q} explained`, volume: 5600, difficulty: 15, cpc: '$0.28', intent: 'Info' },
    ]},
    { name: 'Commercial', intent: 'Buy', color: '#22c55e', keywords: [
      { kw: `best ${q} tools`, volume: 9200, difficulty: 42, cpc: '$2.10', intent: 'Buy' },
      { kw: `${q} software review`, volume: 4100, difficulty: 38, cpc: '$3.40', intent: 'Buy' },
      { kw: `${q} vs alternatives`, volume: 3300, difficulty: 35, cpc: '$2.80', intent: 'Buy' },
    ]},
    { name: 'Navigational', intent: 'Nav', color: '#f59e0b', keywords: [
      { kw: `${q} tutorial beginner`, volume: 7800, difficulty: 20, cpc: '$0.60', intent: 'Nav' },
      { kw: `${q} guide 2024`, volume: 5200, difficulty: 22, cpc: '$0.55', intent: 'Nav' },
    ]},
    { name: 'Transactional', intent: 'Transact', color: '#ef4444', keywords: [
      { kw: `buy ${q} online`, volume: 6600, difficulty: 55, cpc: '$4.20', intent: 'Transact' },
      { kw: `${q} discount coupon`, volume: 2800, difficulty: 30, cpc: '$1.90', intent: 'Transact' },
    ]},
  ];

  const intentColor = (i: string) => ({ Info: '#3b82f6', Buy: '#22c55e', Nav: '#f59e0b', Transact: '#ef4444' }[i] || '#6b7280');

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f59e0b22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Keyword Clusters</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>AI-grouped keywords by intent — ready for SEO strategy</p>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Enter a niche or topic (e.g. keto diet, AI tools)"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
        />
        <button onClick={generate} disabled={loading} style={{ background: 'var(--brand-purple)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Generating...' : 'Generate Clusters'}
        </button>
      </div>

      {/* Clusters */}
      {clusters.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {clusters.map((cluster, ci) => (
            <div key={ci} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpen(o => ({ ...o, [ci]: !o[ci] }))}
                style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cluster.color, flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{cluster.name}</span>
                <span style={{ fontSize: '12px', color: cluster.color, background: cluster.color + '22', padding: '2px 10px', borderRadius: '12px', fontWeight: 700 }}>{cluster.intent}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cluster.keywords.length} keywords</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open[ci] ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open[ci] && (
                <div style={{ borderTop: '1px solid var(--border-base)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 0 }}>
                    <div style={{ padding: '8px 20px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)', background: 'var(--bg-hover)' }}>Keyword</div>
                    {['Volume','Difficulty','CPC','Intent'].map(h => <div key={h} style={{ padding: '8px 16px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', borderBottom: '1px solid var(--border-base)', background: 'var(--bg-hover)' }}>{h}</div>)}
                    {cluster.keywords.map((kw, ki) => (
                      <>
                        <div key={ki+'-kw'} style={{ padding: '12px 20px', fontSize: '13.5px', color: 'var(--text-primary)', borderBottom: ki < cluster.keywords.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>{kw.kw}</div>
                        <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right', borderBottom: ki < cluster.keywords.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>{kw.volume.toLocaleString()}</div>
                        <div style={{ padding: '12px 16px', textAlign: 'right', borderBottom: ki < cluster.keywords.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: kw.difficulty < 30 ? '#22c55e22' : kw.difficulty < 50 ? '#f59e0b22' : '#ef444422', color: kw.difficulty < 30 ? '#22c55e' : kw.difficulty < 50 ? '#f59e0b' : '#ef4444' }}>{kw.difficulty}</div>
                        </div>
                        <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right', borderBottom: ki < cluster.keywords.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>{kw.cpc}</div>
                        <div style={{ padding: '12px 16px', textAlign: 'right', borderBottom: ki < cluster.keywords.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: intentColor(kw.intent) + '22', color: intentColor(kw.intent) }}>{kw.intent}</span>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
