import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NicheFlow - AI Market Intelligence',
  description: 'Find profitable niches before they go mainstream. Real Google Trends data + AI analysis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('nf-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
