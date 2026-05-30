'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile'|'billing'|'notifications'|'api'>('profile');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '' });

  async function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'billing', label: 'Billing & Plan' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'api', label: 'API Keys' },
  ];

  const plans = [
    { name: 'Free', price: '$0', period: '/mo', features: ['10 AI generations/mo', '3 market radars', '1 starter kit', 'Community support'], color: '#6b7280', current: true },
    { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited AI generations', 'Real-time trend alerts', 'Full audience intel', 'Priority support', 'Export to PDF/CSV'], color: '#7c3aed', current: false },
    { name: 'Agency', price: '$79', period: '/mo', features: ['Everything in Pro', 'Up to 10 team members', 'White-label reports', 'API access', 'Dedicated support'], color: '#f59e0b', current: false },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '860px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Manage your account, plan, and preferences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            style={{ padding: '8px 18px', borderRadius: '7px', border: 'none', background: tab === t.id ? 'var(--accent)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-secondary)', fontSize: '13px', fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px' }}>Profile Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '480px' }}>
            {[['Full Name', 'name', 'Your name'], ['Email Address', 'email', 'your@email.com'], ['Company', 'company', 'Optional']].map(([label, key, ph]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</label>
                <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={ph}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            ))}
            <button onClick={saveProfile}
              style={{ padding: '11px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: 'fit-content', marginTop: '4px' }}>
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {tab === 'billing' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: plan.current ? '2px solid var(--accent)' : '1px solid var(--border)', padding: '24px', position: 'relative' as const }}>
                {plan.current && <div style={{ position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '2px 14px', borderRadius: '20px', background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' as const }}>CURRENT PLAN</div>}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: plan.color, textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '4px' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.price}</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{plan.period}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: plan.current ? '1px solid var(--border)' : 'none', background: plan.current ? 'transparent' : plan.color, color: plan.current ? 'var(--text-secondary)' : '#fff', fontSize: '13px', fontWeight: 600, cursor: plan.current ? 'default' : 'pointer' }}>
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Billing History</h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No billing history yet.</div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px' }}>Notification Preferences</h2>
          {[['Daily Picks digest email', true], ['Trending alerts', true], ['Watchlist updates', false], ['Product updates & news', true]].map(([label, def], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{String(label)}</span>
              <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: def ? 'var(--accent)' : 'var(--border)', position: 'relative' as const, cursor: 'pointer' }}>
                <div style={{ position: 'absolute' as const, top: '3px', left: def ? '20px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: '0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Tab */}
      {tab === 'api' && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>API Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 24px' }}>API access is available on the Pro and Agency plans.</p>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Upgrade to Pro to get your API key.</div>
        </div>
      )}
    </div>
  );
}