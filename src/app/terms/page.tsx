import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: 'white', padding: '60px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontSize: 13, marginBottom: 40 }}>
          &larr; Back to NicheFlow
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 48, fontSize: 13 }}>Last updated: April 2026</p>
        {[
          { t: '1. Acceptance of Terms', c: 'By accessing or using NicheFlow ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all users, including free and paid subscribers.' },
          { t: '2. Description of Service', c: 'NicheFlow is an AI-powered market intelligence platform that provides trend analysis, niche validation, starter kit generation, and business intelligence tools. The Service uses real Google Trends data and AI models to generate insights and recommendations.' },
          { t: '3. User Accounts', c: 'You must create an account to use NicheFlow. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.' },
          { t: '4. Acceptable Use', c: 'You agree to use NicheFlow only for lawful purposes. You may not use the Service to: violate any laws or regulations, infringe on intellectual property rights, distribute spam or malicious content, attempt to reverse engineer or compromise the platform, or resell access to the Service without authorization.' },
          { t: '5. Intellectual Property', c: 'NicheFlow and its original content, features, and functionality are owned by NicheFlow and are protected by international copyright, trademark, and other intellectual property laws. AI-generated content is provided as suggestions and tools — you retain rights to content you create using the Service.' },
          { t: '6. Payment Terms', c: 'Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice. Cryptocurrency payments are processed via NowPayments and are subject to their terms.' },
          { t: '7. Limitation of Liability', c: 'NicheFlow provides market intelligence and AI-generated insights for informational purposes only. We do not guarantee the accuracy, completeness, or profitability of any analysis. We are not liable for any business decisions made based on our insights. The Service is provided "as is" without warranties of any kind.' },
          { t: '8. Privacy', c: 'Your use of NicheFlow is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We collect and process data as described in our Privacy Policy.' },
          { t: '9. Termination', c: 'We may terminate or suspend your account at any time for violations of these Terms. Upon termination, your right to use the Service ceases immediately. You may cancel your account at any time through the Settings page.' },
          { t: '10. Changes to Terms', c: 'We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or in-app notification. Continued use after changes constitutes acceptance of the new Terms.' },
          { t: '11. Contact', c: 'For questions about these Terms, please contact us through the in-app support or via email at support@nicheflow.io' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 10 }}>{s.t}</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.8 }}>{s.c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
