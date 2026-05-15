'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { User, CreditCard, Zap, Crown } from 'lucide-react';

export default function SettingsPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
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

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:16 }}>
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

      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:14,padding:22,marginBottom:16 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <Zap size={16} color="var(--brand-purple)"/>
            <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',margin:0 }}>Usage</h3>
          </div>
          <span style={{ fontSize:12,fontWeight:700,color:'var(--brand-purple)',background:'rgba(139,92,246,.1)',padding:'3px 10px',borderRadius:20,textTransform:'uppercase' as const }}>{plan}</span>
        </div>
        <div style={{ marginBottom:8,display:'flex',justifyContent:'space-between',fontSize:13 }}>
          <span style={{ color:'var(--text-muted)' }}>Generations used</span>
          <span style={{ color:'var(--text-primary)',fontWeight:600 }}>{used}/{limit}</span>
        </div>
        <div style={{ height:6,background:'var(--bg-hover)',borderRadius:3,overflow:'hidden' }}>
          <div style={{ height:'100%',width:`${Math.min(100,(used/limit)*100)}%`,background:used>=limit?'#ef4444':'var(--brand-purple)',borderRadius:3,transition:'width 0.3s' }}/>
        </div>
        {used >= limit && <p style={{ fontSize:12,color:'#ef4444',margin:'8px 0 0' }}>Credit limit reached. Upgrade to continue.</p>}
      </div>

      <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05))',border:'1px solid rgba(99,102,241,.25)',borderRadius:14,padding:22 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
          <Crown size={16} color="#6366f1"/>
          <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',margin:0 }}>Upgrade Plan</h3>
        </div>
        <p style={{ fontSize:13,color:'var(--text-muted)',margin:'0 0 14px' }}>Get more generations, advanced features, and priority AI access.</p>
        <div style={{ display:'flex',gap:10 }}>
          <a href="/settings/billing" style={{ background:'#6366f1',color:'#fff',border:'none',padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6 }}>
            <CreditCard size={14}/> View Plans & Billing
          </a>
        </div>
      </div>
    </div>
  );
}
