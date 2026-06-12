import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NicheFlow — AI Niche Research',
  description: 'Discover, validate, and monetize profitable niches with AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{margin:0, background:'var(--bg-base)', color:'var(--text-primary)'}}>
        <Sidebar />
        <main style={{marginLeft:240, minHeight:'100vh', background:'var(--bg-base)'}}>
          {children}
        </main>
      </body>
    </html>
  );
}
