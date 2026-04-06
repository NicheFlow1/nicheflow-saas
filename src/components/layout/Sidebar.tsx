'use client'
import Link from 'next/link'
import{usePathname}from'next/navigation'
import{LayoutDashboard,Wand2,FolderOpen,Settings,Zap,LogOut,TrendingUp,BookmarkCheck,ChevronRight,Activity,Crosshair}from'lucide-react'
import{supabase}from'@/lib/supabase/client-singleton'

const NAV=[
  {section:'INTELLIGENCE'},
  {href:'/dashboard',label:'Hub',icon:LayoutDashboard,desc:'Overview'},
  {href:'/generator',label:'Engine',icon:Crosshair,desc:'Analyze'},
  {href:'/projects',label:'Base',icon:BookmarkCheck,desc:'Saved'},
  {section:'ACCOUNT'},
  {href:'/settings',label:'Settings',icon:Settings,desc:'Manage'},
]

export default function Sidebar({profile}:{profile:any}){
  const path=usePathname()
  const used=profile?.generations_used||0
  const limit=profile?.generations_limit||7
  const pct=Math.min((used/limit)*100,100)
  const plan=profile?.plan||'free'

  async function signOut(){
    await supabase.auth.signOut()
    window.location.href='/'
  }

  return(
    <aside className='sidebar'>
      {/* LOGO */}
      <div className='sidebar-logo'>
        <div className='logo-mark'>NF</div>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:'var(--text-primary)',letterSpacing:-0.3}}>NicheFlow</div>
          <div style={{fontSize:9,fontWeight:600,color:'var(--text-dim)',fontFamily:'monospace',letterSpacing:'0.06em',textTransform:'uppercase'}}>Intelligence OS</div>
        </div>
      </div>

      {/* NAV */}
      <nav className='sidebar-nav'>
        {NAV.map((item,i)=>{
          if('section' in item){
            return<div key={i} className='nav-section-label'>{item.section}</div>
          }
          const active=path===item.href||path.startsWith(item.href+'/')
          const Icon=item.icon
          return(
            <Link key={item.href} href={item.href} className={'nav-item '+(active?'active':'')}>
              <Icon size={14} style={{flexShrink:0,opacity:active?1:0.6}}/>
              <span style={{flex:1}}>{item.label}</span>
              {active&&<ChevronRight size={10} style={{opacity:0.4}}/>}
            </Link>
          )
        })}
      </nav>

      {/* USAGE WIDGET */}
      <div style={{padding:'0 10px 10px'}}>
        <div style={{background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:12,padding:'12px 14px',marginBottom:6}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <Zap size={11} style={{color:'var(--amber)'}}/>
              <span style={{fontSize:9,fontWeight:700,fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-dim)'}}>Credits</span>
            </div>
            <span style={{fontSize:10,fontWeight:700,color:pct>=80?'#fb7185':pct>=50?'#fbbf24':'#34d399'}}>{limit-used} left</span>
          </div>
          <div style={{height:3,background:'rgba(255,255,255,0.04)',borderRadius:3,overflow:'hidden',marginBottom:8}}>
            <div style={{height:'100%',width:pct+'%',borderRadius:3,background:pct>=80?'linear-gradient(90deg,#f43f5e,#fb7185)':pct>=50?'linear-gradient(90deg,#f59e0b,#fbbf24)':'linear-gradient(90deg,#6366f1,#8b5cf6)',transition:'width 0.5s'}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:9,color:'var(--text-muted)'}}>{used}/{limit} used</span>
            <span style={{fontSize:9,fontFamily:'monospace',fontWeight:700,padding:'1px 6px',borderRadius:4,textTransform:'uppercase',letterSpacing:'0.04em',...(plan==='free'?{color:'#a5b4fc',background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.2)'}:{color:'#fbbf24',background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.2)'})}}
            >{plan}</span>
          </div>
          {plan==='free'&&<Link href='/settings/billing' style={{display:'block',marginTop:8,fontSize:10,textAlign:'center',color:'#818cf8',textDecoration:'none',padding:'5px',background:'rgba(99,102,241,0.08)',borderRadius:6,border:'1px solid rgba(99,102,241,0.15)',transition:'all 0.15s'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(99,102,241,0.15)')} onMouseLeave={e=>(e.currentTarget.style.background='rgba(99,102,241,0.08)')}>
            Upgrade Plan
          </Link>}
        </div>
        <button onClick={signOut} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:8,fontSize:11,color:'var(--text-muted)',background:'transparent',border:'1px solid transparent',cursor:'pointer',transition:'all 0.15s'}} onMouseEnter={e=>{e.currentTarget.style.color='#fb7185';e.currentTarget.style.background='rgba(244,63,94,0.06)';e.currentTarget.style.borderColor='rgba(244,63,94,0.15)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='transparent'}}>
          <LogOut size={12}/><span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}