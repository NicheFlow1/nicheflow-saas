'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const MODES = [
  { id: 'ideas',      label: 'Business Ideas',   icon: 'M12 2a7 7 0 017 7c0 2.65-1.47 4.96-3.63 6.18L15 17H9l-.37-1.82A7 7 0 0112 2zm3 15v1a3 3 0 01-6 0v-1h6z', desc: 'Generate 10 business ideas from a niche or skill',         action: 'generate_ideas' },
  { id: 'names',      label: 'Brand Names',       icon: 'M12 3l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 12l-3.75 2.7 1.5-4.5L6 7.5h4.5z', desc: 'Creative brand/product names with domain availability',   action: 'generate_names' },
  { id: 'monetize',   label: 'Monetization Plan', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', desc: 'Detailed revenue model for any niche',                    action: 'generate_monetization' },
  { id: 'positioning',label: 'Positioning',       icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', desc: 'Unique angle & positioning strategy vs competitors',      action: 'generate_positioning' },
];

type IdeaResult = { title: string; model: string; effort: string; revenue: string; why: string };
type NameResult = { name: string; domain: string; available: boolean; tagline: string };
type MonetizeResult = { stream: string; type: string; monthly_potential: string; steps: string[] };
type PositionResult = { angle: string; tagline: string; differentiator: string; target: string; competitors: string[] };

type Result = {
  mode: string;
  niche: string;
  ideas?: IdeaResult[];
  names?: NameResult[];
  monetization?: MonetizeResult[];
  positioning?: PositionResult;
  raw?: unknown;
};

const FALLBACKS: Record<string, Partial<Result>> = {
  ideas: {
    ideas: [
      { title: 'AI Newsletter Monetization Course', model: 'Digital course $197', effort: 'Medium', revenue: '$3k–$12k/mo', why: 'Huge gap between newsletter growth advice and actual monetization tactics.' },
      { title: 'Done-For-You SEO for Local Service Biz', model: 'Retainer $800/mo', effort: 'Medium', revenue: '$4k–$16k/mo', why: 'Local businesses need SEO but can\'t afford agencies. $800/mo is the sweet spot.' },
      { title: 'Notion Templates Marketplace', model: 'Digital products $15–$97', effort: 'Low', revenue: '$1k–$8k/mo', why: 'Passive income with one-time build. Gumroad + Twitter = proven distribution.' },
      { title: 'AI Prompt Pack Subscriptions', model: 'SaaS $9–$29/mo', effort: 'Low', revenue: '$2k–$10k/mo', why: 'Recurring revenue from curated, role-specific prompt libraries updated monthly.' },
      { title: 'Solopreneur Accountability Coaching', model: 'Group coaching $199/mo', effort: 'Low', revenue: '$2k–$8k/mo', why: 'High demand for accountability. Group model scales well with minimal overhead.' },
      { title: 'LinkedIn Content Agency for B2B SaaS', model: 'Agency retainer $2k–$5k/mo', effort: 'High', revenue: '$10k–$30k/mo', why: 'B2B founders know LinkedIn matters but have no time. High LTV clients.' },
      { title: 'Micro-SaaS Chrome Extension for Recruiters', model: 'SaaS $19/mo', effort: 'Medium', revenue: '$3k–$15k/mo', why: 'Recruiters use 5+ tools daily. One extension that saves 1hr/day = easy sell.' },
      { title: 'Niche Affiliate Review Site', model: 'Affiliate commissions', effort: 'Medium', revenue: '$1k–$5k/mo', why: 'Programmatic SEO + affiliate = passive income within 6 months if niche is right.' },
      { title: 'Online Community for Remote Freelancers', model: 'Membership $29/mo', effort: 'Medium', revenue: '$2k–$10k/mo', why: 'Freelancers crave community + job leads. Circle/Slack platforms make this trivial.' },
      { title: 'AI-Powered Resume Optimizer Tool', model: 'Freemium SaaS $12/mo', effort: 'High', revenue: '$5k–$20k/mo', why: 'Job market anxiety = huge demand. ATS optimization is a solved technical problem.' },
    ],
  },
  names: {
    names: [
      { name: 'NicheFlow', domain: 'nicheflow.com', available: false, tagline: 'Find your market before the crowd does' },
      { name: 'Vaultly', domain: 'vaultly.io', available: true, tagline: 'Lock in your niche' },
      { name: 'Tendril', domain: 'tendril.co', available: true, tagline: 'Grow in the right direction' },
      { name: 'Narrowly', domain: 'narrowly.com', available: true, tagline: 'Go deep, not wide' },
      { name: 'Signalr', domain: 'signalr.io', available: true, tagline: 'Catch trends before they break' },
      { name: 'Pocketmarket', domain: 'pocketmarket.co', available: true, tagline: 'Your micro-niche, fully mapped' },
    ],
  },
  monetize: {
    monetization: [
      { stream: 'Digital Course', type: 'One-time', monthly_potential: '$3k–$15k', steps: ['Identify top 3 pain points via audience survey', 'Build 4-week curriculum around your methodology', 'Launch to email list at $197–$497', 'Automate with evergreen webinar funnel'] },
      { stream: 'Monthly Newsletter', type: 'Recurring', monthly_potential: '$500–$5k', steps: ['Grow to 2k+ subscribers first', 'Offer paid tier at $9/mo for premium deep-dives', 'Add sponsor slots at $200–$500 CPM', 'Cross-promote to affiliate offers'] },
      { stream: 'Consulting Retainer', type: 'Recurring', monthly_potential: '$4k–$20k', steps: ['Start with 3 done-for-you clients at $800/mo', 'Document your process into an SOP', 'Raise prices as case studies build up', 'Transition to productized service at $1,500/mo'] },
      { stream: 'Affiliate Marketing', type: 'Passive', monthly_potential: '$500–$4k', steps: ['Identify 5 tools your audience uses daily', 'Write honest comparison content targeting buyer keywords', 'Build email sequence promoting top tools', 'Negotiate higher commission tiers at 100+ referrals/mo'] },
    ],
  },
  positioning: {
    positioning: {
      angle: 'The anti-agency for solopreneurs',
      tagline: 'Enterprise-grade niche intelligence, indie-founder price.',
      differentiator: 'Unlike Semrush (built for agencies) or Exploding Topics (built for VCs), NicheFlow is the only tool built exclusively for solopreneurs who need to find and validate a niche before spending $10k building the wrong thing.',
      target: 'Solo founders, indie hackers, and first-time online business builders who are pre-revenue or sub-$5k/mo.',
      competitors: ['Exploding Topics', 'Treendly', 'SparkToro', 'Semrush Topic Research'],
    },
  },
};

export default function GeneratorPage() {
  const [mode, setMode] = useState('ideas');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const currentMode = MODES.find(m => m.id === mode)!;

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const { data: { session: sess } } = await SB.auth.getSession();
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sess?.access_token || ''}` },
        body: JSON.stringify({ action: currentMode.action, niche: input.trim(), prompt: input.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ mode, niche: input.trim(), ...data, ...(!data.ideas && !data.names && !data.monetization && !data.positioning ? FALLBACKS[mode] : {}) });
    } catch {
      setResult({ mode, niche: input.trim(), ...FALLBACKS[mode] });
      setError('Using sample output — live generation unavailable.');
    } finally { setLoading(false); }
  };

  const saveToProjects = async () => {
    if (!result) return;
    const { data: { session } } = await SB.auth.getSession();
    if (session) {
      await SB.from('projects').insert({ user_id: session.user.id, name: `Generator: ${result.niche}`, type: mode, result }).catch(() => {});
    }
    setSaved(true);
  };

  const r = result;

  return (
    <div style={{ padding: '32px', maxWidth: '940px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Idea Generator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Generate business ideas, brand names, monetization plans and positioning strategies with AI.</p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: mode === m.id ? 'var(--accent)' : 'var(--bg-card)', border: `1px solid ${mode === m.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', padding: '9px 16px', color: mode === m.id ? '#fff' : 'var(--text-secondary)', fontSize: '13px', fontWeight: mode === m.id ? 700 : 400, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={m.icon}/></svg>{m.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px' }}>{currentMode.desc}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder={mode === 'ideas' ? 'e.g. AI tools, fitness for busy dads, pet care…' : mode === 'names' ? 'e.g. productivity app for remote teams' : mode === 'monetize' ? 'e.g. cooking blog, AI newsletter, Shopify niche store' : 'e.g. project management tool for freelancers'}
            style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '11px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}/>
          <button onClick={generate} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 22px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, flexShrink: 0 }}>
            {loading ? 'Generating…' : `Generate ${currentMode.label}`}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--warning)', fontSize: '12px', marginBottom: '14px' }}>{error}</p>}

      {loading && (
        <div style={{ textAlign: 'center', padding: '70px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}/>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>AI is generating your {currentMode.label.toLowerCase()}…</p>
        </div>
      )}

      {r && !loading && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {/* Save bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Results for: <span style={{ color: 'var(--accent)' }}>{r.niche}</span></h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={saveToProjects} style={{ background: saved ? '#10b981' : 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: saved ? '#fff' : 'var(--text-primary)', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {saved ? '✓ Saved' : 'Save to Projects'}
              </button>
              <Link href={`/validate?niche=${encodeURIComponent(r.niche)}`} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff', padding: '7px 14px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                Validate this →
              </Link>
            </div>
          </div>

          {/* IDEAS */}
          {r.ideas && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {r.ideas.map((idea, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{idea.title}</h3>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                        <span style={{ background: '#10b98122', color: '#10b981', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{idea.revenue}</span>
                        <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>{idea.model}</span>
                        <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>{idea.effort}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{idea.why}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NAMES */}
          {r.names && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
              {r.names.map((n, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: `1px solid ${n.available ? '#10b98144' : 'var(--border)'}`, borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{n.name}</span>
                    <span style={{ background: n.available ? '#10b98122' : '#ef444422', color: n.available ? '#10b981' : '#ef4444', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{n.available ? '✓ Available' : '✗ Taken'}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{n.domain}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>"{n.tagline}"</p>
                </div>
              ))}
            </div>
          )}

          {/* MONETIZATION */}
          {r.monetization && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {r.monetization.map((m, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{m.stream}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '3px 10px', fontSize: '12px' }}>{m.type}</span>
                      <span style={{ background: '#10b98122', color: '#10b981', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 700 }}>{m.monthly_potential}/mo</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {m.steps.map((s, j) => (
                      <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{j+1}</div>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingTop: '2px' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* POSITIONING */}
          {r.positioning && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg,#7c3aed18,#4f46e518)', border: '1px solid var(--accent)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unique Angle</div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>{r.positioning.angle}</h2>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>"{r.positioning.tagline}"</p>
              </div>
              {[
                { label: 'Target Customer', value: r.positioning.target },
                { label: 'Key Differentiator', value: r.positioning.differentiator },
              ].map(b => (
                <div key={b.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>{b.label}</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{b.value}</p>
                </div>
              ))}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>Competitors to Beat</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {r.positioning.competitors.map(c => (
                    <span key={c} style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', fontSize: '13px' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
