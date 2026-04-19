'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client-singleton';
import { Zap, Sparkles, ArrowRight, ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const AUTOPILOT_FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';
const VALIDATE_FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/validate-keyword';

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: c ? 'var(--success)' : 'var(--text-disabled)', padding: '2px 6px', borderRadius: 4, fontSize: 10, display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
      {c ? <CheckCircle size={11} /> : <Copy size={11} />} {c ? 'Copied' : 'Copy'}
    </button>
  );
}

function KitDisplay({ kit, report }: { kit: any; report: any }) {
  const products: any[] = kit.product_ideas || [];
  const actions: any[] = kit.week1_actions || [];
  const communities: any[] = kit.reddit_communities || [];
  const hooks: any[] = kit.content_hooks || [];
  const bullets: string[] = kit.bullet_points || [];
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))', border: '1px solid rgba(99,102,241,.25)', borderRadius: 'var(--radius-2xl)', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', marginBottom: 6 }}>Starter Kit - {kit.keyword}</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>{kit.one_liner}</h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>{kit.problem_statement}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: '10px 12px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: 3 }}>Target Customer</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{kit.target_customer}</div>
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: 3 }}>Unique Angle</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{kit.unique_angle}</div>
              </div>
            </div>
          </div>
          {report && (
            <div style={{ textAlign: 'center', background: 'var(--bg-overlay)', borderRadius: 14, padding: '12px 16px', flexShrink: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: report.signal === 'GO' ? 'var(--success)' : 'var(--warning)' }}>{report.overall_score || 0}</div>
              <div style={{ fontSize: 8, color: 'var(--text-disabled)', textTransform: 'uppercase' }}>score</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: report.signal === 'GO' ? 'var(--success)' : 'var(--warning)', marginTop: 2 }}>{report.signal}</div>
            </div>
          )}
        </div>
      </div>

      {products.length > 0 && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={11} /> Product Ideas</div>
          {products.map((p: any, i: number) => (
            <div key={i} style={{ padding: 14, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-lg)', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-disabled)', marginTop: 2 }}>{p.type} - {p.time_to_launch}</div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--success)' }}>{p.price}</div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 6 }}>{p.description}</p>
              <div style={{ fontSize: 10, color: 'var(--brand-purple)', background: 'rgba(99,102,241,.05)', padding: '5px 8px', borderRadius: 4 }}>Stack: {p.how_to_build}</div>
            </div>
          ))}
        </div>
      )}

      {actions.length > 0 && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', marginBottom: 14 }}>Your First 7 Days</div>
          {actions.map((a: any, i: number) => (
            <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-lg)', marginBottom: 8, borderLeft: '3px solid var(--brand-purple)' }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', marginBottom: 3 }}>{a.day}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{a.action}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{a.why}</div>
              {a.expected_result && <div style={{ fontSize: 10, color: 'var(--success)', marginTop: 4 }}>Result: {a.expected_result}</div>}
            </div>
          ))}
        </div>
      )}

      {kit.headline && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 20, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>Landing Page Copy</div>
            <CopyBtn text={[kit.headline, kit.subheadline, ...bullets, kit.cta_text].join('\n')} />
          </div>
          <div style={{ background: 'linear-gradient(135deg,#0a0a14,#111128)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 'var(--radius-xl)', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', marginBottom: 8 }}>{kit.headline}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginBottom: 14 }}>{kit.subheadline}</div>
            {bullets.map((b: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, textAlign: 'left' }}>
                <CheckCircle size={12} style={{ color: '#6366f1', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{b}</span>
              </div>
            ))}
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, marginTop: 12 }}>{kit.cta_text}</div>
          </div>
        </div>
      )}

      {communities.length > 0 && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', marginBottom: 14 }}>Reddit Communities</div>
          {communities.map((c: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6314', flex: 1 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', maxWidth: 260 }}>{c.why}</div>
            </div>
          ))}
        </div>
      )}

      {hooks.length > 0 && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', marginBottom: 14 }}>Content Hooks</div>
          {hooks.map((h: any, i: number) => (
            <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-overlay)', borderLeft: '3px solid var(--brand-purple)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>"{h.hook}"</div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'rgba(99,102,241,.08)', color: 'var(--brand-purple)', textTransform: 'uppercase' }}>{h.platform}</span>
                </div>
                <CopyBtn text={h.hook} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,.06),rgba(34,197,94,.02))', border: '1px solid rgba(34,197,94,.2)', borderRadius: 'var(--radius-2xl)', padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', marginBottom: 12 }}>Revenue Path</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 9, color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: 2 }}>Price</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{kit.price_point}</div>
          </div>
          <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 9, color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: 2 }}>30-Day Est.</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>{kit.revenue_30d_estimate}</div>
          </div>
        </div>
        <div style={{ padding: '10px 12px', background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.15)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: 3 }}>First Revenue Action</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{kit.first_revenue_action}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link href="/autopilot" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}><ArrowLeft size={13} /> Back</Link>
        <Link href={'/validate?keyword=' + encodeURIComponent(kit.keyword)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}><ArrowRight size={13} /> Deep Validate</Link>
      </div>
    </div>
  );
}

