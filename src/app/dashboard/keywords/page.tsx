'use client';
import { useState } from 'react';

interface Cluster {
  name: string;
  intent: string;
  volume: string;
  difficulty: string;
  keywords: Array<{ term: string; volume: string; difficulty: number; cpc: string }>;
  content_angle: string;
}

export default function KeywordClustersPage() {
  const [seed, setSeed] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  async function generate() {
    if (!seed.trim()) return;
    setLoading(true); setError(''); setClusters([]);
    try {
      const res = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'keyword_clusters', seed }) });
      const data = await res.json();
      if (data.clusters && data.clusters.length > 0) {
        setClusters(data.clusters);
        setExpanded(data.clusters[0]?.name || null);
      } else {
        setError(data.error || 'No clusters generated. Try a different keyword.');
      }
    } catch { setError('Failed to generate clusters.'); }
    finally { setLoading(false); }
  }

  const diffColor = (d: number) => d < 30 ? '#22c55e' : d < 60 ? '#f59e0b' : '#ef4444';
  const intentColors: Record<string, string> = { informational: '#3b82f6', commercial: '#f59e0b', transactional: '#22c55e', navigational: '#8b5cf6' };

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Keyword Clusters</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Enter a seed keyword to get AI-grouped clusters with volume, difficulty, CPC, and content angles.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input value={seed} onChange={e => setSeed(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="e.g. home fitness, sourdough bread, AI tools"
          style={{ flex: 1, padding: '13px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }} />
        <button onClick={generate} disabled={loading || !seed.trim()}
          style={{ padding: '13px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap' as const }}>
          {loading ? 'Generating...' : 'Generate Clusters'}
        </button>
      </div>

      {error && <div style={{ padding: '14px 16px', background: '#ef444415', border: '1px solid #ef444433', borderRadius: '8px', color: '#ef4444', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

      {clusters.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clusters.map((cluster, i) => (
            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div onClick={() => setExpanded(expanded === cluster.name ? null : cluster.name)}
                style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: 0 }}>{cluster.name}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: (intentColors[cluster.intent] || '#6366f1') + '22', color: intentColors[cluster.intent] || '#6366f1', textTransform: 'capitalize' }}>{cluster.intent}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Vol: <strong style={{ color: 'var(--text-primary)' }}>{cluster.volume}</strong></span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Difficulty: <strong style={{ color: diffColor(parseInt(cluster.difficulty)) }}>{cluster.difficulty}</strong></span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ transform: expanded === cluster.name ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }}><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              {expanded === cluster.name && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
                  <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '8px', borderLeft: '3px solid #f59e0b', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Content angle: <strong style={{ color: 'var(--text-primary)' }}>{cluster.content_angle}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
                    {cluster.keywords.map((kw, j) => (
                      <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '8px', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>{kw.term}</span>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '11px', flexShrink: 0 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{kw.volume}</span>
                          <span style={{ color: diffColor(kw.difficulty), fontWeight: 600 }}>D:{kw.difficulty}</span>
                          <span style={{ color: '#22c55e', fontWeight: 600 }}>{kw.cpc}</span>
                        </div>
                      </div>
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