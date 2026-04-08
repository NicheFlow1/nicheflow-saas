'use client'
import{useEffect,useState,Suspense}from'react'
import{useSearchParams}from'next/navigation'
import{supabase}from'@/lib/supabase/client-singleton'
import{TrendingUp,AlertTriangle,CheckCircle,XCircle,Clock,Sparkles,Search,Database,ArrowUpRight,ArrowDownRight,Minus,BookmarkPlus}from'lucide-react'

const FN='https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/validate-keyword'

function SignalBadge({v}:{v:string}){
  if(v==='GO')return<span className='badge badge-go' style={{fontSize:11,padding:'4px 10px'}}><CheckCircle size={10}/>GO</span>
  if(v==='NO_GO')return<span className='badge badge-nogo' style={{fontSize:11,padding:'4px 10px'}}><XCircle size={10}/>NO GO</span>
  if(v==='WAIT')return<span className='badge badge-wait' style={{fontSize:11,padding:'4px 10px'}}><Clock size={10}/>WAIT</span>
  return<span className='badge badge-neutral'>ANALYZING</span>
}

function TrendArrow({pct}:{pct:number}){
  if(pct>=10)return<span style={{color:'var(--success)',display:'flex',alignItems:'center',gap:2,fontSize:12,fontWeight:700}}><ArrowUpRight size={14}/>+{pct}%</span>
  if(pct<=-10)return<span style={{color:'var(--danger)',display:'flex',alignItems:'center',gap:2,fontSize:12,fontWeight:700}}><ArrowDownRight size={14}/>{pct}%</span>
  return<span style={{color:'var(--text-tertiary)',display:'flex',alignItems:'center',gap:2,fontSize:12}}><Minus size={12}/>{pct}%</span>
}

function TrendChart({data}:{data:Array<{date:string,value:number}>}){
  if(!data||data.length<2)return<div style={{padding:'20px',textAlign:'center',color:'var(--text-disabled)',fontSize:11}}>No chart data</div>
  const values=data.map(d=>d.value)
  const max=Math.max(...values)||1,min=Math.min(...values)
  const w=600,h=110,pad=8
  const xStep=(w-pad*2)/(data.length-1)
  const yScale=(h-pad*2)/Math.max(max-min,1)
  const pts=data.map((d,i)=>[(pad+i*xStep),(h-pad-(d.value-min)*yScale)])
  const pathD=pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')
  const areaD=pathD+' L'+(pts[pts.length-1][0].toFixed(1))+','+(h-pad)+' L'+pad+','+(h-pad)+' Z'
  const labels=data.filter((_,i)=>i%(Math.floor(data.length/5)||1)===0||i===data.length-1)
  return(
    <div style={{width:'100%'}}>
      <svg viewBox={'0 0 '+w+' '+h} style={{width:'100%',height:110,display:'block'}}>
        <defs><linearGradient id='tg' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#6366f1' stopOpacity={0.3}/><stop offset='100%' stopColor='#6366f1' stopOpacity={0.02}/></linearGradient></defs>
        <path d={areaD} fill='url(#tg)'/>
        <path d={pathD} fill='none' stroke='#6366f1' strokeWidth={1.5} strokeLinejoin='round' strokeLinecap='round'/>
        {pts[pts.length-1]&&<circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r={3} fill='#6366f1'/>}
      </svg>
      <div style={{display:'flex',justifyContent:'space-between',paddingLeft:pad,paddingRight:pad}}>
        {labels.slice(0,5).map((d,i)=>(<span key={i} style={{fontSize:9,color:'var(--text-disabled)',fontFamily:'monospace'}}>{d.date.slice(0,7)}</span>))}
      </div>
    </div>
  )
}

