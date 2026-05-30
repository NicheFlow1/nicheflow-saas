'use client';
import { useState } from 'react';

interface AudienceData {
  size: string;
  demographics: { age: string; gender: string; income: string };
  platforms: Array<{ name: string; type: string; members: string }>;
  pain_points: string[];
  buying_triggers: string[];
  best_channels: string[];
  influencer_types: string[];
  willingness_to_pay: string;
  keywords: string[];
}

export default function AudiencePage() {
  const [niche, setNiche] = useState('');
  const [data, setData] = useState<AudienceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!niche.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'audience_intel', niche })
      });
      const json = await res.json();
      if (json.audience) setData(json.audience);
      else setError('No data returned. Try a different niche.');
    } catch (e) {
      setError('Failed to fetch audience data.');
    } finally {
      setLoading(false);
    }
  }

  const sectionStyle = { background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', marginBottom: '16px' };
  const labelStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '12px' };
  const tagStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audience Intelligence</h1>
          <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: '#6366f122', color: '#6366f1', textTransform: 'uppercase' }}>NEW</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Deep audience research for any niche. Understand who they are, where they hang out, and how to reach them.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input
          value={niche}
          onChange={e => setNiche(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Enter a niche (e.g. sourdough baking, drone photography)"
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
        />
        <button
          onClick={analyze}
          disabled={loading || !niche.trim()}
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap' }}
        >
          {loading ? 'Analyzing...' : 'Analyze Audience'}
        </button>
      </div>

      {error && <div style={{ padding: '16px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      {data && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={sectionStyle}>
              <div style={labelStyle}>Audience Size</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)' }}>{data.size}</div>
            </div>
            <div style={sectionStyle}>
              <div style={labelStyle}>Demographics</div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                <div>Age: <strong>{data.demographics.age}</strong></div>
                <div>Gender: <strong>{data.demographics.gender}</strong></div>
                <div>Income: <strong>{data.demographics.income}</strong></div>
              </div>
            </div>
            <div style={sectionStyle}>
              <div style={labelStyle}>Willingness to Pay</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>{data.willingness_to_pay}</div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>Where They Hang Out</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.platforms.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{p.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '8px' }}>{p.type}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>{p.members}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div style={sectionStyle}>
              <div style={labelStyle}>Pain Points</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.pain_points.map((p, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', padding: '6px 10px', background: '#ef444411', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>{p}</div>
                ))}
              </div>
            </div>
            <div style={sectionStyle}>
              <div style={labelStyle}>Buying Triggers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.buying_triggers.map((t, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', padding: '6px 10px', background: '#22c55e11', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>{t}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>Best Channels to Reach Them</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.best_channels.map((c, i) => <span key={i} style={tagStyle}>{c}</span>)}
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>Influencer Types</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.influencer_types.map((t, i) => <span key={i} style={tagStyle}>{t}</span>)}
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>Keywords to Target</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.keywords.map((k, i) => <span key={i} style={{ ...tagStyle, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600 }}>{k}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}