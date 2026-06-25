'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const QUICK_PROMPTS = [
  'Best niches for a solo founder in 2026?',
  'Compare the niches in my watchlist',
  'Which of my validations has the best opportunity?',
  'What micro-SaaS can I build in 30 days?',
  'How do I validate demand before building?',
  'Top content formats for niche audiences?',
];

export default function ARIAChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await SB.auth.getSession();
      if (!session) return;
      const uid = session.user.id;
      const [watchlist, picks, validations] = await Promise.all([
        SB.from('watchlist').select('niche_name, score, signal').eq('user_id', uid).limit(10),
        SB.from('daily_picks_saved').select('niche_name, score, competition, revenue_estimate').eq('user_id', uid).limit(5),
        SB.from('validation_reports').select('niche, score, result').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
      ]);
      setUserData({
        watchlist: watchlist.data || [],
        picks: picks.data || [],
        validations: validations.data || [],
      });
    } catch {}
  };

  const buildSystemPrompt = () => {
    if (!userData) return 'You are ARIA, NicheFlow\'s market intelligence AI. You help founders find, validate, and act on niche business opportunities. Be specific, data-driven, and actionable. The year is 2026.';

    const { watchlist, picks, validations } = userData;
    const nl = '\n';
    const watchlistLines = watchlist.length > 0
      ? watchlist.map((w: any) => `- ${w.niche_name} (Score: ${w.score}, Signal: ${w.signal})`).join(nl)
      : '- Empty watchlist';
    const pickLines = picks.length > 0
      ? picks.map((p: any) => `- ${p.niche_name} (${p.score}/100, ${p.competition} competition)`).join(nl)
      : '- No saved picks yet';
    const validationLines = validations.length > 0
      ? validations.map((v: any) => `- ${v.niche}: ${v.result?.signal || 'N/A'} (${v.score}/100)`).join(nl)
      : '- No validations yet';

    return [
      "You are ARIA, NicheFlow's market intelligence AI. You have access to this user's NicheFlow data. Use it to give specific, personalised answers. The year is 2026.",
      '',
      "USER'S NICHEFLOW DATA:",
      '',
      `Watchlist (${watchlist.length} niches):`,
      watchlistLines,
      '',
      'Recent Daily Picks saved:',
      pickLines,
      '',
      'Recent Validations:',
      validationLines,
      '',
      'Reference their actual data when answering about opportunities. Be specific, never generic.',
    ].join(nl);
  };

  const send = async (msg?: string) => {
    const text = (msg ?? input).trim();
    if (!text || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/aria-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systemPrompt: buildSystemPrompt() }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', maxWidth: '860px', padding: '0 32px 0' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✦</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>ARIA Chat</h1>
          {userData?.watchlist?.length > 0 && (
            <span style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.2)' }}>
              Your data loaded
            </span>
          )}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Your personal market intelligence analyst — with access to your watchlist, validations, and picks.</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
        {messages.length === 0 && (
          <div style={{ paddingTop: '24px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>Quick prompts</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '20px', display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0, marginTop: '2px' }}>✦</div>
            )}
            <div style={{
              maxWidth: '78%', padding: '12px 16px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border)',
              fontSize: '14px', color: m.role === 'user' ? '#fff' : 'var(--text-primary)', lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>✦</div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '14px 18px', display: 'flex', gap: '5px', alignItems: 'center' }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, paddingBottom: '28px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask ARIA anything about niches, markets, strategy…"
            style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '13px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px 20px', fontWeight: 700, fontSize: '14px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.5 : 1 }}>
            Send
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '8px 0 0', textAlign: 'center' }}>ARIA has access to your watchlist, validations, and picks to give personalised answers.</p>
      </div>

      <style>{`@keyframes pulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
    </div>
  );
}
