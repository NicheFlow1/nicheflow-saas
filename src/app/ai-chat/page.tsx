'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Send, Bot, User } from 'lucide-react';

const SB_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';
const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';

const SUGGESTIONS = [
  'Find me a profitable niche with low competition',
  'What are the best niches for a solo founder in 2025?',
  'How do I validate an idea before building?',
  'Give me 5 micro-SaaS ideas under $10k MRR potential',
  'What is the best monetization model for a content site?',
  'How do I find my first 100 customers?',
];

interface Message { role: 'user' | 'assistant'; content: string; }

export default function AIChatPage() {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sb = createBrowserClient(SB_URL, SB_ANON);

  useEffect(() => { sb.auth.getSession().then(({ data }) => setSession(data.session)); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function send(text?: string) {
    const msg = (text || input).trim();
    if (!msg || !session || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90000);
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'ai_chat', message: msg, history: history.slice(0, -1) }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const data = await r.json();
      const reply = r.ok ? (data.reply || 'No response.') : (data.error || 'Request failed.');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      const err = e.name === 'AbortError' ? 'Request timed out. Please try again.' : (e.message || 'Connection error.');
      setMessages(prev => [...prev, { role: 'assistant', content: err }]);
    } finally { setLoading(false); }
  }

  if (!session) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', maxWidth: 760, margin: '0 auto', padding: '0 16px' }}>
      <div style={{ padding: '20px 0 14px', borderBottom: '1px solid var(--border-base)', marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>ARIA</h1>
            <p style={{ fontSize: 12, color: '#10b981', margin: 0 }}>● Online</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
        {messages.length === 0 && (
          <div>
            <div style={{ textAlign: 'center', padding: '30px 0 24px' }}>
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Bot size={26} color="#fff" />
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Hey, I am ARIA</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 340, margin: '0 auto' }}>Your market intelligence AI. Ask me anything about niches, validation, monetization, or growth.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '11px 14px', textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.4 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.role === 'user' ? 'rgba(99,102,241,.2)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'user' ? <User size={14} color="var(--brand-purple)" /> : <Bot size={14} color="#fff" />}
            </div>
            <div style={{ maxWidth: '80%', background: m.role === 'user' ? 'rgba(99,102,241,.1)' : 'var(--bg-card)', border: `1px solid ${m.role === 'user' ? 'rgba(99,102,241,.2)' : 'var(--border-base)'}`, borderRadius: 12, padding: '10px 14px' }}>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color="#fff" />
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1s ${i * 0.15}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '12px 0 16px', borderTop: '1px solid var(--border-base)' }}>
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 12, padding: '8px 8px 8px 14px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask ARIA about niches, validation, or growth..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14 }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{ width: 34, height: 34, borderRadius: 8, background: loading || !input.trim() ? 'var(--bg-hover)' : 'var(--brand-purple)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer' }}
          >
            <Send size={14} color={loading || !input.trim() ? 'var(--text-muted)' : '#fff'} />
          </button>
        </div>
      </div>
    </div>
  );
}
