'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

type Section = { id: string; label: string; icon: string; status: 'pending' | 'loading' | 'done' | 'error' };

const SECTIONS: Section[] = [
  { id: 'validation',  label: 'Niche Validation',      icon: '✅', status: 'pending' },
  { id: 'audience',    label: 'Audience Intelligence',  icon: '👥', status: 'pending' },
  { id: 'keywords',    label: 'Keyword Clusters',       icon: '🔑', status: 'pending' },
  { id: 'competition', label: 'Competitor Analysis',    icon: '⚔️', status: 'pending' },
  { id: 'monetization',label: 'Monetization Strategy',  icon: '💰', status: 'pending' },
  { id: 'content',     label: 'Content Blueprint',      icon: '📝', status: 'pending' },
  { id: 'starter',     label: 'Starter Kit',            icon: '🚀', status: 'pending' },
];

export default function AutopilotPage() {
  const params = useSearchParams();
  const [niche, setNiche] = useState(params.get('niche') || '');
  const [running, setRunning] = useState(false);
  const [sections, setSections] = useState<Section[]>(SECTIONS);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [active, setActive] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const runRef = useRef(false);

  const setStatus = (id: string, status: Section['status']) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, status } : s));

  const run = async () => {
    if (!niche.trim() || runRef.current) return;
    runRef.current = true;
    setRunning(true); setSaved(false);
    setSections(SECTIONS.map(s => ({ ...s, status: 'pending' })));
    setResults({});

    const steps: { id: string; action: string; body?: Record<string, unknown> }[] = [
      { id: 'validation',   action: 'validate_niche' },
      { id: 'audience',     action: 'audience_intel' },
      { id: 'keywords',     action: 'keyword_clusters' },
      { id: 'competition',  action: 'competitor_analysis' },
      { id: 'monetization', action: 'generate_monetization' },
      { id: 'content',      action: 'content_blueprint' },
      { id: 'starter',      action: 'starter_kit' },
    ];

    const allResults: Record<string, unknown> = {};

    for (const step of steps) {
      setStatus(step.id, 'loading');
      setActive(step.id);
      try {
        const res = await fetch('/api/autopilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: step.action, niche: niche.trim(), seed: niche.trim(), ...step.body }),
        });
        const data = await res.json();
        allResults[step.id] = data.error ? { _error: true } : data;
        setStatus(step.id, data.error ? 'error' : 'done');
      } catch {
        allResults[step.id] = { _error: true };
        setStatus(step.id, 'error');
      }
      setResults({ ...allResults });
      await new Promise(r => setTimeout(r, 300));
    }

    setActive(null);
    setRunning(false);
    runRef.current = false;

    // Save report
    const { data: { session } } = await SB.auth.getSession();
    if (session) {
      await SB.from('validation_reports').insert({
        user_id: session.user.id,
        niche: niche.trim(),
        score: (allResults.validation as Record<string, number>)?.overall_score ?? 0,
        result: allResults,
      }).catch(() => {});
    }
  };

  useEffect(() => {
    if (params.get('niche')) { setNiche(params.get('niche')!); }
  }, [params]);

  const done = sections.filter(s => s.status === 'done').length;
  const total = sections.length;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Autopilot</h1>
          <span style={{ background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>FULL AI REPORT</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>One niche. Seven analyses. Complete market intelligence in one run.</p>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="Enter your niche — e.g. AI productivity tools, keto supplements, micro-SaaS for lawyers…"
          disabled={running}
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', opacity: running ? 0.7 : 1 }}/>
        <button onClick={run} disabled={running || !niche.trim()} style={{ background: running ? 'var(--bg-elevated)' : 'var(--accent)', color: running ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '10px', padding: '13px 26px', fontWeight: 700, fontSize: '14px', cursor: running ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
          {running ? `Running ${done}/${total}…` : '⚡ Run Autopilot'}
        </button>
      </div>

      {/* Progress bar */}
      {running && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 999, width: `${(done/total)*100}%`, transition: 'width 0.5s ease' }}/>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{done} of {total} analyses complete…</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Sidebar checklist */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', position: 'sticky', top: '20px' }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => results[s.id] && setActive(active === s.id ? null : s.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: active === s.id ? 'var(--accent)' : 'transparent', border: 'none', borderBottom: i < sections.length-1 ? '1px solid var(--border)' : 'none', cursor: results[s.id] ? 'pointer' : 'default', textAlign: 'left' }}>
              <span style={{ fontSize: '15px' }}>{s.status === 'loading' ? '⏳' : s.status === 'done' ? '✅' : s.status === 'error' ? '⚠️' : '○'}</span>
              <span style={{ fontSize: '13px', fontWeight: active === s.id ? 700 : 400, color: active === s.id ? '#fff' : s.status === 'done' ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.label}</span>
              {s.status === 'loading' && <div style={{ marginLeft: 'auto', width: 14, height: 14, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>}
            </button>
          ))}
        </div>

        {/* Result panel */}
        <div>
          {!running && done === 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Ready to run full analysis</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 20px' }}>Enter a niche and hit Run Autopilot. All 7 analyses run sequentially — takes about 30–60 seconds.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['AI productivity tools', 'Keto meal prep', 'Micro-SaaS for Shopify'].map(ex => (
                  <button key={ex} onClick={() => setNiche(ex)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>{ex}</button>
                ))}
              </div>
            </div>
          )}

          {active && results[active] && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                {sections.find(s => s.id === active)?.icon} {sections.find(s => s.id === active)?.label}
              </h3>
              <pre style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '16px', fontSize: '12px', color: 'var(--text-secondary)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '500px', overflowY: 'auto' }}>
                {JSON.stringify(results[active], null, 2)}
              </pre>
            </div>
          )}

          {!running && done === total && done > 0 && !active && (
            <div style={{ background: 'linear-gradient(135deg,#7c3aed18,#10b98118)', border: '1px solid var(--accent)', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>Full report ready for <span style={{ color: 'var(--accent)' }}>{niche}</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 20px' }}>Click any section on the left to explore. Report auto-saved to Projects.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Link href="/projects" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', padding: '10px 20px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>View in Reports →</Link>
                <Link href={`/autopilot/starter?niche=${encodeURIComponent(niche)}`} style={{ background: 'var(--accent)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 20px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>Build Starter Kit →</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