function StarterContent() {
  const params = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [keyword, setKeyword] = useState('');
  const [report, setReport] = useState<any>(null);
  const [kit, setKit] = useState<any>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'validating' | 'building' | 'done'>('input');

  useEffect(() => {
    const k = params?.get('keyword');
    if (k) setKeyword(k);
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
  }, []);

  async function build(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim() || !session) return;
    const { data: { session: fr } } = await supabase.auth.getSession();
    const tok = fr?.access_token || session.access_token;
    setError(''); setStep('validating');
    try {
      const vr = await fetch(VALIDATE_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok }, body: JSON.stringify({ keyword: keyword.trim() }) });
      const vd = await vr.json();
      if (vr.ok) setReport(vd.report);
      setStep('building');
      const kr = await fetch(AUTOPILOT_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok }, body: JSON.stringify({ action: 'generate_starter_kit', keyword: keyword.trim(), report_id: vd.report?.id }) });
      const kd = await kr.json();
      if (!kr.ok) throw new Error(kd.error || 'Failed to build kit');
      setKit(kd.starter_kit); setStep('done');
    } catch (er: any) { setError(er.message || 'Failed'); setStep('input'); }
  }

  if (step === 'validating' || step === 'building') return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Zap size={24} style={{ color: 'white' }} />
      </div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8 }}>
        {step === 'validating' ? 'Fetching real trend data...' : 'Building your starter kit...'}
      </h2>
      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 24 }}>
        {step === 'validating' ? 'Checking Google Trends for ' + keyword : 'Generating product ideas, landing page, Reddit communities...'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
        {['Trend data', 'Opportunity score', 'Product ideas', 'Landing page', 'Revenue path'].map((s, i) => (
          <span key={i} style={{ padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: 'rgba(99,102,241,.08)', color: 'var(--brand-purple)', border: '1px solid rgba(99,102,241,.15)', opacity: step === 'building' ? 1 : i < 2 ? 1 : 0.3 }}>{s}</span>
        ))}
      </div>
    </div>
  );

  if (step === 'done' && kit) return <KitDisplay kit={kit} report={report} />;

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div className="page-header">
        <h1>Starter Kit Builder</h1>
        <p>Validate a market and get a complete business starter kit in one click</p>
      </div>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 28 }}>
        <form onSubmit={build}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Market or Keyword</label>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. AI fitness coach, longevity supplements, ADHD productivity tools" className="input" style={{ marginBottom: 16, fontSize: 14 }} />
          {error && <div style={{ padding: '10px 12px', background: 'var(--surface-nogo)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--danger)', marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={!keyword.trim() || !session} className="btn btn-grad" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 14 }}>
            <Zap size={14} /> Build Complete Starter Kit
          </button>
        </form>
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)', fontSize: 11, color: 'var(--text-tertiary)' }}>
          Real Google Trends - Product ideas - Landing page copy - Reddit communities - Revenue path
        </div>
      </div>
    </div>
  );
}

export default function StarterPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}><div className="spinner" style={{ width: 20, height: 20, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)' }} /></div>}>
      <StarterContent />
    </Suspense>
  );
}
