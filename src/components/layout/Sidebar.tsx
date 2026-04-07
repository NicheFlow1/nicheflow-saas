'use client'
import Link from 'next/link'
import{usePathname}from'next/navigation'
import{LayoutDashboard,Wand2,TrendingUp,Settings,LogOut,Radio}from'lucide-react'
import{supabase}from'@/lib/supabase/client-singleton'
import type{Profile}from'@/types/database'
import{PLAN_LIMITS}from'@/types/database'

const NAV=[
  {href:'/dashboard',label:'Dashboard',icon:LayoutDashboard},
  {href:'/radar',label:'Market Radar',icon:Radio},
  {href:'/generator',label:'Intelligence',icon:Wand2},
  {href:'/projects',label:'Opportunities',icon:TrendingUp},
  {href:'/settings',label:'Settings',icon:Settings},
]

export default function Sidebar({profile}:{profile:Profile|null}){
  const pathname=usePathname()
  const plan=(profile?.plan||'free') as keyof typeof PLAN_LIMITS
  const used=profile?.generations_used||0
  const limit=profile?.generations_limit||7
  const pct=Math.min((used/limit)*100,100)
  async function signOut(){await supabase.auth.signOut();window.location.href='/'}
  return(
    <aside className='sidebar'>
      <div className='sidebar-logo'>
        <div className='logo-mark'>NF</div>
        <div><div className='logo-text'>NicheFlow</div><div className='logo-badge'>Intelligence OS</div></div>
      </div>
      <nav className='nav-section'>
        <div className='nav-label'>Navigation</div>
        {NAV.map(({href,label,icon:Icon})=>{
          const active=pathname===href||pathname.startsWith(href+'/')
          return(<Link key={href} href={href} className={'nav-item'+(active?' active':'')}><Icon size={14}/>{label}</Link>)
        })}
      </nav>
      <div className='sidebar-footer'>
        <div className='usage-widget'>
          <div className='usage-label'><span style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{PLAN_LIMITS[plan]?.label||'Free'}</span><span style={{fontSize:10,color:'var(--text-disabled)'}}>{used}/{limit}</span></div>
          <div className='usage-track'><div className='usage-fill' style={{width:pct+'%'}}/></div>
          {plan==='free'&&<Link href='/settings/billing' style={{display:'block',marginTop:8,fontSize:10,color:'var(--brand-purple)',textDecoration:'none',fontWeight:600}}>Upgrade &rarr;</Link>}
        </div>
        <button className='btn-signout' onClick={signOut}><LogOut size={13}/>Sign out</button>
      </div>
    </aside>
  )
}