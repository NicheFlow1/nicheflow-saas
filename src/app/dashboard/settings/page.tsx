'use client';
import { useEffect, useState } from 'react';

type Tab = 'profile' | 'billing' | 'notifications' | 'api';

const PLANS = [
  { name: 'Free', price: '$0', period: '/mo', features: ['10 AI generations/mo','3 niche reports','1 starter kit','Community access'], color: '#6b7280', current: true },
  { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited generations','Unlimited reports','Unlimited starter kits','Priority AI','Daily Picks access','Keyword Clusters'], color: '#7c3aed', current: false, popular: true },
  { name: 'Agency', price: '$79', period: '/mo', features: ['Everything in Pro','5 team seats','White-label reports','API access','Custom integrations','Dedicated support'], color: '#3b82f6', current: false },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'api', label: 'API Keys', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Manage your account, billing and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-base)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: tab === t.id ? 'var(--brand-purple)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '9px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[{ label: 'Full Name', key: 'name', placeholder: 'Your name' }, { label: 'Email', key: 'email', placeholder: 'you@example.com' }, { label: 'Bio', key: 'bio', placeholder: 'Tell us about yourself' }].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{f.label}</label>
              <input value={(profile as any)[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '11px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <button style={{ alignSelf: 'flex-start', background: 'var(--brand-purple)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
        </div>
      )}

      {/* Billing Tab */}
      {tab === 'billing' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Choose Your Plan</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Upgrade anytime. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{ background: 'var(--bg-card)', borderRadius: '14px', border: `2px solid ${plan.popular ? plan.color : 'var(--border-base)'}`, padding: '24px', position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-1px', right: '16px', background: plan.color, color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '0 0 8px 8px', letterSpacing: '0.5px' }}>POPULAR</div>}
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: plan.color }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: '100%', background: plan.current ? 'var(--bg-hover)' : plan.color, color: plan.current ? 'var(--text-muted)' : '#fff', border: plan.current ? '1px solid var(--border-base)' : 'none', borderRadius: '10px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: plan.current ? 'default' : 'pointer' }}>
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '24px' }}>
          {[{ label: 'Daily Picks alerts', desc: 'Get notified when new picks drop' }, { label: 'Trend spikes', desc: 'Alert when a watched niche jumps 50%+' }, { label: 'Weekly digest', desc: 'Summary of your market intel every Monday' }].map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 2 ? '1px solid var(--border-base)' : 'none' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{n.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.desc}</div>
              </div>
              <div style={{ width: '44px', height: '24px', background: 'var(--brand-purple)', borderRadius: '12px', cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', right: '3px', top: '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Tab */}
      {tab === 'api' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-base)', padding: '24px' }}>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>API access is available on the Agency plan.</div>
          <div style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-base)', borderRadius: '10px', padding: '14px 18px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>sk-nf-••••••••••••••••••••••••</div>
          <button style={{ background: 'var(--brand-purple)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Generate New Key</button>
        </div>
      )}
    </div>
  );
}
