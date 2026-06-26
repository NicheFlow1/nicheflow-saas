'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const NO_SIDEBAR = ['/', '/auth/login', '/auth/signup', '/auth/callback', '/privacy', '/terms', '/pricing', '/about'];
const SIDEBAR_W = 260;

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !NO_SIDEBAR.includes(pathname) && !pathname.startsWith('/auth/');

  if (!showSidebar) return <>{children}</>;

  return (
    <>
      <Sidebar />
      <main style={{
        marginLeft: SIDEBAR_W,
        minHeight: '100vh',
        background: 'var(--bg-base)',
      }}>
        {children}
      </main>
    </>
  );
}
