'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client-singleton';
import { Send, Bot, User, Plus, Zap, Sparkles } from 'lucide-react';

const AUTOPILOT_FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

const SUGGESTIONS = [
  'How do I validate a niche in 24 hours?',
  'What are the best SaaS opportunities in 2025?',
  'How do I find my first 10 customers?',
  'Analyze the AI tools market for me',
  'What pricing strategy works for micro-SaaS?',
  'How do I build in public effectively?',
  'What are underserved markets right now?',
  'How do I go from idea to $1k MRR fast?',
];

export default function AIChatPage() {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<{role:string,content:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) return;
      setSession(s);
      const { data } = await supabase.from('ai_chat_sessions').insert({ user_id: s.user.id, title: 'New Chat', messages: [] }).select().single();
      if (data) setSessionId(data.id);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text?: string) {
    const msg = text || input.trim();
    if (!msg || !session || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const { data: { session: fr } } = await supabase.auth.getSession();
      const res = await fetch(AUTOPILOT_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (fr?.access_token || session.access_token) },
        body: JSON.stringify({ action: 'chat', message: msg, session_id: sessionId, context: 'NicheFlow market intelligence platform - user is a founder researching niches and business opportunities' })
      });
      const d = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: d.response || 'I could not process that. Please try again.' }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-.02em' }}>ARIA AI Assistant</h1>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Market intelligence, niche research, growth strategy</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {messages.length === 0 ? (
          <div>
            <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 32px rgba(99,102,241,.3)' }}>
                <Sparkles size={24} style={{ color: 'white' }} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 8 }}>Ask ARIA anything</h2>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 400, margin: '0 auto' }}>Your AI market intelligence expert. Ask about niches, validation, growth strategy, pricing, content — anything.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', lineHeight: 1.4 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.role === 'user' ? 'var(--bg-overlay)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {m.role === 'user' ? <User size={14} style={{ color: 'var(--text-tertiary)' }} /> : <Bot size={14} style={{ color: 'white' }} />}
                </div>
                <div style={{ maxWidth: '80%', padding: '12px 16px', background: m.role === 'user' ? 'rgba(99,102,241,.1)' : 'var(--bg-elevated)', border: '1px solid ' + (m.role === 'user' ? 'rgba(99,102,241,.2)' : 'var(--border-base)'), borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} style={{ color: 'white' }} />
                </div>
                <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} className="spinner" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-purple)', animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask ARIA about markets, niches, growth strategies..." className="input" style={{ flex: 1, resize: 'none', minHeight: 44, maxHeight: 120, fontSize: 13, padding: '10px 14px', fontFamily: 'inherit' }} rows={1} />
          <button onClick={() => send()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ height: 44, padding: '0 16px', flexShrink: 0 }}>
            <Send size={15} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-disabled)', marginTop: 8, textAlign: 'center' }}>ARIA is powered by NVIDIA AI. Shift+Enter for new line.</div>
      </div>
    </div>
  );
}
