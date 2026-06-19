'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'How is the GO score calculated?',
    a: 'The GO score is a weighted formula combining Google Trends growth velocity (35%), social buzz via LunarCrush (30%), competition density (20%), and business opportunity relevance (15%). News events and viral topics are filtered out automatically — only genuine business niches receive a GO signal.'
  },
  {
    q: 'Is the data actually real?',
    a: 'Yes. Trend data comes from the Google Trends API. Social buzz data comes from LunarCrush. Keyword estimates are AI-assisted. Revenue estimates are AI projections based on market data — treat them as directional guidance, not guarantees.'
  },
  {
    q: 'How is NicheFlow different from Exploding Topics?',
    a: 'Exploding Topics shows you a database to browse. NicheFlow delivers daily AI-curated picks, builds complete starter kits, generates keyword clusters, profiles your target audience, and creates your content — all from the same niche signal. It\'s a research workflow, not just a database.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from Settings → Billing. You keep access until end of billing period. 7-day money-back guarantee on Pro and Team.'
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    desc: 'Everything you need to explore',
    color: '#6b7280',
    cta: 'Start Free — no credit card',
    ctaHref: '/auth/signup',
    featured: false,
    features: [
      '10 validations / month',
      '5 daily picks / day',
      '3 watchlist slots',
      '5 keyword searches / month',
      '3 audience analyses / month',
      '10 content generations / month',
      '20 ARIA Chat messages / month',
      'No starter kit generation',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 29, annual: 19 },
    desc: 'For serious niche hunters',
    color: '#7c3aed',
    cta: 'Start 14-day free trial',
    ctaHref: '/auth/signup?plan=pro',
    featured: true,
    badge: 'Most Popular',
    features: [
      'Unlimited validations',
      'Unlimited daily picks',
      '25 watchlist slots + signal alerts',
      'Unlimited keyword clusters',
      'Unlimited audience intelligence',
      'Unlimited content studio',
      'Unlimited ARIA Chat',
      '30 starter kit generations / month',
      'Daily morning briefing email',
      'Reports export (PDF + CSV)',
    ],
  },
  {
    name: 'Team',
    price: { monthly: 99, annual: 74 },
    desc: 'For teams building together',
    color: '#0ea5e9',
    cta: 'Start 14-day free trial',
    ctaHref: '/auth/signup?plan=team',
    featured: false,
    features: [
      'Everything in Pro',
      '5 team seats',
      'Shareable kit & report links',
      'Custom niche categories in Radar',
      'API access (500 req/day)',
      'Slack integration (briefings)',
      'White-label reports',
      'Priority support',
    ],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base, #0d0d1a)', color: 'var(--text-primary, #f1f1f9)', fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: '20px', color: '#7c3aed', textDecoration: 'none' }}>NicheFlow</Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/auth/login" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none', padding: '8px 16px' }}>Log in</Link>
          <Link href="/auth/signup" style={{ background: '#7c3aed', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', padding: '8px 18px', borderRadius: '8px' }}>Get Started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Simple, honest pricing
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '18px', margin: '0 0 36px' }}>
            Start free. Upgrade when you're ready to go all-in.
          </p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 8px 6px 18px' }}>
            <span style={{ fontSize: '14px', color: !annual ? '#f1f1f9' : '#6b7280', fontWeight: !annual ? 700 : 400 }}>Monthly</span>
            <button onClick={() => setAnnual(a => !a)}
              style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: annual ? '#7c3aed' : '#374151', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: annual ? '23px' : '3px', transition: 'left 0.2s' }} />
            </button>
            <span style={{ fontSize: '14px', color: annual ? '#f1f1f9' : '#6b7280', fontWeight: annual ? 700 : 400 }}>
              Annual
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px', marginLeft: '6px', border: '1px solid rgba(16,185,129,0.3)' }}>save 25%</span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '80px' }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: plan.featured ? `linear-gradient(145deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${plan.featured ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px', padding: '32px', position: 'relative',
              boxShadow: plan.featured ? '0 0 40px rgba(124,58,237,0.2)' : 'none',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontSize: '13px', fontWeight: 700, color: plan.color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{plan.name}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>{plan.desc}</div>
              <div style={{ marginBottom: '24px' }}>
                {plan.price.monthly === 0 ? (
                  <div style={{ fontSize: '42px', fontWeight: 900, color: '#f1f1f9' }}>Free</div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '42px', fontWeight: 900, color: '#f1f1f9' }}>${annual ? plan.price.annual : plan.price.monthly}</span>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>/mo</span>
                    </div>
                    {annual && <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>billed ${plan.price.annual * 12}/yr</div>}
                  </>
                )}
              </div>
              <Link href={plan.ctaHref} style={{
                display: 'block', textAlign: 'center', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', marginBottom: '28px',
                background: plan.featured ? '#7c3aed' : 'rgba(255,255,255,0.08)',
                color: plan.featured ? '#fff' : '#f1f1f9',
                border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}>{plan.cta}</Link>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: '13px', color: '#d1d5db' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '36px' }}>Frequently asked questions</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#f1f1f9' }}>{faq.q}</span>
                  <span style={{ color: '#6b7280', fontSize: '18px', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#9ca3af', lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div style={{ textAlign: 'center', marginTop: '80px', padding: '56px 40px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(14,165,233,0.08))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>Ready to find your GO niche?</h2>
          <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '28px' }}>Join 2,400+ founders getting daily GO signals before the crowd.</p>
          <Link href="/auth/signup" style={{ background: '#7c3aed', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', display: 'inline-block' }}>
            Start Free — no credit card required
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ color: '#4b5563', fontSize: '13px' }}>© 2026 NicheFlow. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/privacy" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>Terms</Link>
          <Link href="/about" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>About</Link>
        </div>
      </div>
    </div>
  );
}
