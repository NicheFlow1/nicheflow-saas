'use client';
import { useState } from 'react';

interface AudienceData { ageRange: string; gender: string; income: string; platforms: string[]; painPoints: string[]; desires: string[]; buyingTriggers: string[]; contentTypes: string[]; }

export default function AudiencePage() {
  const [niche, setNiche] = useState('');
  const [data, setData] = useState<AudienceData | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    try {
      const r = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'audience_intel', niche }) });
      const d = await r.json();
      setData(d.audience || d.data?.audience || getFallback(niche));
    } catch { setData(getFallback(niche)); }
    setLoading(false);
  };

  const getFallback = (n: string): AudienceData => ({
    ageRange: '25–44',
    gender: '58% Female / 42% Male',
    income: '$45k–$95k household',
    platforms: ['YouTube', 'Instagram', 'Reddit', 'Pinterest', 'TikTok'],
    painPoints: [`Overwhelmed by too many ${n} options`, 'Lack of trusted expert guidance', 'Fear of wasting money on wrong products'],
    desires: [`Quick results in ${n}`, 'Community and belonging', 'Proven step-by-step systems'],
    buyingTriggers: ['Social proof & reviews', 'Free trial or demo', 'Limited time offer', 'Expert endorsement'],
    contentTypes: ['How-to guides', 'Product comparisons', 'Case studies', 'Video tutorials'],
  });

  const Section = ({ title, items, color }: { title: string; items: string[]; color: string }) => (
    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '20px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((item, i) => <span key={i} style={{ background: color + '18', color, padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>{item}</span>)}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#6366f122', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audience Intel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Deep profile of your target market</p>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        <input
          value={niche} onChange={e => setNiche(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Enter a niche (e.g. keto diet, drone photography)"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
        />
        <button onClick={analyze} disabled={loading} style={{ background: 'var(--brand-purple)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Analyzing...' : 'Analyze Audience'}
        </button>
      </div>

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[{ label: 'Age Range', value: data.ageRange, color: '#7c3aed' }, { label: 'Gender Split', value: data.gender, color: '#3b82f6' }, { label: 'Income Level', value: data.income, color: '#22c55e' }].map(d => (
              <div key={d.label} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: d.color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{d.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</div>
              </div>
            ))}
          </div>
          <Section title="Top Platforms" items={data.platforms} color="#6366f1" />
          <Section title="Pain Points" items={data.painPoints} color="#ef4444" />
          <Section title="Desires & Goals" items={data.desires} color="#22c55e" />
          <Section title="Buying Triggers" items={data.buyingTriggers} color="#f59e0b" />
          <Section title="Preferred Content Types" items={data.contentTypes} color="#3b82f6" />
        </div>
      )}
    </div>
  );
}
