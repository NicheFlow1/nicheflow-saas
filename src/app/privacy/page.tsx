import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: 'white', padding: '60px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontSize: 13, marginBottom: 40 }}>
          &larr; Back to NicheFlow
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 48, fontSize: 13 }}>Last updated: April 2026</p>
        {[
          { t: 'Information We Collect', c: 'We collect information you provide directly: email address, account preferences, and content you generate using the Service. We also collect usage data including features used, pages visited, and actions taken within the platform.' },
          { t: 'How We Use Your Information', c: 'We use your information to: provide and improve the Service, personalize your experience, send important account notifications, analyze usage patterns to improve features, and communicate about plan updates or relevant features.' },
          { t: 'Data Storage', c: 'Your data is stored securely using Supabase (PostgreSQL) hosted in the EU region. We use industry-standard encryption for data at rest and in transit. We retain your data for as long as your account is active.' },
          { t: 'AI Processing', c: 'When you use NicheFlow features, your inputs (keywords, preferences) are sent to NVIDIA AI models for processing. We do not store raw API responses beyond what is necessary to display results to you.' },
          { t: 'Third-Party Services', c: 'We use: Supabase for database and authentication, NVIDIA for AI model inference, SerpAPI for Google Trends data, NowPayments for cryptocurrency payment processing, and Vercel for hosting. Each has their own privacy policies.' },
          { t: 'Cookies', c: 'We use essential cookies for authentication and session management. We do not use tracking or advertising cookies. You can control cookies through your browser settings.' },
          { t: 'Your Rights', c: 'You have the right to: access your personal data, request correction of inaccurate data, request deletion of your account and associated data, export your data, and opt out of non-essential communications.' },
          { t: 'Contact', c: 'For privacy inquiries or to exercise your rights, contact us at privacy@nicheflow.io or through the in-app Settings page.' },
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
