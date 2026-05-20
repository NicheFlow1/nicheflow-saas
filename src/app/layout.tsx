import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NicheFlow",
  description: "AI-powered niche market intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('nicheflow-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
