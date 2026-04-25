import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NicheFlow - AI Market Intelligence',
  description: 'Find profitable niches before everyone else. Real Google Trends data, GO signal analysis, and complete starter kits in one click.',
};

// v2.0.1 - cache bust
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
