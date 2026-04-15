'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, CheckCircle, ArrowRight, Radio, Sparkles, BarChart3, Users, Star } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const features = [
    { icon: Radio, title: 'Daily Market Briefings', desc: 'ARIA scans 5+ trending markets every day using real Google Trends data and delivers your GO signal report.' },
    { icon: Zap, title: 'Complete Starter Kits', desc: 'One click builds your full kit: product ideas, 7-day action plan, landing page copy, Reddit communities, revenue path.' },
    { icon: TrendingUp, title: 'Real Trend Validation', desc: 'Validate any keyword with 5-year Google Trends charts, 12-month growth scores, and AI-powered opportunity analysis.' },
    { icon: BarChart3, title: 'Market Radar', desc: 'Track emerging niches across 6 categories. Watch signals move from WAIT to GO before the crowd catches on.' },
    { icon: Users, title: 'Watchlist Tracking', desc: 'Add any market to your watchlist. Get notified when signals shift — so you act at the right moment.' },
    { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Every report is grounded in real data, not hallucinations. NVIDIA AI interprets trends, finds gaps, spots opportunities.' },
  ];

  const steps = [
    { n: '01', t: 'Get Your Briefing', d: 'Click one button. ARIA scans trending markets using real Google Trends API data and finds your top GO opportunities.' },
    { n: '02', t: 'Build Your Kit', d: 'Pick an opportunity. One click generates your complete starter kit with everything you need to launch in 7 days.' },
    { n: '03', t: 'Launch & Validate', d: 'Use the landing page copy, Reddit communities, and content hooks to get your first customers fast.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-subtle)', background: 'rgba(8,8,16,.9)', backdropFilter: 'blur(12px)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-.02em', color: 'white' }}>NicheFlow</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: -2 }}>AI Scout</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/auth/login" style={{ fontSize: 13, color: 'var(--text-tertiary)', textDecoration: 'none', padding: '8px 14px' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ fontSize: 13, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 99, fontSize: 11, fontWeight: 700, color: 'var(--brand-purple)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          <Zap size={10} /> AI-Powered Market Intelligence
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.08, marginBottom: 20, maxWidth: 800, margin: '0 auto 20px' }}>
          Find your next{' '}
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>profitable niche</span>
          {' '}before everyone else
        </h1>
        <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--text-tertiary)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px' }}>
          NicheFlow scans real Google Trends data daily, finds GO-signal markets, and builds you a complete starter kit — product ideas, landing page, Reddit communities, and a 7-day launch plan — in one click.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', letterSpacing: '-.01em' }}>
            <Zap size={16} /> Get Your Free Briefing <ArrowRight size={15} />
          </Link>
          <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'rgba(255,255,255,.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-base)', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-disabled)' }}>Free forever plan available. No credit card required.</div>
      </div>

      {/* Demo card */}
      <div style={{ maxWidth: 860, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.04))', border: '1px solid rgba(99,102,241,.2)', borderRadius: 20, padding: '28px 32px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Radio size={10} /> Live Example - ARIA Daily Briefing
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12 }}>
            {[
              { market: 'AI Productivity Tools', score: 84, signal: 'GO', why: 'Search volume up 340% in 90 days. Low competition in B2B segment.' },
              { market: 'Longevity Supplements', score: 78, signal: 'GO', why: 'Biohacking trend accelerating. $4.2B market with weak digital presence.' },
              { market: 'ADHD Coaching Apps', score: 71, signal: 'GO', why: 'Post-pandemic diagnosis surge. Underserved mobile-first demographic.' },
            ].map((opp, i) => (
              <div key={i} style={{ background: 'var(--bg-overlay)', borderRadius: 14, padding: '14px 16px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{opp.market}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99, background: 'rgba(34,197,94,.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,.25)' }}>{opp.signal}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 8 }}>{opp.why}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--success)' }}>{opp.score}<span style={{ fontSize: 10, color: 'var(--text-disabled)', fontWeight: 400 }}>/100</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em' }}>From zero to launched in 7 days</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(99,102,241,.08)', position: 'absolute', top: 12, right: 20, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Step {s.n}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.65 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em' }}>Everything you need to find and validate niches</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: 16, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,102,241,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon size={18} style={{ color: 'var(--brand-purple)' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What you get in a starter kit */}
      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.07),rgba(139,92,246,.03))', border: '1px solid rgba(99,102,241,.18)', borderRadius: 24, padding: '40px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Starter Kit Includes</div>
              <h2 style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 20 }}>Everything to launch in one week</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Real Google Trends validation score', 'Product ideas with pricing and build plan', 'Complete landing page copy (headline, bullets, CTA)', '7-day step-by-step action plan', 'Reddit communities to post in', 'Viral content hooks for each platform', '30-day revenue estimate and price point'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Market Score', val: '84/100 GO', color: 'var(--success)' },
                { label: 'Product Idea', val: 'AI Productivity App', color: 'var(--text-primary)' },
                { label: 'Price Point', val: '$29/month SaaS', color: 'var(--text-primary)' },
                { label: '30-Day Revenue Est.', val: '$2,400 - $4,800', color: 'var(--success)' },
                { label: 'First Action', val: 'Post in r/productivity today', color: 'var(--brand-purple)' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-overlay)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 640, margin: '0 auto 80px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))', border: '1px solid rgba(99,102,241,.2)', borderRadius: 24, padding: '48px 32px' }}>
          <div style={{ fontSize: 28, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 12 }}>Start finding GO signals today</h2>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 28, lineHeight: 1.6 }}>Join founders using NicheFlow to find and validate profitable niches before they go mainstream.</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            <Zap size={16} /> Get Started Free <ArrowRight size={15} />
          </Link>
          <div style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 14 }}>7 free generations. No credit card required.</div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={10} style={{ color: 'white' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)' }}>NicheFlow</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-disabled)' }}>AI-powered market intelligence for founders</div>
      </footer>
    </div>
  );
}
