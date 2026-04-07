'use client'
import{useEffect,useState}from'react'
import Link from'next/link'
import{supabase}from'@/lib/supabase/client-singleton'
import{Wand2,TrendingUp,ChevronRight,Activity}from'lucide-react'

function Badge({v,type}:{v:string,type:'go'|'score'}){
  if(type==='go'){
    if(v==='GO')return<span className='badge badge-go'>GO</span>
    if(v==='WAIT')return<span className='badge badge-wait'>WAIT</span>
    if(v==='NO_GO')return<span className='badge badge-nogo'>NO GO</span>
    return null
  }
  const n=Number(v)
  return<span className={'badge '+(n>=80?'badge-go':n>=60?'badge-wait':'badge-nogo')}>{v}</span>
}

export default function DashboardPage(){
  const[profile,setProfile]=useState<any>(null)
  const[opps,setOpps]=useState<any[]>([])
  const[saved,setSaved]=useState(0)
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const uid=session.user.id
      const[{data:pr},{data:oo},{data:sv}]=await Promise.all([
        supabase.from('profiles').select('*').eq('id',uid).single(),
        supabase.from('opportunities').select('*').eq('user_id',uid).order('overall_score',{ascending:false}).limit(8),
        supabase.from('saved_opportunities').select('id',{count:'exact'}).eq('user_id',uid)
      ])
      setProfile(pr);setOpps(oo||[]);setSaved(sv?.length||0);setLoading(false)
    })
  },[])
  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:400,flexDirection:'column',gap:12}}><div className='spinner' style={{width:24,height:24,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/><p style={{fontSize:11,color:'var(--text-disabled)',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em'}}>Loading...</p></div>
  const used=profile?.generations_used||0,limit=profile?.generations_limit||7
  const goCount=opps.filter(o=>o.go_no_go==='GO').length
  const stats=[
    {label:'Analyzed',val:opps.length,icon:'🎯',bg:'rgba(99,102,241,0.1)',col:'var(--brand-purple)'},
    {label:'GO Signals',val:goCount,icon:'✅',bg:'rgba(34,197,94,0.1)',col:'var(--success)'},
    {label:'Saved',val:saved,icon:'🔖',bg:'rgba(236,72,153,0.1)',col:'var(--brand-pink)'},
    {label:'Credits',val:limit-used,icon:'⚡',bg:'rgba(245,158,11,0.1)',col:'var(--warning)'},
  ]
  return(
    <div>
      <div className='page-header'><h1>Intelligence Hub</h1><p>Your market discovery command center</p></div>
      <div className='grid-4' style={{marginBottom:24}}>
        {stats.map(({label,val,icon,bg,col})=>(
          <div key={label} className='stat-card'>
            <div className='stat-icon' style={{background:bg}}><span style={{fontSize:16}}>{icon}</span></div>
            <div className='stat-value' style={{color:col}}>{val}</div>
            <div className='stat-label'>{label}</div>
          </div>
        ))}
      </div>
      <div className='card' style={{marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid var(--border-base)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><Activity size={14} style={{color:'var(--brand-purple)'}}/><span style={{fontSize:11,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Top Opportunities</span></div>
          <Link href='/projects' style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--text-tertiary)',textDecoration:'none'}}>View all<ChevronRight size={11}/></Link>
        </div>
        {!opps.length?(
          <div className='empty-state'>
            <div className='empty-icon'><Wand2 size={20} style={{color:'var(--brand-purple)',opacity:0.4}}/></div>
            <p className='empty-title'>No intelligence data yet</p>
            <p className='empty-desc'>Run your first market analysis</p>
            <Link href='/generator' className='btn btn-primary btn-sm'>Run Analysis</Link>
          </div>
        ):(
          <div>
            {opps.map((o:any)=>(
              <div key={o.id} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                <div className='opp-row-icon'><TrendingUp size={15} style={{color:'var(--brand-purple)'}}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3,flexWrap:'wrap'}}>
                    <span style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>{o.title}</span>
                    <Badge v={o.go_no_go||''} type='go'/>
                  </div>
                  <div style={{display:'flex',gap:8}}><span className='tag'>{o.lifecycle_stage||'emerging'}</span><span style={{fontSize:10,color:'var(--text-disabled)'}}>{o.niche?.slice(0,35)}</span></div>
                </div>
                <Badge v={String(o.overall_score)} type='score'/>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='grid-3'>
        {[
          {href:'/generator',label:'Deep Analysis',desc:'Analyze any market surgically',emoji:'🔬'},
          {href:'/generator',label:'Discover Niches',desc:'Find 3 hidden opportunities',emoji:'⚡'},
          {href:'/projects',label:'Intelligence Base',desc:'All analyzed opportunities',emoji:'📊'},
        ].map(({href,label,desc,emoji})=>(
          <Link key={label} href={href} className='card card-hover' style={{padding:18,textDecoration:'none',display:'block'}}>
            <div style={{fontSize:22,marginBottom:10}}>{emoji}</div>
            <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',marginBottom:3}}>{label}</div>
            <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}