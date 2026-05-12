'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Zap, Package, Plus, AlertCircle, RefreshCw } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

export default function AutopilotPage() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [briefing, setBriefing] = useState<any>(null);
  const [error, setError] = useState('');
  const [kits, setKits] = useState<any[]>([]);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (data.session) loadKits(data.session.access_token);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) { setDots(''); return; }
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, [loading]);

  async function loadKits(token: string) {
    try {
      const { SUPABASE_URL, SUPABASE_ANON } = await import('@/lib/supabase/client-singleton');
      const r = await fetch(`${SUPABASE_URL}/rest/v1/starter_kits?select=id,keyword,created_at&order=created_at.desc&limit=6`, {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` }
      });
      if (r.ok) setKits(await r.json());
    } catch {}
  }

  async function getBriefing() {
    if (!session) return;
    setLoading(true); setError(''); setBriefing(null);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 100000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'generate_briefing' }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `Error ${r.status}`); }
      setBriefing(await r.json());
    } catch (e: any) {
      if (e.name === 'AbortError') setError('Request timed out — please try again.');
      else setError(e.message || 'Failed to load briefing');
    } finally { setLoading(false); }
  }

  if (!ready) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 28, height: 28, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
    return null;
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Zap size={20} color="var(--brand-purple)" />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Autopilot</h1>
          <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(139,92,246,.15)', color: 'var(--brand-purple)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(139,92,246,.3)' }}>BETA</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>AI scans markets with real Google Trends data. Get GO signals and complete starter kits.</p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, marginBottom: 20 }}>
          <AlertCircle size={15} color="#ef4444" />
          <span style={{ fontSize: 13, color: '#ef4444', flex: 1 }}>{error}</span>
          <button onClick={getBriefing} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,.12)', border: 'none', color: '#ef4444', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <RefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      {!briefing && !loading && (
        <div style={{ textAlign: 'center', padding: '56px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 16, marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(139,92,246,.12)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <Zap size={26} color="var(--brand-purple)" />
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Get Your Daily Intelligence Briefing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 22, maxWidth: 380, margin: '0 auto 22px' }}>ARIA scans real markets using Google Trends and returns GO signals with actionable intelligence. Takes 30-60 seconds.</p>
          <button onClick={getBriefing} style={{ background: 'var(--brand-purple)', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Get Today&apos;s Briefing
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '56px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 16, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 18px' }} />
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15, margin: '0 0 6px' }}>Scanning markets{dots}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Real Google Trends + AI analysis · 30-60 seconds</p>
        </div>
      )}

      {briefing && (
        <div>
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))', border: '1px solid rgba(139,92,246,.22)', borderRadius: 16, padding: 22, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,.1)', padding: '2px 9px', borderRadius: 20 }}>TOP SIGNAL</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{briefing.date}</span>
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{briefing.top_signal?.niche}</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>Score: {briefing.top_signal?.score}/100</span>
              <span style={{ fontSize: 12, padding: '2px 10px', background: briefing.top_signal?.signal === 'GO' ? 'rgba(16,185,129,.15)' : 'rgba(245,158,11,.15)', color: briefing.top_signal?.signal === 'GO' ? '#10b981' : '#f59e0b', borderRadius: 20, fontWeight: 700 }}>{briefing.top_signal?.signal}</span>
            </div>
            {briefing.top_signal?.why_now && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>{briefing.top_signal.why_now}</p>}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
              <a href="/autopilot/starter" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--brand-purple)', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                <Package size={13} /> Build Starter Kit
              </a>
              <button onClick={getBriefing} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid var(--border-base)', color: 'var(--text-muted)', padding: '9px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 10, marginBottom: 28 }}>
            {briefing.opportunities?.map((opp: any, i: number) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: opp.signal === 'GO' ? '#10b981' : '#f59e0b', background: opp.signal === 'GO' ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.1)', padding: '2px 7px', borderRadius: 10 }}>{opp.signal}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{opp.score}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{opp.niche}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {kits.length > 0 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Your Starter Kits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 9 }}>
            {kits.map(k => (
              <a key={k.id} href={`/autopilot/kit/${k.id}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 10, padding: 13, textDecoration: 'none' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{k.keyword}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{new Date(k.created_at).toLocaleDateString()}</p>
              </a>
            ))}
            <a href="/autopilot/starter" style={{ background: 'transparent', border: '1px dashed var(--border-base)', borderRadius: 10, padding: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
              <Plus size={13} /> New Kit
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