function EvidenceScore({label,score,basis}:{label:string,score:number,basis:string}){
  const[show,setShow]=useState(false)
  const c=score>=70?'var(--success)':score>=45?'var(--warning)':'var(--danger)'
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:11,fontWeight:700,color:'var(--text-primary)'}}>{label}</span>
          {score>0&&<button onClick={()=>setShow(s=>!s)} style={{fontSize:9,color:'var(--brand-purple)',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:3,padding:'1px 5px',cursor:'pointer'}}>WHY</button>}
        </div>
        {score>0?<span style={{fontSize:13,fontWeight:900,color:c}}>{score}</span>:<span style={{fontSize:10,color:'var(--text-disabled)'}}>N/A</span>}
      </div>
      {score>0&&<div style={{height:3,background:'var(--bg-subtle)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',borderRadius:99,background:c,width:score+'%',transition:'width 1s cubic-bezier(0.4,0,0.2,1)'}}/></div>}
      {show&&<div style={{marginTop:6,padding:'8px 10px',background:'rgba(99,102,241,0.04)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:6,fontSize:10,color:'var(--text-secondary)',lineHeight:1.6}}>{basis}</div>}
    </div>
  )
}

function ValidateContent(){
  const params=useSearchParams()
  const[session,setSession]=useState<any>(null)
  const[profile,setProfile]=useState<any>(null)
  const[keyword,setKeyword]=useState('')
  const[radarId,setRadarId]=useState<string|null>(null)
  const[loading,setLoading]=useState(false)
  const[report,setReport]=useState<any>(null)
  const[error,setError]=useState('')
  const[saved,setSaved]=useState(false)

  useEffect(()=>{
    const k=params?.get('keyword'),r=params?.get('radar_id')
    if(k)setKeyword(k);if(r)setRadarId(r)
    supabase.auth.getSession().then(async({data:{session:s}})=>{
      if(!s)return
      setSession(s)
      const{data}=await supabase.from('profiles').select('*').eq('id',s.user.id).single()
      setProfile(data)
    })
  },[])

  async function run(e:React.FormEvent){
    e.preventDefault()
    if(!keyword.trim()||!session)return
    setLoading(true);setError('');setReport(null);setSaved(false)
    try{
      const res=await fetch(FN,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({keyword:keyword.trim(),radar_id:radarId||undefined})})
      const data=await res.json()
      if(!res.ok)throw new Error(data.error||'Validation failed')
      setReport(data.report)
      setProfile((p:any)=>p?{...p,generations_used:(p.generations_used||0)+1}:p)
    }catch(err:any){setError(err.message||'Failed. Try again.')}
    finally{setLoading(false)}
  }

  async function saveToRadar(){
    if(!session||!keyword.trim())return
    const{data,error:err}=await supabase.from('radar').upsert({user_id:session.user.id,market:keyword.trim()},{onConflict:'user_id,market'}).select().single()
    if(!err&&data)setSaved(true)
  }

  const used=profile?.generations_used||0,limit=profile?.generations_limit||7

  return(
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <div className='page-header' style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1>Trend Validation</h1><p>Real Google Trends data — AI interprets what it means</p></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:10,color:'var(--text-disabled)',fontFamily:'monospace',marginBottom:4}}>{used}/{limit} CREDITS</div><div style={{width:80,height:3,background:'var(--bg-subtle)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',background:'linear-gradient(90deg,var(--brand-purple),var(--brand-pink))',borderRadius:99,width:Math.min((used/limit)*100,100)+'%'}}/></div></div>
      </div>

      {radarId&&<div style={{marginBottom:12,padding:'8px 12px',background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'var(--radius-md)',fontSize:11,color:'var(--brand-purple)'}}>Results will update your Radar entry</div>}

      <div className='card' style={{padding:18,marginBottom:20}}>
        <form onSubmit={run}>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <div style={{flex:1,position:'relative'}}><Search size={13} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text-disabled)',pointerEvents:'none'}}/><input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder='Enter a market or keyword... e.g. longevity supplements, AI coding tools' className='input' style={{paddingLeft:34}}/></div>
            <button type='submit' disabled={loading||!keyword.trim()||used>=limit} className='btn btn-primary' style={{whiteSpace:'nowrap'}}>{loading?<><div className='spinner' style={{width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white'}}/>Analyzing...</>:<>Validate</>}</button>
          </div>
          {error&&<div className='alert alert-error'><AlertTriangle size={12} style={{flexShrink:0}}/><span>{error}</span></div>}
          {used>=limit&&<p style={{fontSize:10,textAlign:'center',color:'var(--text-disabled)'}}>Credits exhausted. <a href='/settings/billing' style={{color:'var(--brand-purple)'}}>Upgrade</a></p>}
        </form>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10,padding:'6px 10px',background:'var(--bg-overlay)',borderRadius:6}}>
          <Database size={10} style={{color:'var(--brand-purple)',flexShrink:0}}/>
          <span style={{fontSize:10,color:'var(--text-tertiary)'}}>Powered by real Google Trends data via SerpAPI. Scores derived from actual search volume — not AI-generated numbers.</span>
        </div>
      </div>

      {report&&(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div className='card' style={{padding:22}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:16}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                  <SignalBadge v={report.signal}/>
                  {report.data_sources?.map((s:string,i:number)=>(<span key={i} style={{display:'flex',alignItems:'center',gap:4,fontSize:9,fontWeight:600,padding:'2px 7px',borderRadius:4,background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.15)',color:'var(--success)',textTransform:'uppercase',letterSpacing:'0.04em'}}><Database size={8}/>{s}</span>))}
                </div>
                <h2 style={{fontSize:'1.2rem',fontWeight:900,color:'var(--text-primary)',marginBottom:4}}>{report.keyword}</h2>
                {report.signal_reason&&<p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6,fontStyle:'italic'}}>{report.signal_reason}</p>}
              </div>
              <div style={{flexShrink:0,textAlign:'center',background:'var(--bg-overlay)',borderRadius:'var(--radius-xl)',padding:'14px 18px',minWidth:80}}>
                <div style={{fontSize:'1.75rem',fontWeight:900,color:report.overall_score>=65?'var(--success)':report.overall_score>=40?'var(--warning)':'var(--danger)'}}>{report.overall_score||0}</div>
                <div style={{fontSize:9,color:'var(--text-disabled)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:2}}>Score</div>
              </div>
            </div>
            {report.ai_interpretation&&(
              <div className='insight-box' style={{marginBottom:16}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}><Sparkles size={11} style={{color:'var(--brand-purple)'}}/><span style={{fontSize:9,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em'}}>AI Interpretation</span></div>
                <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.7}}>{report.ai_interpretation}</p>
              </div>
            )}
            <button onClick={saveToRadar} disabled={saved} className='btn btn-ghost btn-sm' style={{width:'100%',justifyContent:'center'}}><BookmarkPlus size={12}/>{saved?'Added to Radar':'Add to Radar'}</button>
          </div>

          {report.trend_chart_data?.length>2&&(
            <div className='card' style={{padding:'18px 18px 10px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <TrendingUp size={13} style={{color:'var(--brand-purple)'}}/>
                <span style={{fontSize:10,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Search Interest — 5 Year Trend</span>
                <span style={{fontSize:9,padding:'1px 6px',borderRadius:3,background:'rgba(34,197,94,0.08)',color:'var(--success)',border:'1px solid rgba(34,197,94,0.15)',fontFamily:'monospace'}}>REAL DATA</span>
              </div>
              <TrendChart data={report.trend_chart_data}/>
            </div>
          )}

          <div className='card' style={{padding:18}}>
            <div style={{fontSize:10,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Database size={11}/>Evidence-Backed Scores</div>
            <EvidenceScore label='Trend Score' score={report.trend_score||0} basis={report.trend_score_basis||'No data'}/>
            <EvidenceScore label='Demand Score' score={report.demand_score||0} basis={report.demand_score_basis||'No data'}/>
            <EvidenceScore label='Timing Score' score={report.timing_score||0} basis={report.timing_score_basis||'No data'}/>
            <EvidenceScore label='Competition (AI estimate)' score={report.competition_score||0} basis={report.competition_score_basis||'AI only'}/>
          </div>

          {(report.top_queries?.length>0||report.rising_queries?.length>0)&&(
            <div className='card' style={{padding:18}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Search size={11}/>Related Searches <span style={{fontSize:9,padding:'1px 6px',borderRadius:3,background:'rgba(34,197,94,0.08)',color:'var(--success)',border:'1px solid rgba(34,197,94,0.15)',fontFamily:'monospace',fontWeight:400,textTransform:'none',letterSpacing:0}}>REAL DATA</span></div>
              <div className='grid-2' style={{gap:16}}>
                {report.top_queries?.length>0&&(
                  <div>
                    <div style={{fontSize:9,color:'var(--text-disabled)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Top Queries</div>
                    {report.top_queries.slice(0,8).map((q:any,i:number)=>(<div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}><span style={{fontSize:11,color:'var(--text-secondary)'}}>{q.query}</span><span style={{fontSize:10,fontWeight:700,color:'var(--brand-purple)',flexShrink:0,marginLeft:8}}>{q.value}</span></div>))}
                  </div>
                )}
                {report.rising_queries?.length>0&&(
                  <div>
                    <div style={{fontSize:9,color:'var(--text-disabled)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Rising Queries</div>
                    {report.rising_queries.slice(0,8).map((q:any,i:number)=>(<div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}><span style={{fontSize:11,color:'var(--text-secondary)'}}>{q.query}</span><span style={{fontSize:9,fontWeight:700,color:String(q.value).includes('Breakout')?'var(--warning)':'var(--success)',background:String(q.value).includes('Breakout')?'rgba(245,158,11,0.08)':'rgba(34,197,94,0.08)',padding:'1px 5px',borderRadius:3,flexShrink:0,marginLeft:4}}>{String(q.value).includes('Breakout')?'BREAKOUT':String(q.value)}</span></div>))}
                  </div>
                )}
              </div>
            </div>
          )}

          {report.ai_opportunities?.length>0&&(
            <div className='card' style={{padding:18}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Sparkles size={11}/>Opportunities</div>
              {report.ai_opportunities.map((o:any,i:number)=>(<div key={i} style={{padding:'12px 14px',background:'var(--bg-overlay)',borderRadius:'var(--radius-lg)',marginBottom:8}}><div style={{fontSize:12,fontWeight:700,color:'var(--text-primary)',marginBottom:3}}>{o.title}</div><div style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.6,marginBottom:4}}>{o.why}</div>{o.evidence&&<div style={{fontSize:10,color:'var(--brand-purple)',fontStyle:'italic'}}>Evidence: {o.evidence}</div>}</div>))}
            </div>
          )}

          {report.ai_action_plan&&Object.keys(report.ai_action_plan).length>0&&(
            <div className='card' style={{padding:18}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:14}}>Action Plan</div>
              {([['immediate','This Week'],['validation_step','Validation Step'],['first_revenue','First Revenue']] as [string,string][]).map(([k,label])=>report.ai_action_plan[k]&&(
                <div key={k} style={{padding:'10px 12px',background:'var(--bg-overlay)',borderRadius:'var(--radius-md)',marginBottom:8}}>
                  <div style={{fontSize:9,color:'var(--brand-purple)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{label}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.6}}>{report.ai_action_plan[k]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ValidatePage(){
  return(
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:400}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>}>
      <ValidateContent/>
    </Suspense>
  )
}