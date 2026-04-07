'use client'
import{useEffect,useState}from'react'
import Link from'next/link'
import{supabase}from'@/lib/supabase/client-singleton'
import{Radar,Wand2,Bell,TrendingUp,ChevronRight,Zap,Plus,Activity}from'lucide-react'

export default function DashboardPage(){
  const[profile,setProfile]=useState<any>(null)
  const[radarItems,setRadarItems]=useState<any[]>([])
  const[alerts,setAlerts]=useState<any[]>([])
  const[topOpps,setTopOpps]=useState<any[]>([])
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const uid=session.user.id
      const[{data:pr},{data:ri},{data:al},{data:oo}]=await Promise.all([
        supabase.from('profiles').select('*').eq('id',uid).single(),
        supabase.from('radar').select('*').eq('user_id',uid).eq('is_active',true).order('overall_score',{ascending:false}).limit(5),
        supabase.from('radar_alerts').select('*').eq('user_id',uid).eq('is_read',false).order('created_at',{ascending:false}).limit(3),
        supabase.from('opportunities').select('id,title,overall_score,go_no_go,niche,lifecycle_stage').eq('user_id',uid).order('overall_score',{ascending:false}).limit(6)
      ])
      setProfile(pr);setRadarItems(ri||[]);setAlerts(al||[]);setTopOpps(oo||[]);setLoading(false)
    })
  },[])

  async function dismissAlert(id:string){
    await supabase.from('radar_alerts').update({is_read:true}).eq('id',id)
    setAlerts(a=>a.filter(x=>x.id!==id))
  }

  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:400,flexDirection:'column',gap:12}}><div className='spinner' style={{width:22,height:22,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>

  const used=profile?.generations_used||0,limit=profile?.generations_limit||7
  const goCount=radarItems.filter(r=>r.signal==='GO').length

  return(
    <div>
      <div className='page-header'><h1>Intelligence Hub</h1><p>Your market discovery command center</p></div>

      {/* Alerts */}
      {alerts.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}><Bell size={11}/>Alerts</div>
          {alerts.map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'var(--radius-lg)',marginBottom:6}}>
              <Zap size={12} style={{color:'var(--brand-purple)',flexShrink:0}}/>
              <span style={{fontSize:12,color:'var(--text-secondary)',flex:1}}>{a.message}</span>
              <button onClick={()=>dismissAlert(a.id)} style={{fontSize:10,color:'var(--text-disabled)',background:'none',border:'none',cursor:'pointer'}}>dismiss</button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className='grid-4' style={{marginBottom:24}}>
        {[
          {label:'Radar Markets',val:radarItems.length,icon:'📶',bg:'rgba(99,102,241,0.1)',col:'var(--brand-purple)'},
          {label:'GO Signals',val:goCount,icon:'✅',bg:'rgba(34,197,94,0.1)',col:'var(--success)'},
          {label:'Analyses Run',val:topOpps.length,icon:'🎯',bg:'rgba(6,182,212,0.1)',col:'var(--info)'},
          {label:'Credits Left',val:limit-used,icon:'⚡',bg:'rgba(245,158,11,0.1)',col:'var(--warning)'},
        ].map(({label,val,icon,bg,col})=>(
          <div key={label} className='stat-card'>
            <div className='stat-icon' style={{background:bg}}><span style={{fontSize:16}}>{icon}</span></div>
            <div className='stat-value' style={{color:col}}>{val}</div>
            <div className='stat-label'>{label}</div>
          </div>
        ))}
      </div>

      {/* Radar summary */}
      <div className='card' style={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid var(--border-base)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><Activity size={14} style={{color:'var(--brand-purple)'}}/><span style={{fontSize:11,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Active Radar</span></div>
          <Link href='/radar' style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--text-tertiary)',textDecoration:'none'}}>Manage<ChevronRight size={11}/></Link>
        </div>
        {!radarItems.length?(
          <div className='empty-state'>
            <p className='empty-title'>No markets on radar</p>
            <p className='empty-desc'>Add markets to track and get GO signals automatically</p>
            <Link href='/radar' className='btn btn-primary btn-sm'><Plus size={12}/>Add to Radar</Link>
          </div>
        ):(
          <div>
            {radarItems.map(r=>(
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 20px',borderBottom:'1px solid rgba(255,255,255,0.025)'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:r.signal==='GO'?'var(--success)':r.signal==='WAIT'?'var(--warning)':r.signal==='NO_GO'?'var(--danger)':'var(--text-disabled)',flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',flex:1}}>{r.market}</span>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>{r.overall_score>0?r.overall_score+'/100':'Not scored'}</span>
                <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:r.signal==='GO'?'var(--surface-go)':r.signal==='WAIT'?'var(--surface-wait)':r.signal==='NO_GO'?'var(--surface-nogo)':'var(--bg-muted)',color:r.signal==='GO'?'var(--success)':r.signal==='WAIT'?'var(--warning)':r.signal==='NO_GO'?'var(--danger)':'var(--text-tertiary)'}}>{r.signal}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className='grid-3'>
        {[
          {href:'/radar',label:'Market Radar',desc:'Track and score markets over time',icon:'📶'},
          {href:'/generator',label:'Run Analysis',desc:'Deep-dive any market instantly',icon:'🔬'},
          {href:'/projects',label:'Intelligence Base',desc:'All past analyses',icon:'📊'},
        ].map(({href,label,desc,icon})=>(
          <Link key={label} href={href} className='card card-hover' style={{padding:18,textDecoration:'none',display:'block'}}>
            <div style={{fontSize:22,marginBottom:10}}>{icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',marginBottom:3}}>{label}</div>
            <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}