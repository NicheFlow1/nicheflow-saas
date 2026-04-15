'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, CheckCircle, ArrowRight, Radio, Sparkles, BarChart3, Users } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: Radio, title: 'Daily Market Briefings', desc: 'ARIA scans 5+ trending markets every day using real Google Trends data and delivers your GO signal report.' },
    { icon: Zap, title: 'Complete Starter Kits', desc: 'One click builds your full kit: product ideas, 7-day action plan, landing page copy, Reddit communities, revenue path.' },
    { icon: TrendingUp, title: 'Real Trend Validation', desc: 'Validate any keyword with 5-year Google Trends charts, 12-month growth scores, and AI opportunity analysis.' },
    { icon: BarChart3, title: 'Market Radar', desc: 'Track emerging niches across 6 categories. Watch signals move from WAIT to GO before the crowd catches on.' },
    { icon: Users, title: 'Watchlist Tracking', desc: 'Add any market to your watchlist. Get notified when signals shift so you act at the right moment.' },
    { icon: Sparkles, title: 'NVIDIA AI Analysis', desc: 'Every report is grounded in real data. NVIDIA AI interprets trends, finds gaps, spots opportunities.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: 'white' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,.06)', background: 'rgba(8,8,16,.9)', backdropFilter: 'blur(12px)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,.4)' }}>
              <Zap size={17} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.025em', color: 'white' }}>NicheFlow</div>
              <div style={{ fontSize: 8, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: -2 }}>AI SCOUT</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', textDecoration: 'none', padding: '8px 14px', borderRadius: 8 }}>Sign in</Link>
            <Link href="/auth/signup" style={{ fontSize: 13, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Start Free <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.3)', borderRadius: 99, fontSize: 11, fontWeight: 700, color: '#a78bfa', marginBottom: 28, textTransform: 'uppercase', letterSpacing: '.07em' }}>
          <Zap size={10} /> AI-Powered Market Intelligence
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5.5vw,4rem)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.06, marginBottom: 22, maxWidth: 820, margin: '0 auto 22px' }}>
          Find your next{' '}
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>profitable niche</span>
          {' '}before everyone else
        </h1>
        <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,.5)', lineHeight: 1.75, maxWidth: 580, margin: '0 auto 40px' }}>
          NicheFlow scans real Google Trends data daily, finds GO-signal markets, and builds you a complete starter kit in one click.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 30px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 32px rgba(99,102,241,.35)' }}>
            <Zap size={16} /> Get Your Free Briefing <ArrowRight size={15} />
          </Link>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>7 free generations. No credit card required.</div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.04))', border: '1px solid rgba(99,102,241,.18)', borderRadius: 22, padding: '28px 32px' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Radio size={9} /> Live Example - ARIA Daily Briefing
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
            {[
              { market: 'AI Productivity Tools', score: 84, why: 'Search volume up 340% in 90 days. Low competition in B2B segment.' },
              { market: 'Longevity Supplements', score: 78, why: 'Biohacking trend accelerating. Weak digital presence in a $4B market.' },
              { market: 'ADHD Coaching Apps', score: 71, why: 'Post-pandemic diagnosis surge. Underserved mobile-first demographic.' },
            ].map((opp, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: '16px', border: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{opp.market}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99, background: 'rgba(34,197,94,.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,.25)', flexShrink: 0, marginLeft: 8 }}>GO</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.5, marginBottom: 10 }}>{opp.why}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#22c55e' }}>{opp.score}<span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', fontWeight: 400 }}>/100</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 900, letterSpacing: '-.035em', color: 'white' }}>From zero to launched in 7 days</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {[
            { n: '01', t: 'Get Your Briefing', d: 'Click one button. ARIA scans trending markets using real Google Trends API data and finds your top GO opportunities.' },
            { n: '02', t: 'Build Your Kit', d: 'Pick an opportunity. One click generates your complete starter kit with everything you need to launch in 7 days.' },
            { n: '03', t: 'Launch Fast', d: 'Use the landing page copy, Reddit communities, and content hooks to get your first customers this week.' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: 'rgba(99,102,241,.07)', position: 'absolute', top: 10, right: 18, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Step {s.n}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 10 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.65 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 900, letterSpacing: '-.035em', color: 'white' }}>Everything to find and launch your niche</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.04))', border: '1px solid rgba(99,102,241,.2)', borderRadius: 24, padding: '44px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>Starter Kit Includes</div>
              <h2 style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 22, color: 'white' }}>Everything to launch in one week</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Real Google Trends validation score','Product ideas with pricing and build plan','Complete landing page copy (headline, bullets, CTA)','7-day step-by-step action plan','Reddit communities to post in','Viral content hooks for each platform','30-day revenue estimate and price point'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Market Score', val: '84/100 GO', color: '#22c55e' },
                { label: 'Product Idea', val: 'AI Productivity App', color: 'white' },
                { label: 'Price Point', val: '$29/month SaaS', color: 'white' },
                { label: '30-Day Revenue Est.', val: '$2,400 - $4,800', color: '#22c55e' },
                { label: 'First Action', val: 'Post in r/productivity today', color: '#8b5cf6' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,.06)' }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto 80px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))', border: '1px solid rgba(99,102,241,.22)', borderRadius: 24, padding: '52px 36px' }}>
          <div style={{ fontSize: 32, marginBottom: 18 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, letterSpacing: '-.035em', marginBottom: 14, color: 'white' }}>Start finding GO signals today</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginBottom: 30, lineHeight: 1.7 }}>Join founders using NicheFlow to find and validate profitable niches before they go mainstream.</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 34px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 32px rgba(99,102,241,.4)' }}>
            <Zap size={16} /> Get Started Free <ArrowRight size={15} />
          </Link>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', marginTop: 16 }}>7 free generations. No credit card required.</div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={11} style={{ color: 'white' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,.6)' }}>NicheFlow</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)' }}>AI-powered market intelligence for founders</div>
      </footer>
    </div>
  );
}
