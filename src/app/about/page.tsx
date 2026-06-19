'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#f1f1f9', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: '20px', color: '#7c3aed', textDecoration: 'none' }}>NicheFlow</Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/pricing" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none', padding: '8px 16px' }}>Pricing</Link>
          <Link href="/auth/signup" style={{ background: '#7c3aed', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', padding: '8px 18px', borderRadius: '8px' }}>Get Started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '80px 24px' }}>
        {/* Mission */}
        <div style={{ marginBottom: '72px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Our story</div>
          <h1 style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-1px' }}>
            Built by founders who were tired of<br />
            <span style={{ color: '#7c3aed' }}>drowning in browser tabs</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '17px', lineHeight: 1.8, maxWidth: '620px' }}>
            We built NicheFlow because every niche research workflow was the same: hours of Google Trends tabs, manual keyword research, guessing about audience demographics, and zero clarity on whether the opportunity was real or just noise.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '17px', lineHeight: 1.8, maxWidth: '620px', marginTop: '16px' }}>
            We automated the whole thing. One niche signal in — full market intelligence out.
          </p>
        </div>

        {/* What we believe */}
        <div style={{ marginBottom: '72px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>What we believe</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              { title: 'Speed is a moat', body: 'The best niche opportunities are available to everyone — but only for a short window. NicheFlow gives you the signal before the crowd arrives.' },
              { title: 'Data beats intuition', body: 'Gut feeling is a starting point. GO signals are a foundation. We combine real trend data, social buzz, competition analysis, and AI reasoning so you make decisions on evidence.' },
              { title: 'Research should ship, not stall', body: 'A validated niche with a starter kit, keyword clusters, audience profile, and content plan is 10× more likely to become a real business than a niche you\'re still researching in a Notion doc.' },
              { title: 'Tools should connect', body: 'Every insight you generate in NicheFlow feeds the next step automatically. No more copy-pasting niche names between 6 different tools.' },
            ].map(b => (
              <div key={b.title} style={{ display: 'flex', gap: '20px', padding: '24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed', flexShrink: 0, marginTop: '8px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{b.title}</div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product overview */}
        <div style={{ marginBottom: '72px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>What NicheFlow does</h2>
          <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>NicheFlow monitors thousands of niche signals across Google Trends, social platforms (via LunarCrush), and competitive data — then distills them into daily GO signals for your specific interests.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
            {[
              'Daily AI-curated niche picks with GO / WAIT / WATCH signals',
              'Full niche validation in one click — score, competition, revenue',
              'Keyword cluster generation for SEO and content strategy',
              'Audience intelligence: demographics, pain points, willingness to pay',
              'Autopilot starter kit: landing page copy, product ideas, 7-day plan',
              'Content studio: social posts, blog outlines, thread scripts',
              'ARIA Chat: your personal market intelligence analyst',
              'Trend Radar: track and compare niches over time',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '56px 40px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(14,165,233,0.06))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>Find your GO niche today</h2>
          <p style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '28px' }}>Free to start. No credit card required.</p>
          <Link href="/auth/signup" style={{ background: '#7c3aed', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
            Start for free →
          </Link>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ color: '#4b5563', fontSize: '13px' }}>© 2026 NicheFlow</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/privacy" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>Terms</Link>
          <Link href="/pricing" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>Pricing</Link>
        </div>
      </div>
    </div>
  );
}
