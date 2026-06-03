'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U');

interface KW { term: string; volume: string; difficulty: number; cpc: string; }
interface Cluster { name: string; intent: string; volume: string; difficulty: string; content_angle: string; keywords: KW[]; }

export default function KeywordsPage() {
  const [query, setQuery] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setClusters([]);
    const { data: { session } } = await SB.auth.getSession();
    try {
      const r = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` }, body: JSON.stringify({ action: 'keyword_clusters', seed: query }) });
      const d = await r.json();
      setClusters(d.clusters || []);
      setOpen({ 0: true });
    } catch { setClusters([]); }
    setLoading(false);
  };

  const copyAll = (cluster: Cluster) => {
    const text = cluster.keywords.map(k => k.term).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(cluster.name);
    setTimeout(() => setCopied(null), 2000);
  };

  const intentColor = (i: string) => ({ informational: '#3b82f6', commercial: '#22c55e', transactional: '#ef4444', navigational: '#f59e0b' }[i.toLowerCase()] || '#6b7280');
  const diffColor = (d: number) => d < 30 ? '#22c55e' : d < 50 ? '#f59e0b' : '#ef4444';

  const totalKws = clusters.reduce((a, c) => a + c.keywords.length, 0);
  const avgDiff = clusters.length ? Math.round(clusters.reduce((a, c) => a + c.keywords.reduce((x, k) => x + k.difficulty, 0) / (c.keywords.length || 1), 0) / clusters.length) : 0;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Keyword Clusters</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0' }}>AI-grouped keywords by intent — ready for your SEO content strategy</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: clusters.length ? '20px' : '32px' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Enter a niche or seed keyword (e.g. keto diet, AI agents, home gym)"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
        <button onClick={generate} disabled={loading || !query.trim()} style={{ background: loading ? 'var(--bg-hover)' : 'var(--brand-purple)', color: loading ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
          {loading ? 'Generating...' : 'Generate Clusters'}
        </button>
      </div>

      {/* Summary row */}
      {clusters.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {[{ label: 'Clusters', value: String(clusters.length), color: '#7c3aed' }, { label: 'Total Keywords', value: String(totalKws), color: '#3b82f6' }, { label: 'Avg Difficulty', value: String(avgDiff), color: diffColor(avgDiff) }].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '12px 18px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {clusters.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clusters.map((cluster, ci) => (
            <div key={ci} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', overflow: 'hidden' }}>
              <button onClick={() => setOpen(o => ({ ...o, [ci]: !o[ci] }))} style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: intentColor(cluster.intent), flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{cluster.name}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: intentColor(cluster.intent), background: intentColor(cluster.intent) + '22', padding: '2px 10px', borderRadius: '12px' }}>{cluster.intent}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cluster.volume}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cluster.keywords.length} kws</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open[ci] ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {open[ci] && (
                <div style={{ borderTop: '1px solid var(--border-base)' }}>
                  {/* Content angle */}
                  <div style={{ padding: '10px 20px 14px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Content angle: </span>{cluster.content_angle}</div>
                    <button onClick={() => copyAll(cluster)} style={{ background: 'none', border: '1px solid var(--border-base)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {copied === cluster.name ? 'Copied!' : 'Copy all'}
                    </button>
                  </div>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 70px', borderBottom: '1px solid var(--border-base)', background: 'var(--bg-hover)' }}>
                    {['Keyword','Volume','Difficulty','CPC'].map(h => <div key={h} style={{ padding: '8px 16px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: h === 'Keyword' ? 'left' : 'right' }}>{h}</div>)}
                  </div>
                  {cluster.keywords.map((kw, ki) => (
                    <div key={ki} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 70px', borderBottom: ki < cluster.keywords.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ padding: '11px 16px', fontSize: '13.5px', color: 'var(--text-primary)' }}>{kw.term}</div>
                      <div style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>{kw.volume}</div>
                      <div style={{ padding: '11px 16px', textAlign: 'right' }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: diffColor(kw.difficulty) + '22', color: diffColor(kw.difficulty) }}>{kw.difficulty}</span>
                      </div>
                      <div style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>{kw.cpc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
