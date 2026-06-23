'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Sparkles, AlertCircle, Copy, Check, Trash2 } from 'lucide-react';

const SB_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';
const PLATFORMS = ['Twitter', 'LinkedIn', 'Reddit', 'Instagram', 'TikTok', 'Email'];
const TYPES = ['thread', 'post', 'story', 'hook', 'email', 'ad'];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <button onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 11px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
      {copied ? <><Check size={11} color="#10b981" /> Copied</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}

export default function ContentPage() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState('Twitter');
  const [type, setType] = useState('hook');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [error, setError] = useState('');
  const [library, setLibrary] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const sbRef = useRef(getSupabaseClient());

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(({ data }: any) => {
      setSession(data.session);
      setReady(true);
      if (data.session) loadLibrary(data.session.access_token);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e: any, s: any) => {
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

  async function loadLibrary(token: string) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/content_library?select=*&order=created_at.desc&limit=20`, {
        headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` }
      });
      if (r.ok) setLibrary(await r.json());
    } catch {}
  }

  async function generate() {
    if (!session || !keyword.trim()) return;
    setLoading(true); setError('');
    try {
      // Route through our Next.js API (not directly to Supabase edge function)
      const r = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'generate_content', keyword: keyword.trim(), platform, type }),
      });
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `Error ${r.status}`); }
      const data = await r.json();
      const newItem = { id: data.id || Date.now().toString(), keyword: keyword.trim(), platform, type, content: data.content || data.result || JSON.stringify(data), created_at: new Date().toISOString() };
      setLibrary(prev => [newItem, ...prev]);
      showToast('Content generated!');
    } catch (e: any) {
      setError(e.message || 'Failed to generate content');
    } finally { setLoading(false); }
  }

  async function deleteItem(id: string) {
    if (!session) return;
    await fetch(`${SB_URL}/rest/v1/content_library?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SB_ANON, Authorization: `Bearer ${session.access_token}`, Prefer: 'return=minimal' }
    });
    setLibrary(prev => prev.filter(i => i.id !== id));
    showToast('Deleted');
  }

  if (!ready) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 28, height: 28, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!session) { if (typeof window !== 'undefined') window.location.href = '/auth/login'; return null; }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 18px', fontSize: 13, color: 'var(--text-primary)', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,.4)', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
          <Sparkles size={19} color="var(--accent)" />
          <h1 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Content Studio</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Generate viral content for any niche. Save to your library.</p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Keyword or Topic</label>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="e.g. longevity supplements, AI tools for founders..."
            style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 13px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' as const }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' as const }}>Platform</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: platform === p ? 'none' : '1px solid var(--border)', background: platform === p ? 'var(--accent)' : 'transparent', color: platform === p ? '#fff' : 'var(--text-muted)' }}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' as const }}>Type</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setType(t)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: type === t ? 'none' : '1px solid var(--border)', background: type === t ? 'rgba(124,58,237,.85)' : 'transparent', color: type === t ? '#fff' : 'var(--text-muted)' }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, marginBottom: 12 }}>
            <AlertCircle size={14} color="#ef4444" />
            <span style={{ fontSize: 13, color: '#ef4444' }}>{error}</span>
          </div>
        )}

        <button onClick={generate} disabled={loading || !keyword.trim()} style={{ width: '100%', background: loading || !keyword.trim() ? 'var(--bg-hover)' : 'var(--accent)', color: loading || !keyword.trim() ? 'var(--text-muted)' : '#fff', border: 'none', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading || !keyword.trim() ? 'not-allowed' : 'pointer' }}>
          {loading ? `Generating${dots}` : 'Generate'}
        </button>
      </div>

      {library.length > 0 ? (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Content Library</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {library.map(item => (
              <div key={item.id || item.created_at} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'rgba(124,58,237,.1)', padding: '2px 8px', borderRadius: 10 }}>{item.platform}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 10 }}>{item.type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.keyword}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <CopyBtn text={item.content} />
                    {item.id && (
                      <button onClick={() => deleteItem(item.id)} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px dashed var(--border)', borderRadius: 12 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>No content yet. Generate your first piece above.</p>
          </div>
        )
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
