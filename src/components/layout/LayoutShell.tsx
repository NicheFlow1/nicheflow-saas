'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

// Pages that should NOT show the sidebar
const NO_SIDEBAR = ['/', '/auth/login', '/auth/signup', '/auth/callback'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !NO_SIDEBAR.includes(pathname) && !pathname.startsWith('/auth/');

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main style={{ marginLeft: 220, minHeight: '100vh', background: 'var(--bg-base)' }}>
        {children}
      </main>
    </>
  );
}
