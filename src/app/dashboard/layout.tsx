import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/layout/AuthGuard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="app-shell">
        <Sidebar />
        <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
          <TopBar />
          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
