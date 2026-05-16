'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { User, CreditCard, Zap, Crown, Palette } from 'lucide-react';

const THEMES = [
  { id:'dark', label:'Dark', bg:'#08090d', accent:'#6366f1' },
  { id:'midnight', label:'Midnight', bg:'#000000', accent:'#8b5cf6' },
  { id:'light', label:'Light', bg:'#f8f9fc', accent:'#6366f1' },
  { id:'purple', label:'Purple', bg:'#0d0a1a', accent:'#a78bfa' },
];

export default function SettingsPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('dark');
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const saved = localStorage.getItem('nf-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    const sb = sbRef.current;
    sb.auth.getSession().then(async ({ data }: any) => {
      setSession(data.session);
      if (data.session) {
        const { data: pr } = await sb.from('profiles').select('*').eq('id', data.session.user.id).single();
        setProfile(pr);
        setName(pr?.full_name || '');
      }
    });
  }, []);

  function applyTheme(t: string) {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('nf-theme', t);
  }

  async function saveProfile() {
    if (!session) return;
    setSaving(true);
    await sbRef.current.from('profiles').update({ full_name: name }).eq('id', session.user.id);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  const plan = profile?.plan || 'free';
  const used = profile?.generations_used || 0;
  const limit = profile?.generations_limit || 7;

  return (
    <div style={{ maxWidth:640,margin:'0 auto',padding:'32px 24px' }}>
      <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',marginBottom:24 }}>Settings</h1>

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:14 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:16 }}>
          <User size={16} color="var(--text-muted)"/>
          <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',margin:0 }}>Profile</h3>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block',fontSize:12,fontWeight:600,color:'var(--text-muted)',marginBottom:6,textTransform:'uppercase' as const }}>Display Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%',background:'var(--bg-base)',border:'1px solid var(--border-base)',borderRadius:8,padding:'9px 13px',color:'var(--text-primary)',fontSize:14,outline:'none',boxSizing:'border-box' as const }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block',fontSize:12,fontWeight:600,color:'var(--text-muted)',marginBottom:6,textTransform:'uppercase' as const }}>Email</label>
          <input value={session?.user?.email||''} disabled style={{ width:'100%',background:'var(--bg-hover)',border:'1px solid var(--border-base)',borderRadius:8,padding:'9px 13px',color:'var(--text-muted)',fontSize:14,outline:'none',boxSizing:'border-box' as const,opacity:0.7 }}/>
        </div>
        <button onClick={saveProfile} disabled={saving} style={{ background:'var(--brand-purple)',color:'#fff',border:'none',padding:'9px 20px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer' }}>
          {saving?'Saving...':saved?'Saved!':'Save Profile'}
        </button>
      </div>

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:14 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:16 }}>
          <Palette size={16} color="var(--text-muted)"/>
          <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',margin:0 }}>Theme</h3>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8 }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={()=>applyTheme(t.id)} style={{ padding:'12px 8px',borderRadius:10,border:`2px solid ${theme===t.id?'var(--brand-purple)':'var(--border-base)'}`,background:'var(--bg-base)',cursor:'pointer',textAlign:'center' as const }}>
              <div style={{ width:28,height:28,borderRadius:8,background:t.bg,border:'1px solid rgba(255,255,255,0.1)',margin:'0 auto 6px',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',bottom:0,right:0,width:12,height:12,borderRadius:'4px 0 0 0',background:t.accent }}/>
              </div>
              <div style={{ fontSize:11,fontWeight:600,color:theme===t.id?'var(--brand-purple)':'var(--text-muted)' }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:14 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <Zap size={16} color="var(--brand-purple)"/>
            <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',margin:0 }}>Usage</h3>
          </div>
          <span style={{ fontSize:11,fontWeight:700,color:'var(--brand-purple)',background:'rgba(139,92,246,.1)',padding:'3px 10px',borderRadius:20,textTransform:'uppercase' as const }}>{plan}</span>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6 }}>
          <span style={{ color:'var(--text-muted)' }}>Generations used</span>
          <span style={{ color:'var(--text-primary)',fontWeight:600 }}>{used}/{limit}</span>
        </div>
        <div style={{ height:6,background:'var(--bg-hover)',borderRadius:3,overflow:'hidden',marginBottom:8 }}>
          <div style={{ height:'100%',width:`${Math.min(100,(used/limit)*100)}%`,background:used>=limit?'#ef4444':'var(--brand-purple)',borderRadius:3 }}/>
        </div>
        {used>=limit && <p style={{ fontSize:12,color:'#ef4444',margin:0 }}>Limit reached. Upgrade to continue.</p>}
      </div>

      <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05))',border:'1px solid rgba(99,102,241,.25)',borderRadius:14,padding:22 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
          <Crown size={16} color="#6366f1"/>
          <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',margin:0 }}>Upgrade Plan</h3>
        </div>
        <p style={{ fontSize:13,color:'var(--text-muted)',margin:'0 0 14px' }}>More generations, advanced features, and priority AI access.</p>
        <a href="/settings/billing" style={{ display:'inline-flex',alignItems:'center',gap:6,background:'#6366f1',color:'#fff',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:700,textDecoration:'none' }}>
          <CreditCard size={13}/> View Plans & Billing
        </a>
      </div>
    </div>
  );
}
