'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U');

interface AudienceData { topic: string; size: string; demographics: { age: string; gender: string; income: string }; platforms: { name: string; type: string; members: string }[]; pain_points: string[]; buying_triggers: string[]; best_channels: string[]; influencer_types: string[]; willingness_to_pay: string; keywords: string[]; }

export default function AudiencePage() {
  const [niche, setNiche] = useState('');
  const [data, setData] = useState<AudienceData | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    const { data: { session } } = await SB.auth.getSession();
    try {
      const r = await fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` }, body: JSON.stringify({ action: 'audience_intel', topic: niche }) });
      const d = await r.json();
      setData(d.audience || null);
    } catch { setData(null); }
    setLoading(false);
  };

  const Tag = ({ label, color }: { label: string; color: string }) => (
    <span style={{ background: color + '18', color, padding: '5px 13px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>{label}</span>
  );

  const Section = ({ title, items, color, icon }: { title: string; items: string[]; color: string; icon: string }) => (
    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
        <div style={{ fontSize: '12px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((item, i) => <Tag key={i} label={item} color={color} />)}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audience Intel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0' }}>Deep AI profile of any target market — platforms, pain points, and buying triggers</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Enter a niche (e.g. keto diet, drone photography, AI tools)"
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
        <button onClick={analyze} disabled={loading || !niche.trim()} style={{ background: loading ? 'var(--bg-hover)' : 'var(--brand-purple)', color: loading ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
          {loading ? 'Analyzing...' : 'Analyze Audience'}
        </button>
      </div>

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Header stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Audience Size', value: data.size, color: '#7c3aed' },
              { label: 'Age Range', value: data.demographics.age, color: '#3b82f6' },
              { label: 'Gender', value: data.demographics.gender, color: '#6366f1' },
              { label: 'Willingness to Pay', value: data.willingness_to_pay, color: '#22c55e' },
            ].map(d => (
              <div key={d.label} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '16px 18px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: d.color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{d.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}</div>
              </div>
            ))}
          </div>
          {/* Platforms */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>Top Platforms</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {data.platforms.map((p, i) => (
                <div key={i} style={{ background: '#6366f118', border: '1px solid #6366f133', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.type} · {p.members}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Section title="Pain Points" items={data.pain_points} color="#ef4444" icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            <Section title="Buying Triggers" items={data.buying_triggers} color="#22c55e" icon="M13 10V3L4 14h7v7l9-11h-7z" />
            <Section title="Best Channels" items={data.best_channels} color="#3b82f6" icon="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            <Section title="Influencer Types" items={data.influencer_types} color="#f59e0b" icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </div>
          {data.keywords?.length > 0 && (
            <Section title="Target Keywords" items={data.keywords} color="#7c3aed" icon="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          )}
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '18px 20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Income Level</div>
            <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{data.demographics.income}</div>
          </div>
        </div>
      )}
    </div>
  );
}
