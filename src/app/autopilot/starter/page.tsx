'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import { Package, AlertCircle, RefreshCw, Copy, Check, ArrowLeft } from 'lucide-react';

const SB_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';
const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg-hover)', border: '1px solid var(--border-base)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
      {copied ? <><Check size={11} color="#10b981" /> Copied</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}

function StarterContent() {
  const params = useSearchParams();
  const prefill = params?.get('keyword') || '';
  const [session, setSession] = useState<any>(null);
  const [keyword, setKeyword] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [kit, setKit] = useState<any>(null);
  const [error, setError] = useState('');
  const sb = createBrowserClient(SB_URL, SB_ANON);

  useEffect(() => { sb.auth.getSession().then(({ data }) => setSession(data.session)); }, []);
  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, [loading]);

  async function build() {
    if (!session || !keyword.trim()) return;
    setLoading(true); setError(''); setKit(null);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 100000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'generate_starter_kit', keyword: keyword.trim() }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `Error ${r.status}`); }
      const data = await r.json();
      setKit(data);
      if (data.id) window.location.href = `/autopilot/kit/${data.id}`;
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(e.message || 'Failed to build kit');
    } finally { setLoading(false); }
  }

  if (!session) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <a href="/autopilot" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none' }}><ArrowLeft size={16} /></a>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Starter Kit Builder</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Real Google Trends data + complete business plan in one click</p>
        </div>
      </div>

      {!loading && !kit && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Market or Keyword</label>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && build()}
            placeholder="e.g. AI productivity tools, sustainable pet products..."
            style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-base)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }}
          />
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, marginBottom: 14 }}>
              <AlertCircle size={14} color="#ef4444" />
              <span style={{ fontSize: 13, color: '#ef4444', flex: 1 }}>{error}</span>
              <button onClick={build} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}><RefreshCw size={11} /> Retry</button>
            </div>
          )}
          <button
            onClick={build}
            disabled={!keyword.trim()}
            style={{ width: '100%', background: keyword.trim() ? 'var(--brand-purple)' : 'var(--bg-hover)', color: keyword.trim() ? '#fff' : 'var(--text-muted)', border: 'none', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: keyword.trim() ? 'pointer' : 'not-allowed' }}
          >
            Build Complete Starter Kit
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '10px 0 0' }}>Real Google Trends · Product ideas · Landing page copy · Reddit communities · Revenue path</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '56px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 14 }}>
          <div style={{ width: 32, height: 32, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 18px' }} />
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15, margin: '0 0 6px' }}>Building your kit{dots}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Fetching real trend data + AI analysis. Takes 30-60 seconds.</p>
        </div>
      )}

      {kit && !kit.id && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{kit.one_liner || keyword}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Kit built — saving to your account...</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 13, padding: '4px 12px', background: kit.go_signal === 'GO' ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)', color: kit.go_signal === 'GO' ? '#10b981' : '#f59e0b', borderRadius: 20, fontWeight: 700 }}>{kit.go_signal}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Month 1 target: {kit.revenue_month1}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StarterPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <StarterContent />
    </Suspense>
  );
}
