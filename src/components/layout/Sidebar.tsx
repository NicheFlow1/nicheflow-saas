'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',       icon: '🏠', label: 'Dashboard' },
  { href: '/daily-picks',     icon: '⚡', label: 'Daily Picks' },
  { href: '/trending',        icon: '🔥', label: 'Trending' },
  { href: '/validate',        icon: '✅', label: 'Validate Niche' },
  { href: '/keywords',        icon: '🔑', label: 'Keywords' },
  { href: '/audience',        icon: '👥', label: 'Audience' },
  { href: '/radar',           icon: '📡', label: 'Radar' },
  { href: '/generator',       icon: '⚙️', label: 'Generator' },
  { href: '/content',         icon: '📝', label: 'Content Studio' },
  { href: '/autopilot',       icon: '🤖', label: 'Autopilot' },
  { href: '/ai-chat',         icon: '💬', label: 'AI Chat' },
  { href: '/projects',        icon: '📁', label: 'Projects' },
  { href: '/watchlist',       icon: '👁️', label: 'Watchlist' },
  { href: '/settings',        icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{
      position:'fixed', left:0, top:0, bottom:0, width:240,
      background:'var(--bg-card)', borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column', zIndex:100, overflowY:'auto',
    }}>
      {/* Logo */}
      <div style={{padding:'20px 20px 16px', borderBottom:'1px solid var(--border)'}}>
        <Link href="/dashboard" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'8px'}}>
          <div style={{width:32, height:32, background:'var(--accent)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>⚡</div>
          <span style={{fontWeight:800, fontSize:'16px', color:'var(--text-primary)'}}>NicheFlo</span>
          <span style={{fontSize:'10px', background:'var(--accent)', color:'#fff', borderRadius:'4px', padding:'1px 5px', fontWeight:700}}>PRO</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{flex:1, padding:'10px 10px'}}>
        {NAV.map(({href, icon, label}) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding:'9px 12px', borderRadius:'8px', marginBottom:'2px',
              background: active ? 'var(--accent)' : 'transparent',
              textDecoration:'none',
              transition:'background 0.15s',
            }}>
              <span style={{fontSize:'15px'}}>{icon}</span>
              <span style={{fontSize:'13px', fontWeight: active?700:500, color: active?'#fff':'var(--text-secondary)'}}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{padding:'12px', borderTop:'1px solid var(--border)'}}>
        <div style={{background:'var(--bg-elevated)', borderRadius:'10px', padding:'12px'}}>
          <div style={{fontSize:'11px', color:'var(--text-muted)', marginBottom:'4px'}}>Monthly Credits</div>
          <div style={{height:6, background:'var(--border)', borderRadius:999, overflow:'hidden'}}>
            <div style={{height:'100%', width:'62%', background:'var(--accent)', borderRadius:999}}/>
          </div>
          <div style={{fontSize:'11px', color:'var(--text-muted)', marginTop:'4px'}}>620 / 1,000 used</div>
        </div>
      </div>
    </aside>
  );
}
