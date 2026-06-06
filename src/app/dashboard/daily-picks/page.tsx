'use client';
import { useEffect, useState } from 'react';

type Pick = {
  niche: string;
  score: number;
  trend: string;
  competition: string;
  revenue_potential: string;
  tags: string[];
  why: string;
  keywords: string[];
};

const FALLBACK: Pick[] = [
  { niche: 'AI-Powered Pet Health Monitors', score: 91, trend: 'rising', competition: 'low', revenue_potential: '$2k–$8k/mo', tags: ['pets','AI','hardware'], why: 'Pet owners increasingly seek data-driven health insights. Wearable tech for pets is emerging fast with almost no established players.', keywords: ['pet health tracker','dog vital monitor','smart pet collar'] },
  { niche: 'Longevity & Anti-Aging Supplements', score: 88, trend: 'rising', competition: 'medium', revenue_potential: '$5k–$20k/mo', tags: ['health','biotech','supplements'], why: 'Biohacking audience is growing rapidly. Premium longevity supplements command high margins with subscription potential.', keywords: ['NMN supplement','longevity stack','anti-aging protocol'] },
  { niche: 'Remote Work Ergonomics Consulting', score: 84, trend: 'stable', competition: 'low', revenue_potential: '$3k–$12k/mo', tags: ['remote','consulting','B2B'], why: 'Companies are spending on remote work setup stipends. Ergonomics consultants who serve HR depts can close $500–$2k contracts.', keywords: ['remote ergonomics consultant','home office setup','WFH injury prevention'] },
  { niche: 'Micro-SaaS for Shopify Sellers', score: 87, trend: 'rising', competition: 'medium', revenue_potential: '$4k–$15k/mo', tags: ['SaaS','ecommerce','dev'], why: 'Shopify has 4M+ stores. Micro-tools solving a single pain point (inventory, reviews, upsells) sell well at $9–$49/mo.', keywords: ['shopify app','inventory management app','shopify automation tool'] },
  { niche: 'Solopreneur Productivity Courses', score: 82, trend: 'stable', competition: 'medium', revenue_potential: '$2k–$10k/mo', tags: ['education','creator','productivity'], why: 'The creator economy is fueling demand for practical systems for solo operators. Course + community combos are the proven model.', keywords: ['solopreneur systems','one person business course','productivity for freelancers'] },
];

const TREND_COLOR: Record<string, string> = { rising: '#10b981', stable: '#f59e0b', declining: '#ef4444' };
const COMP_COLOR: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

export default function DailyPicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/autopilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'daily_picks' }),
        });
        const data = await res.json();
        const list: Pick[] = Array.isArray(data.picks) && data.picks.length
          ? data.picks
          : Array.isArray(data) && data.length ? data : [];
        setPicks(list.length ? list : FALLBACK);
      } catch {
        setPicks(FALLBACK);
        setError('Using cached picks — live data unavailable.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSave = (niche: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(niche) ? next.delete(niche) : next.add(niche);
      return next;
    });
  };

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Daily Picks</h1>
          <span style={{ background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', letterSpacing: '0.5px' }}>AI CURATED</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — Top niche opportunities scored by NicheFlow AI.
        </p>
        {error && <p style={{ color: 'var(--warning)', fontSize: '12px', marginTop: '6px' }}>⚠ {error}</p>}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>AI is analyzing today&apos;s opportunities…</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {picks.map((p, i) => (
            <div key={p.niche} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{p.niche}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Score */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: p.score >= 85 ? '#10b981' : p.score >= 70 ? '#f59e0b' : '#ef4444' }}>{p.score}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>SCORE</div>
                  </div>
                  {/* Save */}
                  <button onClick={() => toggleSave(p.niche)} style={{ background: saved.has(p.niche) ? 'var(--accent)' : 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: saved.has(p.niche) ? '#fff' : 'var(--text-muted)', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    {saved.has(p.niche) ? '✓ Saved' : '+ Save'}
                  </button>
                </div>
              </div>

              {/* Meta badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: TREND_COLOR[p.trend] + '22', color: TREND_COLOR[p.trend], border: `1px solid ${TREND_COLOR[p.trend]}44`, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                  {p.trend === 'rising' ? '↑' : p.trend === 'declining' ? '↓' : '→'} {p.trend}
                </span>
                <span style={{ background: COMP_COLOR[p.competition] + '22', color: COMP_COLOR[p.competition], border: `1px solid ${COMP_COLOR[p.competition]}44`, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                  {p.competition} competition
                </span>
                <span style={{ background: '#3b82f622', color: '#60a5fa', border: '1px solid #3b82f644', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                  💰 {p.revenue_potential}
                </span>
                {p.tags?.map(t => (
                  <span key={t} style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '3px 10px', fontSize: '11px' }}>#{t}</span>
                ))}
              </div>

              {/* Why */}
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>{p.why}</p>

              {/* Keywords */}
              {p.keywords?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>Keywords:</span>
                  {p.keywords.map(k => (
                    <span key={k} style={{ background: 'var(--bg-elevated)', color: 'var(--accent)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 500 }}>{k}</span>
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
