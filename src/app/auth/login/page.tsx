'use client';
import React, { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const sb = getSupabaseClient();
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError(e.message || 'Sign in failed');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
            <Zap size={20} color="#fff" fill="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sign in to your NicheFlow account</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-base)', borderRadius: 8, padding: '10px 13px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-base)', borderRadius: 8, padding: '10px 13px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && (
              <div style={{ padding: '10px 13px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#ef4444' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{ width: '100%', background: loading || !email || !password ? 'var(--bg-hover)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: loading || !email || !password ? 'var(--text-muted)' : '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading || !email || !password ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
          No account?{' '}
          <a href="/auth/signup" style={{ color: 'var(--brand-purple)', fontWeight: 600, textDecoration: 'none' }}>Create one free</a>
        </p>
      </div>
    </div>
  );
}
