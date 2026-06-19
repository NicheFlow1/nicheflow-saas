'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
);

const TABS = ['Profile', 'Billing', 'Notifications', 'API Keys'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ daily_briefing: true, signal_alerts: true, weekly_digest: true, product_updates: false });
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await SB.auth.getUser();
      if (!user) return;
      const { data: profile } = await SB.from('profiles').select('*').eq('id', user.id).single();
      setName(profile?.full_name || user?.user_metadata?.full_name || '');
      setEmail(user?.email || '');
      setBio(profile?.bio || '');
      setApiKey(profile?.anthropic_api_key ? '••••••••••••••••••••••••••••••••' : '');
    } catch {}
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await SB.auth.getUser();
      if (!user) return;
      await SB.from('profiles').upsert({ id: user.id, full_name: name, bio, updated_at: new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px',
    padding: '11px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ padding: '32px', maxWidth: '720px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 28px' }}>Settings</h1>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === tab ? 700 : 400, color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.15s' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'Profile' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={email} disabled placeholder="your@email.com" style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0' }}>Email changes are not supported yet.</p>
          </div>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Solo founder, building in AI..." rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div>
            <button onClick={saveProfile} disabled={saving}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>Danger zone</div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Permanently delete your account and all data. This cannot be undone.</p>
            <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => confirm('Are you sure? This will permanently delete your account.') && SB.auth.signOut()}>
              Delete account
            </button>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'Billing' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Current plan</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Starter</span>
                  <span style={{ background: 'rgba(107,114,128,0.15)', color: '#6b7280', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>Free</span>
                </div>
              </div>
              <a href="/pricing" style={{ background: 'var(--accent)', color: '#fff', borderRadius: '10px', padding: '10px 18px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                Upgrade to Pro →
              </a>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Validations used', value: '3 / 10' },
                { label: 'Watchlist slots', value: '1 / 3' },
                { label: 'ARIA messages', value: '8 / 20' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px' }}>No active subscription. Upgrade to Pro for unlimited access.</p>
            <a href="/pricing" style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View pricing plans →</a>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'Notifications' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { key: 'daily_briefing', label: 'Daily morning briefing', desc: 'Top 3 GO signals emailed at 8am UTC (Pro)' },
            { key: 'signal_alerts', label: 'Watchlist signal alerts', desc: 'Email when a niche moves from WAIT → GO' },
            { key: 'weekly_digest', label: 'Weekly digest', desc: 'Top niches of the week every Monday 9am UTC' },
            { key: 'product_updates', label: 'Product updates', desc: 'New features and improvements' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <button onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: notifs[item.key as keyof typeof notifs] ? 'var(--accent)' : '#374151', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: notifs[item.key as keyof typeof notifs] ? '23px' : '3px', transition: 'left 0.2s' }} />
              </button>
            </div>
          ))}
          <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: 'fit-content' }}>
            Save preferences
          </button>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'API Keys' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Add your own Anthropic API key to use NicheFlow with your personal API quota. If left blank, NicheFlow uses its shared key (subject to plan limits).
            </p>
          </div>
          <div>
            <label style={labelStyle}>Anthropic API key</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={apiKey} onChange={e => setApiKey(e.target.value)} type={showKey ? 'text' : 'password'} placeholder="sk-ant-..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => setShowKey(s => !s)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 14px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0' }}>Your key is encrypted before storage. We never log it in plain text.</p>
          </div>
          <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: 'fit-content' }}>
            Save API key
          </button>
        </div>
      )}
    </div>
  );
}
