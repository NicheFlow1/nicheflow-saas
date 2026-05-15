'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Send, Bot, User, MessageSquare } from 'lucide-react';

const FN = 'https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot';
const SB_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U';

const SUGGESTIONS = [
  'Find me a profitable niche with low competition',
  'Best niches for a solo founder in 2025?',
  'How do I validate an idea before building?',
  '5 micro-SaaS ideas under $10k MRR',
  'Best monetization model for a content site?',
  'How do I find my first 100 customers?',
];

interface Msg { role: 'user'|'assistant'; content: string; streaming?: boolean; }
interface HistoryItem { id: string; message: string; reply: string; created_at: string; }

export default function AIChatPage() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(({ data }: any) => { setSession(data.session); setReady(true); if (data.session) loadHistory(data.session.access_token); });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e: any, s: any) => { setSession(s); setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  async function loadHistory(token: string) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/ai_chat_sessions?select=*&order=created_at.desc&limit=30`, { headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` } });
      if (r.ok) setHistory(await r.json());
    } catch {}
  }

  async function streamReply(reply: string) {
    const words = reply.split(' ');
    let current = '';
    setMessages(prev => [...prev, { role:'assistant', content:'', streaming:true }]);
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      setMessages(prev => { const updated = [...prev]; updated[updated.length-1] = { role:'assistant', content:current, streaming:i < words.length-1 }; return updated; });
      await new Promise(r => setTimeout(r, 18));
    }
  }

  async function send(text?: string) {
    const msg = (text || input).trim();
    if (!msg || !session || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', content:msg }]);
    setLoading(true);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90000);
      const r = await fetch(FN, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${session.access_token}` },
        body: JSON.stringify({ action:'ai_chat', message:msg, history: messages.slice(-8).map(m=>({ role:m.role, content:m.content })) }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const data = await r.json();
      const reply = r.ok ? (data.reply || 'No response.') : (data.error || 'Request failed.');
      await streamReply(reply);
      setHistory(prev => [{ id: Date.now().toString(), message:msg, reply, created_at: new Date().toISOString() }, ...prev.slice(0,29)]);
    } catch (e: any) {
      const err = e.name==='AbortError' ? 'Request timed out. Please try again.' : (e.message || 'Connection error.');
      await streamReply(err);
    } finally { setLoading(false); }
  }

  if (!ready) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><div style={{ width:28,height:28,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/></div>;
  if (!session) { if (typeof window !== 'undefined') window.location.href='/auth/login'; return null; }

  return (
    <div style={{ display:'flex',height:'calc(100vh - 56px)' }}>
      {showHistory && (
        <div style={{ width:260,borderRight:'1px solid var(--border-base)',overflowY:'auto',background:'var(--bg-card)',flexShrink:0 }}>
          <div style={{ padding:'16px 14px 10px',fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em' }}>Chat History</div>
          {history.length === 0 && <p style={{ fontSize:13,color:'var(--text-muted)',padding:'0 14px' }}>No history yet.</p>}
          {history.map(h => (
            <button key={h.id} onClick={() => { setMessages([{ role:'user',content:h.message },{ role:'assistant',content:h.reply }]); setShowHistory(false); }} style={{ width:'100%',textAlign:'left',padding:'10px 14px',background:'none',border:'none',borderBottom:'1px solid var(--border-subtle)',cursor:'pointer' }}>
              <p style={{ fontSize:13,color:'var(--text-primary)',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{h.message}</p>
              <p style={{ fontSize:11,color:'var(--text-muted)',margin:0 }}>{new Date(h.created_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      )}

      <div style={{ flex:1,display:'flex',flexDirection:'column',minWidth:0 }}>
        <div style={{ padding:'12px 20px',borderBottom:'1px solid var(--border-base)',display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:12,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <Bot size={18} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize:15,fontWeight:700,color:'var(--text-primary)' }}>ARIA</div>
            <div style={{ fontSize:12,color:'#10b981' }}>● Online · Market Intelligence AI</div>
          </div>
          <button onClick={()=>setShowHistory(!showHistory)} style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:6,background:'var(--bg-hover)',border:'1px solid var(--border-base)',color:'var(--text-muted)',padding:'6px 12px',borderRadius:8,cursor:'pointer',fontSize:12 }}>
            <MessageSquare size={13}/> History
          </button>
          {messages.length > 0 && <button onClick={()=>setMessages([])} style={{ background:'var(--bg-hover)',border:'1px solid var(--border-base)',color:'var(--text-muted)',padding:'6px 12px',borderRadius:8,cursor:'pointer',fontSize:12 }}>New Chat</button>}
        </div>

        <div style={{ flex:1,overflowY:'auto',padding:'20px' }}>
          {messages.length === 0 && (
            <div>
              <div style={{ textAlign:'center',padding:'24px 0 28px' }}>
                <div style={{ width:56,height:56,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 8px 24px rgba(99,102,241,0.3)' }}><Bot size={28} color="#fff"/></div>
                <h2 style={{ fontSize:18,fontWeight:700,color:'var(--text-primary)',marginBottom:6 }}>Hey, I am ARIA</h2>
                <p style={{ fontSize:13,color:'var(--text-muted)',maxWidth:360,margin:'0 auto' }}>Your market intelligence AI. Ask me anything about niches, validation, monetization, or growth strategy.</p>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8 }}>
                {SUGGESTIONS.map((s,i) => <button key={i} onClick={()=>send(s)} style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:10,padding:'12px 14px',textAlign:'left',cursor:'pointer',color:'var(--text-secondary)',fontSize:13,lineHeight:1.4 }}>{s}</button>)}
              </div>
            </div>
          )}

          {messages.map((m,i) => (
            <div key={i} style={{ display:'flex',gap:10,marginBottom:20,alignItems:'flex-start',flexDirection:m.role==='user'?'row-reverse':'row' }}>
              <div style={{ width:32,height:32,borderRadius:'50%',background:m.role==='user'?'rgba(99,102,241,.15)':'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                {m.role==='user'?<User size={15} color="var(--brand-purple)"/>:<Bot size={15} color="#fff"/>}
              </div>
              <div style={{ maxWidth:'78%',background:m.role==='user'?'rgba(99,102,241,.08)':'var(--bg-card)',border:`1px solid ${m.role==='user'?'rgba(99,102,241,.2)':'var(--border-base)'}`,borderRadius:12,padding:'10px 14px' }}>
                <p style={{ fontSize:14,color:'var(--text-primary)',margin:0,lineHeight:1.7,whiteSpace:'pre-wrap' }}>{m.content}{m.streaming && <span style={{ display:'inline-block',width:2,height:14,background:'var(--brand-purple)',marginLeft:2,animation:'blink 0.8s infinite',verticalAlign:'middle' }}/>}</p>
              </div>
            </div>
          ))}

          {loading && !messages[messages.length-1]?.streaming && (
            <div style={{ display:'flex',gap:10,marginBottom:20 }}>
              <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center' }}><Bot size={15} color="#fff"/></div>
              <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:'12px 16px',display:'flex',gap:5,alignItems:'center' }}>
                {[0,1,2].map(i=><div key={i} style={{ width:6,height:6,borderRadius:'50%',background:'var(--text-muted)',animation:`bounce 1s ${i*0.15}s infinite` }}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div style={{ padding:'12px 20px 16px',borderTop:'1px solid var(--border-base)' }}>
          <div style={{ display:'flex',gap:8,background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12,padding:'8px 8px 8px 14px' }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} placeholder="Ask ARIA about niches, validation, or growth..." style={{ flex:1,background:'none',border:'none',outline:'none',color:'var(--text-primary)',fontSize:14 }}/>
            <button onClick={()=>send()} disabled={loading||!input.trim()} style={{ width:36,height:36,borderRadius:8,background:loading||!input.trim()?'var(--bg-hover)':'var(--brand-purple)',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:loading||!input.trim()?'not-allowed':'pointer',flexShrink:0 }}>
              <Send size={14} color={loading||!input.trim()?'var(--text-muted)':'#fff'}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
