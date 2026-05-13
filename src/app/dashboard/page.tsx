'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Zap, TrendingUp, Package, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    const sb = sbRef.current;
    sb.auth.getSession().then(async ({ data: { session } }: any) => {
      if (!session) return;
      const uid = session.user.id;
      const [{ data: pr }, { data: rp }, { data: kt }] = await Promise.all([
        sb.from('profiles').select('*').eq('id', uid).single(),
        sb.from('validation_reports').select('id,keyword,signal,overall_score,created_at').eq('user_id', uid).order('created_at', { ascending: false }).limit(6),
        sb.from('starter_kits').select('id,keyword,created_at').eq('user_id', uid).order('created_at', { ascending: false }).limit(4),
      ]);
      setProfile(pr);
      setReports(rp || []);
      setKits(kt || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--border-base)', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const used = profile?.generations_used || 0;
  const limit = profile?.generations_limit || 7;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Welcome back. Here is your market intelligence overview.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Generations', value: `${used}/${limit}`, icon: <Zap size={16} color="var(--brand-purple)" /> },
          { label: 'Reports', value: reports.length, icon: <TrendingUp size={16} color="#10b981" /> },
          { label: 'Starter Kits', value: kits.length, icon: <Package size={16} color="#f59e0b" /> },
          { label: 'Plan', value: (profile?.plan || 'free').toUpperCase(), icon: <Zap size={16} color="#6366f1" /> },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>{s.icon}<span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span></div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Recent Reports</h3>
            <Link href="/validate" style={{ fontSize: 12, color: 'var(--brand-purple)', textDecoration: 'none' }}>+ New</Link>
          </div>
          {reports.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No reports yet. <Link href="/validate" style={{ color: 'var(--brand-purple)', textDecoration: 'none' }}>Validate a trend</Link></p>
          ) : reports.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.keyword}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: r.signal === 'GO' ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.1)', color: r.signal === 'GO' ? '#10b981' : '#f59e0b' }}>{r.signal || 'WATCH'}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Starter Kits</h3>
            <Link href="/autopilot/starter" style={{ fontSize: 12, color: 'var(--brand-purple)', textDecoration: 'none' }}>+ New</Link>
          </div>
          {kits.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No kits yet. <Link href="/autopilot/starter" style={{ color: 'var(--brand-purple)', textDecoration: 'none' }}>Build one</Link></p>
          ) : kits.map(k => (
            <Link key={k.id} href={`/autopilot/kit/${k.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{k.keyword}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(k.created_at).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
        {[
          { href: '/autopilot', label: 'Get Briefing', desc: 'Daily GO signals', icon: <Zap size={18} color="var(--brand-purple)" /> },
          { href: '/autopilot/starter', label: 'Build Kit', desc: 'Complete starter kit', icon: <Package size={18} color="#10b981" /> },
          { href: '/validate', label: 'Validate Trend', desc: 'Real Google Trends', icon: <TrendingUp size={18} color="#f59e0b" /> },
          { href: '/content', label: 'Create Content', desc: 'Viral posts & hooks', icon: <Plus size={18} color="#6366f1" /> },
        ].map((a, i) => (
          <Link key={i} href={a.href} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: 12, padding: 16, textDecoration: 'none', display: 'block' }}>
            <div style={{ marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{a.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
