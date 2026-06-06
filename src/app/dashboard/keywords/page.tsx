'use client';
import { useState } from 'react';

type Keyword = { keyword: string; volume: number; difficulty: number; cpc: number; intent: string };
type Cluster = { cluster: string; keywords: Keyword[] };

const FALLBACK: Cluster[] = [
  {
    cluster: 'AI Side Hustle',
    keywords: [
      { keyword: 'ai side hustle ideas', volume: 22000, difficulty: 32, cpc: 1.80, intent: 'informational' },
      { keyword: 'make money with ai tools', volume: 18000, difficulty: 28, cpc: 2.10, intent: 'commercial' },
      { keyword: 'ai freelancing guide', volume: 9500, difficulty: 24, cpc: 1.50, intent: 'informational' },
      { keyword: 'chatgpt income ideas', volume: 14000, difficulty: 30, cpc: 1.90, intent: 'commercial' },
    ],
  },
  {
    cluster: 'Digital Product Business',
    keywords: [
      { keyword: 'sell digital products online', volume: 27000, difficulty: 45, cpc: 2.60, intent: 'commercial' },
      { keyword: 'digital product ideas 2025', volume: 19000, difficulty: 38, cpc: 2.20, intent: 'informational' },
      { keyword: 'etsy digital downloads', volume: 31000, difficulty: 41, cpc: 1.70, intent: 'transactional' },
      { keyword: 'passive income digital products', volume: 15000, difficulty: 36, cpc: 2.80, intent: 'commercial' },
    ],
  },
  {
    cluster: 'Micro SaaS',
    keywords: [
      { keyword: 'micro saas ideas', volume: 12000, difficulty: 29, cpc: 3.40, intent: 'informational' },
      { keyword: 'build micro saas product', volume: 8200, difficulty: 33, cpc: 3.10, intent: 'informational' },
      { keyword: 'solo founder saas', volume: 6500, difficulty: 25, cpc: 2.90, intent: 'informational' },
      { keyword: 'saas startup no code', volume: 9800, difficulty: 31, cpc: 3.60, intent: 'commercial' },
    ],
  },
];

const INTENT_COLOR: Record<string, string> = {
  informational: '#3b82f6',
  commercial: '#f59e0b',
  transactional: '#10b981',
  navigational: '#8b5cf6',
};

function DiffBar({ value }: { value: number }) {
  const color = value < 30 ? '#10b981' : value < 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 999 }}/>
      </div>
      <span style={{ fontSize: '12px', color, fontWeight: 600, width: 24, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function KeywordsPage() {
  const [query, setQuery] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const [hasSearched, setHasSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'keyword_clusters', seed: query.trim(), niche: query.trim() }),
      });
      const data = await res.json();
      const list: Cluster[] = Array.isArray(data.clusters) && data.clusters.length ? data.clusters
        : Array.isArray(data) && data.length ? data : [];
      setClusters(list.length ? list : FALLBACK);
      if (!list.length) setError('Live data unavailable — showing sample clusters.');
      setOpen(new Set([0]));
    } catch {
      setClusters(FALLBACK);
      setError('Using sample data — check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i: number) => {
    setOpen(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const allKw = (clusters.length ? clusters : FALLBACK).flatMap(c => c.keywords);
  const avgVol = allKw.length ? Math.round(allKw.reduce((a, k) => a + k.volume, 0) / allKw.length) : 0;
  const avgDiff = allKw.length ? Math.round(allKw.reduce((a, k) => a + k.difficulty, 0) / allKw.length) : 0;

  const display = clusters.length ? clusters : (hasSearched ? FALLBACK : FALLBACK);

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Keyword Clusters</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Enter a niche to generate grouped keyword clusters with volume, difficulty, CPC and intent.</p>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. AI productivity tools, keto supplements, micro SaaS…"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
        />
        <button onClick={search} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, flexShrink: 0 }}>
          {loading ? 'Analyzing…' : 'Analyze →'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--warning)', fontSize: '12px', marginBottom: '16px' }}>⚠ {error}</p>}

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Clusters', value: display.length },
          { label: 'Total Keywords', value: allKw.length || display.flatMap(c => c.keywords).length },
          { label: 'Avg Volume', value: (avgVol || Math.round(display.flatMap(c => c.keywords).reduce((a,k)=>a+k.volume,0) / Math.max(display.flatMap(c=>c.keywords).length,1))).toLocaleString() },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Clusters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {display.map((cluster, i) => (
          <div key={cluster.cluster} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
            {/* Cluster header */}
            <button onClick={() => toggle(i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i+1}</div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{cluster.cluster}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cluster.keywords.length} keywords</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open.has(i) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }}><path d="M19 9l-7 7-7-7"/></svg>
            </button>

            {/* Keyword table */}
            {open.has(i) && (
              <div style={{ padding: '0 20px 16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Keyword', 'Volume', 'Difficulty', 'CPC', 'Intent'].map(h => (
                        <th key={h} style={{ textAlign: h === 'Keyword' ? 'left' : 'center', padding: '8px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cluster.keywords.map(k => (
                      <tr key={k.keyword} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{k.keyword}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{k.volume.toLocaleString()}</td>
                        <td style={{ padding: '10px 8px', minWidth: '120px' }}><DiffBar value={k.difficulty}/></td>
                        <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>${k.cpc.toFixed(2)}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <span style={{ background: INTENT_COLOR[k.intent] + '22', color: INTENT_COLOR[k.intent], border: `1px solid ${INTENT_COLOR[k.intent]}44`, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{k.intent}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
