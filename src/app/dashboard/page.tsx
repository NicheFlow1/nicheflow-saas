'use client'
import{useEffect,useState}from'react'
import Link from'next/link'
import{supabase}from'@/lib/supabase/client-singleton'
import{Search,TrendingUp,ChevronRight,Activity,Database,Bell,Zap,Plus,CheckCircle,XCircle,Clock}from'lucide-react'

function SignalDot({v}:{v:string}){
  const c=v==='GO'?'var(--success)':v==='NO_GO'?'var(--danger)':v==='WAIT'?'var(--warning)':'var(--text-disabled)'
  return<div style={{width:7,height:7,borderRadius:'50%',background:c,flexShrink:0}}/>
}

export default function DashboardPage(){
  const[profile,setProfile]=useState<any>(null)
  const[reports,setReports]=useState<any[]>([])
  const[radarItems,setRadarItems]=useState<any[]>([])
  const[alerts,setAlerts]=useState<any[]>([])
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const uid=session.user.id
      const[{data:pr},{data:rp},{data:ri},{data:al}]=await Promise.all([
        supabase.from('profiles').select('*').eq('id',uid).single(),
        supabase.from('validation_reports').select('id,keyword,signal,overall_score,trend_score,data_sources,created_at').eq('user_id',uid).order('created_at',{ascending:false}).limit(8),
        supabase.from('radar').select('*').eq('user_id',uid).eq('is_active',true).order('overall_score',{ascending:false}).limit(5),
        supabase.from('radar_alerts').select('*').eq('user_id',uid).eq('is_read',false).order('created_at',{ascending:false}).limit(3)
      ])
      setProfile(pr);setReports(rp||[]);setRadarItems(ri||[]);setAlerts(al||[]);setLoading(false)
    })
  },[])

  async function dismissAlert(id:string){await supabase.from('radar_alerts').update({is_read:true}).eq('id',id);setAlerts(a=>a.filter(x=>x.id!==id))}

  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:400}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>

  const used=profile?.generations_used||0,limit=profile?.generations_limit||7
  const goCount=radarItems.filter(r=>r.signal==='GO').length
  const hasRealData=reports.some(r=>r.data_sources?.some((s:string)=>s.includes('Google')))

  return(
    <div>
      <div className='page-header'><h1>Dashboard</h1><p>Your trend validation workspace</p></div>

      {alerts.map(a=>(
        <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'var(--radius-lg)',marginBottom:8}}>
          <Bell size={12} style={{color:'var(--brand-purple)',flexShrink:0}}/>
          <span style={{fontSize:12,color:'var(--text-secondary)',flex:1}}>{a.message}</span>
          <button onClick={()=>dismissAlert(a.id)} style={{fontSize:10,color:'var(--text-disabled)',background:'none',border:'none',cursor:'pointer'}}>dismiss</button>
        </div>
      ))}

      <div className='grid-4' style={{marginBottom:24}}>
        {[
          {label:'Reports Run',val:reports.length,icon:'📊',bg:'rgba(99,102,241,0.1)',col:'var(--brand-purple)'},
          {label:'GO Signals',val:goCount,icon:'✅',bg:'rgba(34,197,94,0.1)',col:'var(--success)'},
          {label:'Radar Markets',val:radarItems.length,icon:'📶',bg:'rgba(6,182,212,0.1)',col:'var(--info)'},
          {label:'Credits Left',val:limit-used,icon:'⚡',bg:'rgba(245,158,11,0.1)',col:'var(--warning)'},
        ].map(({label,val,icon,bg,col})=>(
          <div key={label} className='stat-card'>
            <div className='stat-icon' style={{background:bg}}><span style={{fontSize:16}}>{icon}</span></div>
            <div className='stat-value' style={{color:col}}>{val}</div>
            <div className='stat-label'>{label}</div>
          </div>
        ))}
      </div>

      {!hasRealData&&reports.length>0&&(
        <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'var(--radius-lg)',marginBottom:16}}>
          <Database size={14} style={{color:'var(--warning)',flexShrink:0,marginTop:1}}/>
          <div><div style={{fontSize:12,fontWeight:700,color:'var(--warning)',marginBottom:2}}>SerpAPI Key Not Configured</div><div style={{fontSize:11,color:'var(--text-tertiary)'}}>Reports currently show AI-only analysis without real Google Trends data. Add your SerpAPI key in Supabase secrets to enable real data.</div></div>
        </div>
      )}

      <div className='card' style={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid var(--border-base)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><Activity size={14} style={{color:'var(--brand-purple)'}}/><span style={{fontSize:11,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Recent Validations</span></div>
          <Link href='/projects' style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--text-tertiary)',textDecoration:'none'}}>All<ChevronRight size={11}/></Link>
        </div>
        {!reports.length?(
          <div className='empty-state'>
            <p className='empty-title'>No validations yet</p>
            <p className='empty-desc'>Validate a trend to see real Google Trends data</p>
            <Link href='/validate' className='btn btn-primary btn-sm'><Search size={12}/>Validate a Trend</Link>
          </div>
        ):(
          <div>
            {reports.map((r:any)=>(
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 20px',borderBottom:'1px solid rgba(255,255,255,0.025)'}}>
                <SignalDot v={r.signal}/>
                <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',flex:1}}>{r.keyword}</span>
                {r.data_sources?.some((s:string)=>s.includes('Google'))&&<span style={{fontSize:9,padding:'1px 5px',borderRadius:3,background:'rgba(34,197,94,0.08)',color:'var(--success)',border:'1px solid rgba(34,197,94,0.15)',fontFamily:'monospace'}}>REAL DATA</span>}
                <span style={{fontSize:11,fontWeight:700,color:r.overall_score>=65?'var(--success)':r.overall_score>=40?'var(--warning)':'var(--danger)'}}>{r.overall_score||0}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='grid-3'>
        {[
          {href:'/validate',label:'Validate a Trend',desc:'Real Google Trends data analysis',icon:'🔍'},
          {href:'/radar',label:'Market Radar',desc:'Track markets over time',icon:'📶'},
          {href:'/projects',label:'All Reports',desc:'Your validation history',icon:'📊'},
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