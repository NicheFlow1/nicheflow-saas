'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{Plus,TrendingUp,Zap,Bell,Trash2,RefreshCw,Search,ChevronRight}from'lucide-react'
import Link from'next/link'

const SIGNAL_CLASSES:Record<string,string>={
  GO:'badge badge-go',WAIT:'badge badge-wait',NO_GO:'badge badge-nogo',TRACKING:'badge badge-neutral'
}
const STAGE_COLOR:Record<string,string>={
  birth:'var(--brand-purple)',emerging:'var(--info)',growing:'var(--success)',
  peaking:'var(--warning)',saturating:'#f97316',declining:'var(--danger)',unknown:'var(--text-tertiary)'
}

function ScoreMini({score}:{score:number}){
  const c=score>=80?'var(--success)':score>=60?'var(--warning)':'var(--danger)'
  const r=14,circ=2*Math.PI*r,dash=circ*(score/100)
  return(
    <svg width={36} height={36} style={{transform:'rotate(-90deg)',flexShrink:0}}>
      <circle cx={18} cy={18} r={r} fill='none' stroke='var(--bg-subtle)' strokeWidth={2.5}/>
      <circle cx={18} cy={18} r={r} fill='none' stroke={c} strokeWidth={2.5}
        strokeDasharray={circ} strokeDashoffset={circ-dash} strokeLinecap='round'/>
      <text x={18} y={19} textAnchor='middle' dominantBaseline='middle'
        fill={c} fontSize={9} fontWeight='bold'
        style={{transform:'rotate(90deg)',transformOrigin:'18px 18px'}}>{score||'?'}</text>
    </svg>
  )
}

