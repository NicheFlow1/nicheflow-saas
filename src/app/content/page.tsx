'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client-singleton';
import { Copy, CheckCircle, Trash2, Heart, Zap, Twitter, Linkedin, Hash, PenLine } from 'lucide-react';

const AUTOPILOT_FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';
const PLATFORMS = ['All', 'Twitter', 'LinkedIn', 'Reddit', 'Instagram', 'Email', 'TikTok'];

export default function ContentPage() {
  const [session, setSession] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState('Twitter');
  const [contentType, setContentType] = useState('thread');
  const [filter, setFilter] = useState('All');
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) return;
      setSession(s);
      const { data } = await supabase.from('content_library').select('*').eq('user_id', s.user.id).order('created_at', { ascending: false }).limit(50);
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  async function generate() {
    if (!keyword.trim() || !session) return;
    setGenerating(true);
    setError('');
    try {
      const { data: { session: fr } } = await supabase.auth.getSession();
      const tok = fr?.access_token || session.access_token;
      const res = await fetch(AUTOPILOT_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok },
        body: JSON.stringify({
          action: 'generate_content',
          keyword: keyword.trim(),
          platform,
          content_type: contentType,
          tone: 'authentic and direct',
          context: 'founder building in this niche'
        })
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = 'Generation failed';
        try { msg = JSON.parse(text).error || msg; } catch {}
        throw new Error(msg);
      }
      const d = await res.json();
      if (!d.ok && d.error) throw new Error(d.error);
      const { data } = await supabase.from('content_library').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(50);
      setItems(data || []);
    } catch (e: any) {
      setError(e.message === 'Failed to fetch' ? 'Connection error - please check your internet and try again' : e.message || 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  }

  async function toggleFavorite(id: string, current: boolean) {
    await supabase.from('content_library').update({ is_favorite: !current }).eq('id', id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_favorite: !current } : i));
  }

  async function deleteItem(id: string) {
    await supabase.from('content_library').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const platformIcon = (p: string) => {
    if (p === 'Twitter') return <Twitter size={11} />;
    if (p === 'LinkedIn') return <Linkedin size={11} />;
    if (p === 'Reddit') return <Hash size={11} />;
    return <PenLine size={11} />;
  };

  const filtered = items.filter(i => filter === 'All' || i.platform === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Content Studio</h1>
        <p>Generate and save viral content for any niche — threads, posts, hooks, emails, and more</p>
      </div>

      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px auto', gap: 12, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Keyword or Topic</label>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="e.g. AI productivity tools, longevity supplements" className="input" style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className="input" style={{ fontSize: 12 }}>
              {['Twitter', 'LinkedIn', 'Reddit', 'Instagram', 'TikTok', 'Email'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Type</label>
            <select value={contentType} onChange={e => setContentType(e.target.value)} className="input" style={{ fontSize: 12 }}>
              {['thread', 'post', 'hook', 'story', 'email', 'ad'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={generate} disabled={!keyword.trim() || generating || !session} className="btn btn-grad" style={{ height: 42, gap: 6, alignSelf: 'flex-end' }}>
            {generating
              ? <><div className="spinner" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white' }} />Generating...</>
              : <><Zap size={13} />Generate</>}
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--surface-nogo)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, fontSize: 12, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {error}
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>x</button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{ padding: '5px 13px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: filter === p ? 'var(--brand-purple)' : 'var(--bg-elevated)', color: filter === p ? 'white' : 'var(--text-tertiary)', border: '1px solid ' + (filter === p ? 'var(--brand-purple)' : 'var(--border-base)'), cursor: 'pointer' }}>
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="spinner" style={{ width: 22, height: 22, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', margin: '0 auto' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)' }}>
          <PenLine size={32} style={{ color: 'var(--text-disabled)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8 }}>No content yet</h3>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Enter a keyword above and click Generate to create your first piece of viral content.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(99,102,241,.1)', color: 'var(--brand-purple)', border: '1px solid rgba(99,102,241,.2)', textTransform: 'uppercase' }}>
                    {platformIcon(item.platform)}{item.platform || 'General'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{item.type}</span>
                  {item.keyword && <span style={{ fontSize: 10, color: 'var(--text-disabled)', background: 'var(--bg-overlay)', padding: '1px 7px', borderRadius: 4 }}>{item.keyword}</span>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => toggleFavorite(item.id, item.is_favorite)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.is_favorite ? '#f59e0b' : 'var(--text-disabled)', padding: 6, borderRadius: 6 }}>
                    <Heart size={14} fill={item.is_favorite ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => copyText(item.id, item.content)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === item.id ? 'var(--success)' : 'var(--text-disabled)', padding: 6, borderRadius: 6 }}>
                    {copied === item.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: 6, borderRadius: 6 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.75, whiteSpace: 'pre-wrap', background: 'var(--bg-overlay)', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                {item.content}
              </div>
              {item.metadata?.hook && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--brand-purple)', background: 'rgba(99,102,241,.06)', padding: '6px 10px', borderRadius: 6, borderLeft: '2px solid var(--brand-purple)' }}>
                  Hook: {item.metadata.hook}
                </div>
              )}
              {item.metadata?.best_time && (
                <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-disabled)' }}>
                  Best time to post: {item.metadata.best_time}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
