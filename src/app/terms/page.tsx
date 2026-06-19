'use client';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#f1f1f9', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: '20px', color: '#7c3aed', textDecoration: 'none' }}>NicheFlow</Link>
        <Link href="/dashboard" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>← Back to app</Link>
      </nav>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '48px' }}>Last updated: June 2026</p>

        {[
          { title: '1. Service description', body: `NicheFlow is a market intelligence platform that helps founders identify, validate, and act on business niche opportunities. The service includes niche validation scoring, trend tracking, keyword analysis, audience intelligence, content generation, and AI-powered starter kit creation.` },
          { title: '2. GO signals are indicators, not guarantees', body: `NicheFlow's GO signals, scores, and analysis are data-driven indicators based on trend, social, and competitive signals. They are not guarantees of business success. Revenue estimates shown are AI projections based on market data — they are directional guidance only, not financial advice. NicheFlow is not liable for any business decisions made based on platform data.` },
          { title: '3. Acceptable use', body: `You may use NicheFlow for lawful business research and content creation purposes. You may not use NicheFlow to scrape or resell data, build competing products, generate content that violates third-party rights, or circumvent platform usage limits. Accounts found in violation may be suspended without refund.` },
          { title: '4. Intellectual property', body: `You retain full ownership of all starter kits, content, and analysis you generate using NicheFlow. NicheFlow retains ownership of its platform, algorithms, scoring models, and underlying technology. You grant NicheFlow a limited license to process your inputs solely to deliver the service.` },
          { title: '5. Subscription and billing', body: `Subscriptions are billed monthly or annually as selected at signup. You can cancel at any time from Settings → Billing. Cancellation takes effect at the end of the current billing period — you retain access until then. Pro and Team plans include a 7-day money-back guarantee from first payment. Annual plans are non-refundable after 7 days.` },
          { title: '6. Cancellation and downgrade', body: `On cancellation or downgrade to Starter, your saved data (watchlist, validations, kits) is retained for 90 days. After 90 days, excess data beyond Starter limits may be deleted. We will notify you by email before any deletion.` },
          { title: '7. Limitation of liability', body: `To the maximum extent permitted by law, NicheFlow's liability for any claim arising from use of the service is limited to the amount you paid in the 12 months preceding the claim. NicheFlow is not liable for indirect, incidental, or consequential damages including lost profits or business opportunities.` },
          { title: '8. Changes to terms', body: `We may update these terms as the service evolves. We will notify you by email at least 14 days before material changes take effect. Continued use after that date constitutes acceptance.` },
          { title: '9. Governing law', body: `These terms are governed by the laws of the jurisdiction where NicheFlow is incorporated. Any disputes will be resolved through binding arbitration, except where prohibited by law.` },
          { title: '10. Contact', body: `For legal inquiries: legal@nicheflow.ai. For support: support@nicheflow.ai.` },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f1f9', marginBottom: '10px' }}>{section.title}</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
