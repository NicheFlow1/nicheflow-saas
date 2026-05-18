'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Zap, Search, Radio, Bot, BarChart2, TrendingUp, Settings, Flame } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/autopilot', label: 'Autopilot', icon: Zap, badge: 'NEW' },
  { href: '/trending', label: 'Trending Now', icon: Flame, badge: 'HOT' },
  { href: '/validate', label: 'Validate Trend', icon: Search },
  { href: '/radar', label: 'Market Radar', icon: Radio },
  { href: '/generator', label: 'Intelligence Engine', icon: TrendingUp },
  { href: '/ai-chat', label: 'AI Assistant', icon: Bot },
  { href: '/content', label: 'Content Studio', icon: BarChart2 },
  { href: '/projects', label: 'Past Reports', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ profile }: { profile?: any }) {
  const pathname = usePathname();
  const used = profile?.generations_used || 0;
  const limit = profile?.generations_limit || 7;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const plan = (profile?.plan || 'free').toUpperCase();

  return (
    <aside style={{ width:240,minHeight:'100vh',background:'#0a0b10',borderRight:'1px solid #1e2130',display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto' }}>
      <div style={{ padding:'20px 16px 16px',borderBottom:'1px solid #1e2130' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(99,102,241,0.35)' }}>
            <Zap size={17} color="#fff" fill="#fff"/>
          </div>
          <div>
            <div style={{ fontSize:15,fontWeight:800,color:'#f0f1f5',letterSpacing:'-0.02em',lineHeight:1.1 }}>NicheFlow</div>
            <div style={{ fontSize:9,fontWeight:700,color:'#6b7194',letterSpacing:'0.12em',textTransform:'uppercase' }}>AI SCOUT</div>
          </div>
        </div>
      </div>

      <nav style={{ flex:1,padding:'10px 8px' }}>
        <div style={{ fontSize:10,fontWeight:700,color:'#3d4160',letterSpacing:'0.1em',textTransform:'uppercase',padding:'8px 8px 4px' }}>Navigation</div>
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
          return (
            <Link key={href} href={href} style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,marginBottom:2,textDecoration:'none',background:active?'rgba(99,102,241,0.12)':'transparent',color:active?'#a5b4fc':'#6b7194',fontWeight:active?600:400,fontSize:13,transition:'all 0.15s' }}>
              <Icon size={15} style={{ flexShrink:0,color:active?'#818cf8':'#4b5280' }}/>
              <span style={{ flex:1 }}>{label}</span>
              {badge && <span style={{ fontSize:9,fontWeight:700,background:badge==='HOT'?'rgba(245,158,11,.2)':'rgba(99,102,241,0.2)',color:badge==='HOT'?'#f59e0b':'#818cf8',padding:'2px 6px',borderRadius:6,letterSpacing:'0.05em' }}>{badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding:'12px 16px 16px',borderTop:'1px solid #1e2130' }}>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,color:'#6b7194',marginBottom:6 }}>
          <span style={{ fontWeight:600,color:'#4b5280',textTransform:'uppercase',letterSpacing:'0.05em' }}>{plan}</span>
          <span>{used}/{limit}</span>
        </div>
        <div style={{ height:4,background:'#1e2130',borderRadius:2,overflow:'hidden',marginBottom:10 }}>
          <div style={{ height:'100%',width:`${pct}%`,background:used>=limit?'#ef4444':'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:2 }}/>
        </div>
        <Link href="/settings/billing" style={{ fontSize:12,color:'#7c3aed',textDecoration:'none',fontWeight:600,display:'block',marginBottom:8 }}>Upgrade to Pro →</Link>
        <button onClick={async()=>{ const { supabase } = await import('@/lib/supabase/client-singleton'); await supabase.auth.signOut(); window.location.href='/auth/login'; }} style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'none',color:'#6b7194',fontSize:12,cursor:'pointer',padding:0 }}>
          <span>→</span> Sign out
        </button>
      </div>
    </aside>
  );
}
