'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#f1f1f9', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: '20px', color: '#7c3aed', textDecoration: 'none' }}>NicheFlow</Link>
        <Link href="/dashboard" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>← Back to app</Link>
      </nav>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '48px' }}>Last updated: June 2026</p>

        {[
          { title: '1. What data we collect', body: `When you create an account, we collect your email address and any profile information you choose to provide (name, bio). When you use NicheFlow, we store your validated niches, watchlist items, generated starter kits, content pieces, and ARIA Chat conversations so you can access them later. We collect basic usage analytics (which pages you visit, which features you use) to improve the product. We do not collect payment card numbers — all payments are processed by Stripe and governed by Stripe's privacy policy.` },
          { title: '2. How we use your data', body: `We use your data to provide and improve NicheFlow. Your niche data (watchlist, validations, kits) is used by ARIA Chat to give you personalised recommendations — this context is sent to Anthropic's Claude API but is not used to train Anthropic's models. We may send you product emails (daily briefings, signal alerts, weekly digests) if you've opted in. You can manage email preferences in Settings → Notifications.` },
          { title: '3. Who we share data with', body: `We do not sell your personal data to any third party, ever. We use the following sub-processors to operate the service: Supabase (database and authentication), Anthropic (AI analysis via Claude API), LunarCrush (social trend data), Vercel (hosting), Stripe (payments), and Resend (email delivery). Each sub-processor handles data under their own privacy policies and data processing agreements.` },
          { title: '4. Data storage and security', body: `Your data is stored in Supabase databases hosted on AWS (US East region). We use row-level security so your data is only accessible by your account. All data is encrypted at rest and in transit (TLS 1.2+). We do not store your API keys in plain text — they are encrypted before storage.` },
          { title: '5. Your GDPR rights', body: `If you are located in the European Economic Area, you have the right to access your personal data, correct inaccurate data, request deletion of your data, object to processing, and request data portability. To exercise any of these rights, email us at privacy@nicheflow.ai. We will respond within 30 days.` },
          { title: '6. How to delete your account', body: `You can delete your account at any time from Settings → Profile → Delete Account. This permanently removes your email, profile, watchlist, validations, kits, and content. Some anonymised usage data may be retained for analytics purposes. Account deletion is irreversible.` },
          { title: '7. Cookies', body: `We use strictly necessary cookies for authentication (Supabase session token). We do not use advertising cookies or third-party tracking cookies. We use anonymous analytics (no cookies required) to understand feature usage.` },
          { title: '8. Changes to this policy', body: `We may update this Privacy Policy as we add new features. We will notify you by email if we make material changes. Continued use of NicheFlow after changes constitutes acceptance of the updated policy.` },
          { title: '9. Contact', body: `Questions about privacy? Email us at privacy@nicheflow.ai. For general support: support@nicheflow.ai.` },
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
