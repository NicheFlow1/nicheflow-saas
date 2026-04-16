'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client-singleton';
import { Save, CheckCircle, Globe, Palette, User, Bell, Shield } from 'lucide-react';

const THEMES = [
  { id: 'dark', label: 'Dark', desc: 'Easy on the eyes' },
  { id: 'midnight', label: 'Midnight', desc: 'Deep black, high contrast' },
  { id: 'light', label: 'Light', desc: 'Clean white theme' },
  { id: 'purple', label: 'Purple', desc: 'Vibrant purple accent' },
];

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ps', label: 'Pashto', native: 'پښتو' },
  { code: 'fa', label: 'Persian/Dari', native: 'دری' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      setEmail(session.user.email || '');
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) {
        setProfile(data);
        setTheme(data.theme || 'dark');
        setLanguage(data.language || 'en');
      }
    });
  }, []);

  function applyTheme(t: string) {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    await supabase.from('profiles').update({ theme, language }).eq('id', profile.id);
    applyTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account, appearance, and preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <User size={16} style={{ color: 'var(--brand-purple)' }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Account</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Email Address</label>
            <input value={email} disabled className="input" style={{ opacity: 0.6, fontSize: 13 }} />
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--bg-overlay)', borderRadius: 10, fontSize: 12, color: 'var(--text-tertiary)' }}>
            Plan: <strong style={{ color: 'var(--brand-purple)' }}>{profile?.plan === 'pro' ? 'Pro' : 'Free'}</strong> &nbsp;|&nbsp; Generations: {profile?.generations_used || 0}/{profile?.generations_limit || 7} used
          </div>
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Palette size={16} style={{ color: 'var(--brand-purple)' }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Theme</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {THEMES.map(t => (
              <button key={t.id} onClick={() => applyTheme(t.id)} style={{ padding: '14px 16px', background: theme === t.id ? 'rgba(99,102,241,.1)' : 'var(--bg-overlay)', border: '2px solid ' + (theme === t.id ? 'var(--brand-purple)' : 'var(--border-base)'), borderRadius: 12, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: t.id === 'dark' ? '#1a1a2e' : t.id === 'midnight' ? '#000008' : t.id === 'light' ? '#f8f9ff' : '#2d1b69', border: '1px solid rgba(255,255,255,.1)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.label}</span>
                  {theme === t.id && <CheckCircle size={13} style={{ color: 'var(--brand-purple)', marginLeft: 'auto' }} />}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-2xl)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Globe size={16} style={{ color: 'var(--brand-purple)' }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Language</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLanguage(l.code)} style={{ padding: '10px 12px', background: language === l.code ? 'rgba(99,102,241,.1)' : 'var(--bg-overlay)', border: '2px solid ' + (language === l.code ? 'var(--brand-purple)' : 'var(--border-base)'), borderRadius: 10, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{l.native}</div>
                <div style={{ fontSize: 10, color: 'var(--text-disabled)' }}>{l.label}</div>
                {language === l.code && <CheckCircle size={11} style={{ color: 'var(--brand-purple)', marginTop: 4 }} />}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(99,102,241,.06)', borderRadius: 8, fontSize: 11, color: 'var(--text-tertiary)' }}>
            Language affects AI responses and UI labels. After saving, AI-generated content will be in your selected language.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving} className="btn btn-grad" style={{ gap: 8 }}>
            {saved ? <><CheckCircle size={14} />Saved!</> : saving ? <><div className="spinner" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white' }} />Saving...</> : <><Save size={14} />Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}