export default function RadarPage(){
  const[session,setSession]=useState<any>(null)
  const[radar,setRadar]=useState<any[]>([])
  const[alerts,setAlerts]=useState<any[]>([])
  const[loading,setLoading]=useState(true)
  const[adding,setAdding]=useState(false)
  const[newMarket,setNewMarket]=useState('')
  const[newDesc,setNewDesc]=useState('')
  const[analyzing,setAnalyzing]=useState<string|null>(null)
  const[search,setSearch]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session:s}})=>{
      if(!s)return
      setSession(s)
      const[{data:r},{data:a}]=await Promise.all([
        supabase.from('radar').select('*').eq('user_id',s.user.id).eq('is_active',true).order('overall_score',{ascending:false}),
        supabase.from('radar_alerts').select('*').eq('user_id',s.user.id).eq('is_read',false).order('created_at',{ascending:false}).limit(5)
      ])
      setRadar(r||[]);setAlerts(a||[]);setLoading(false)
    })
  },[])

  async function addToRadar(){
    if(!newMarket.trim()||!session)return
    const{data,error}=await supabase.from('radar').insert({
      user_id:session.user.id,market:newMarket.trim(),description:newDesc.trim()||null,signal:'TRACKING'
    }).select().single()
    if(!error&&data){setRadar(r=>[data,...r]);setNewMarket('');setNewDesc('');setAdding(false)}
  }

  async function analyzeEntry(entry:any){
    if(!session)return
    setAnalyzing(entry.id)
    try{
      const res=await fetch(FN,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
        body:JSON.stringify({niche:entry.market,mode:'analyze',radar_id:entry.id})
      })
      const data=await res.json()
      if(res.ok&&data.opportunities?.[0]){
        const opp=data.opportunities[0]
        setRadar(r=>r.map(x=>x.id===entry.id?{...x,
          overall_score:opp.overall_score,demand_score:opp.demand_score,
          competition_score:opp.competition_score,timing_score:opp.timing_score,
          signal:opp.go_no_go==='ANALYZING'?'TRACKING':(opp.go_no_go||'TRACKING'),
          lifecycle_stage:opp.lifecycle_stage,entry_window:opp.entry_window,
          last_analyzed_at:new Date().toISOString(),analysis_count:(x.analysis_count||0)+1
        }:x))
      }
    }finally{setAnalyzing(null)}
  }

  async function removeEntry(id:string){
    await supabase.from('radar').update({is_active:false}).eq('id',id)
    setRadar(r=>r.filter(x=>x.id!==id))
  }

  async function dismissAlert(id:string){
    await supabase.from('radar_alerts').update({is_read:true}).eq('id',id)
    setAlerts(a=>a.filter(x=>x.id!==id))
  }

  const filtered=radar.filter(r=>!search||r.market.toLowerCase().includes(search.toLowerCase()))
  const goCount=radar.filter(r=>r.signal==='GO').length

  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:400}}><div className='spinner' style={{width:22,height:22,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>

  return(
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 className='page-header' style={{fontSize:'1.5rem',fontWeight:900,letterSpacing:'-0.03em',marginBottom:3}}>Market Radar</h1>
          <p style={{fontSize:13,color:'var(--text-tertiary)'}}>{radar.length} markets tracked &mdash; {goCount} GO signals</p>
        </div>
        <button onClick={()=>setAdding(a=>!a)} className='btn btn-primary'><Plus size={14}/>Add Market</button>
      </div>

      {/* ALERTS */}
      {alerts.length>0&&(
        <div style={{marginBottom:20}}>
          {alerts.map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'var(--radius-lg)',marginBottom:6}}>
              <Bell size={13} style={{color:'var(--brand-purple)',flexShrink:0}}/>
              <span style={{fontSize:12,color:'var(--text-secondary)',flex:1}}>{a.message}</span>
              <button onClick={()=>dismissAlert(a.id)} style={{fontSize:10,color:'var(--text-disabled)',background:'none',border:'none',cursor:'pointer',padding:'2px 6px'}}>dismiss</button>
            </div>
          ))}
        </div>
      )}

      {/* ADD FORM */}
      {adding&&(
        <div className='card' style={{padding:18,marginBottom:20}}>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Add Market to Radar</h3>
          <input value={newMarket} onChange={e=>setNewMarket(e.target.value)}
            placeholder='Market or niche to track... e.g. AI tools for lawyers, longevity supplements'
            className='input' style={{marginBottom:8}}/>
          <input value={newDesc} onChange={e=>setNewDesc(e.target.value)}
            placeholder='Optional notes...' className='input' style={{marginBottom:12}}/>
          <div style={{display:'flex',gap:8}}>
            <button onClick={addToRadar} disabled={!newMarket.trim()} className='btn btn-primary btn-sm'>Add to Radar</button>
            <button onClick={()=>setAdding(false)} className='btn btn-ghost btn-sm'>Cancel</button>
          </div>
        </div>
      )}

      {!radar.length?(
        <div className='card'>
          <div className='empty-state'>
            <div className='empty-icon' style={{margin:'0 auto 16px'}}><TrendingUp size={22} style={{color:'var(--brand-purple)',opacity:0.5}}/></div>
            <p className='empty-title'>Your radar is empty</p>
            <p className='empty-desc'>Add markets you want to track. NicheFlow scores them and alerts you when timing is right.</p>
            <button onClick={()=>setAdding(true)} className='btn btn-primary btn-sm'><Plus size={12}/>Add your first market</button>
          </div>
        </div>
      ):(
        <div>
          <div style={{marginBottom:14}}>
            <div className='search-wrap'><Search size={12} className='search-icon'/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search your radar...' className='input search-input' style={{maxWidth:340}}/></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {filtered.map(entry=>(
              <div key={entry.id} className='card card-hover' style={{padding:'16px 18px'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <ScoreMini score={entry.overall_score||0}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                      <span style={{fontSize:14,fontWeight:800,color:'var(--text-primary)'}}>{entry.market}</span>
                      <span className={SIGNAL_CLASSES[entry.signal]||SIGNAL_CLASSES.TRACKING}>{entry.signal}</span>
                      {entry.lifecycle_stage&&entry.lifecycle_stage!=='unknown'&&(
                        <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'var(--bg-muted)',color:STAGE_COLOR[entry.lifecycle_stage]||'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{entry.lifecycle_stage}</span>
                      )}
                    </div>
                    {entry.description&&<p style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:4}}>{entry.description}</p>}
                    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                      {entry.overall_score>0&&<span style={{fontSize:10,color:'var(--text-disabled)'}}>Score <span style={{fontWeight:700,color:'var(--text-secondary)'}}>{entry.overall_score}</span></span>}
                      {entry.entry_window&&entry.entry_window!=='TBD'&&<span style={{fontSize:10,color:'var(--text-disabled)'}}>Entry <span style={{fontWeight:700,color:'var(--warning)'}}>{entry.entry_window}</span></span>}
                      {entry.last_analyzed_at&&<span style={{fontSize:10,color:'var(--text-disabled)'}}>Analyzed {new Date(entry.last_analyzed_at).toLocaleDateString()}</span>}
                      {!entry.last_analyzed_at&&<span style={{fontSize:10,color:'var(--text-disabled)'}}>Not yet analyzed</span>}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:6,flexShrink:0,alignItems:'center'}}>
                    <button
                      onClick={()=>analyzeEntry(entry)}
                      disabled={analyzing===entry.id}
                      className='btn btn-ghost btn-sm'
                      title='Run analysis'
                    >
                      {analyzing===entry.id
                        ?<div className='spinner' style={{width:12,height:12,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/>
                        :<RefreshCw size={12}/>
                      }
                      {analyzing!==entry.id&&'Analyze'}
                    </button>
                    <Link href={'/generator?market='+encodeURIComponent(entry.market)+'&radar_id='+entry.id} className='btn btn-ghost btn-sm'><Zap size={12}/>Deep</Link>
                    <button onClick={()=>removeEntry(entry.id)} className='btn btn-danger btn-sm' title='Remove'><Trash2 size={12}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}