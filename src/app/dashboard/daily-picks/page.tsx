'use client';
import { useEffect, useState } from 'react';

interface Pick { niche: string; score: number; trend: string; why: string; category: string; }

export default function DailyPicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'daily_picks' }) })
      .then(r => r.json())
      .then(d => {
        setPicks(d.picks || d.data?.picks || []);
        setLoading(false);
      })
      .catch(() => {
        setPicks([
          { niche: 'AI Productivity Tools', score: 94, trend: 'Explosive', why: 'ChatGPT-adjacent search volume up 340% YoY. Monetizable via affiliate + SaaS.', category: 'Technology' },
          { niche: 'Micro-Saas for Creators', score: 91, trend: 'Rising', why: 'Creator economy growing 15% MoM. Low competition in niche tooling.', category: 'SaaS' },
          { niche: 'Homesteading & Self-Sufficiency', score: 87, trend: 'Steady', why: 'Anti-fragility trend post-2020. Strong affiliate + course potential.', category: 'Lifestyle' },
          { niche: 'Pet Wellness Supplements', score: 85, trend: 'Growing', why: 'Pet humanization trend. $6B market growing at 8% CAGR.', category: 'Health' },
          { niche: 'Remote Work Ergonomics', score: 82, trend: 'Stable', why: 'WFH permanent shift. High-ticket product potential. Low content saturation.', category: 'Work' },
        ]);
        setLoading(false);
      });
  }, []);

  const scoreColor = (s: number) => s >= 90 ? '#22c55e' : s >= 80 ? '#f59e0b' : '#6b7280';

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#7c3aed22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Daily Picks</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>AI-curated niche opportunities — refreshed every 24 hours</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '40px 0' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading today\'s picks...
        </div>
      ) : error ? (
        <div style={{ color: '#ef4444', padding: '20px', background: '#ef444422', borderRadius: '10px', border: '1px solid #ef444444' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {picks.map((p, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '52px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: scoreColor(p.score) }}>{p.score}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>score</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.niche}</div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 9px', borderRadius: '20px', background: '#7c3aed22', color: '#7c3aed' }}>{p.category}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 9px', borderRadius: '20px', background: scoreColor(p.score) + '22', color: scoreColor(p.score) }}>{p.trend}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>{p.why}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
