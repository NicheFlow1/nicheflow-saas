'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{Zap,TrendingUp,DollarSign,AlertTriangle,CheckCircle,XCircle,Clock,Sparkles,ChevronDown,ChevronUp,BookmarkPlus,Shield,Rocket,Search,Crosshair,Target}from'lucide-react'

const SUPA_FN='https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/analyze-opportunity'
const MODES=[
  {id:'analyze',label:'Deep Analysis',desc:'Surgical breakdown of any niche'},
  {id:'discover',label:'Discover 3 Niches',desc:'Find hidden opportunities'},
  {id:'trend',label:'Trend Analysis',desc:'Lifecycle and timing intel'},
  {id:'compete',label:'Competition X-Ray',desc:'Map the full battlefield'}
]
const PLACEHOLDERS:Record<string,string>={
  analyze:'Enter a niche, market or idea... e.g. AI tools for solo lawyers, eco pet supplements, B2B invoicing SaaS',
  discover:'Enter a broad space... e.g. health and wellness, creator economy, future of work',
  trend:'Enter a trend or keyword... e.g. AI agents, quiet luxury, longevity supplements',
  compete:'Enter a market to X-Ray... e.g. project management SaaS, online fitness coaching'
}

function GoNoBadge({v}:{v:string}){
  if(v==='GO')return<span className='badge badge-go'><CheckCircle size={9}/>GO</span>
  if(v==='NO_GO')return<span className='badge badge-nogo'><XCircle size={9}/>NO GO</span>
  if(v==='WAIT')return<span className='badge badge-wait'><Clock size={9}/>WAIT</span>
  return<span className='badge badge-neutral'>ANALYZING</span>
}

function ScoreRing({score}:{score:number}){
  const c=score>=80?'#22c55e':score>=60?'#f59e0b':'#ef4444'
  const r=28,circ=2*Math.PI*r,dash=circ*(score/100)
  return(
    <svg width={64} height={64} style={{transform:'rotate(-90deg)',flexShrink:0}}>
      <circle cx={32} cy={32} r={r} fill='none' stroke='var(--bg-subtle)' strokeWidth={3}/>
      <circle cx={32} cy={32} r={r} fill='none' stroke={c} strokeWidth={3}
        strokeDasharray={circ} strokeDashoffset={circ-dash} strokeLinecap='round'/>
      <text x={32} y={33} textAnchor='middle' dominantBaseline='middle'
        fill={c} fontSize={13} fontWeight='bold'
        style={{transform:'rotate(90deg)',transformOrigin:'32px 32px'}}>{score}</text>
    </svg>
  )
}

function MetricBar({label,score,color}:{label:string,score:number,color:string}){
  return(
    <div className='metric-row'>
      <div className='metric-header'>
        <span className='metric-name'>{label}</span>
        <span className='metric-val'>{score}</span>
      </div>
      <div className='metric-track'>
        <div className={'metric-fill '+color} style={{width:score+'%'}}/>
      </div>
    </div>
  )
}

function Collapsible({title,icon:Icon,children,open:def=true}:{title:string,icon:any,children:React.ReactNode,open?:boolean}){
  const[open,setOpen]=useState(def)
  return(
    <div className='section'>
      <div className='section-header' onClick={()=>setOpen(o=>!o)}>
        <div className='section-title'><Icon size={12}/>{title}</div>
        {open?<ChevronUp size={12} style={{color:'var(--text-disabled)'}}/>:<ChevronDown size={12} style={{color:'var(--text-disabled)'}}/>}
      </div>
      {open&&<div className='section-body'>{children}</div>}
    </div>
  )
}

function OppCard({opp,onSave}:{opp:any,onSave:(id:string)=>void}){
  const ai=opp.raw_ai_output||{}
  const exec=ai.execution_pipeline||{}
  const mono=ai.monetization_intelligence||{}
  const map=ai.market_map||{}
  const[saved,setSaved]=useState(false)
  const sc=opp.overall_score||0
  const metrics:Array<[string,number,string]>=[
    ['Demand',opp.demand_score||0,'bg-indigo-500'],
    ['Low Comp',opp.competition_score||0,'bg-emerald-500'],
    ['Revenue',opp.monetization_score||0,'bg-amber-500'],
    ['Scale',opp.scalability_score||0,'bg-pink-500'],
    ['Timing',opp.timing_score||0,'bg-violet-500'],
    ['Viral',opp.virality_score||0,'bg-cyan-500'],
    ['Longevity',opp.longevity_score||0,'bg-orange-500'],
  ]
  const phases:Array<[string,string]>=[['week1_2','Week 1-2'],['month1','Month 1'],['month2_3','Month 2-3'],['month4_6','Month 4-6']]
  return(
    <div className='opp-card fade-up'>
      {/* Hero */}
      <div className='opp-hero'>
        <div className='opp-header'>
          <div style={{flex:1}}>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:6}}>
              <GoNoBadge v={opp.go_no_go||ai.go_no_go||'ANALYZING'}/>
              <span className='badge badge-info' style={{textTransform:'capitalize'}}>{opp.lifecycle_stage||'emerging'}</span>
              <span className='badge badge-neutral'>{opp.entry_window||'NOW'}</span>
            </div>
            <h2 className='opp-title'>{opp.title}</h2>
            <p className='opp-summary'>{opp.summary}</p>
            {ai.go_no_go_reason&&<p className='opp-reason'>{ai.go_no_go_reason}</p>}
          </div>
          <div className='score-ring-wrap'>
            <ScoreRing score={sc}/>
            <span className='score-ring-label'>score</span>
          </div>
        </div>
        <div className='scores-grid'>
          {metrics.map(([l,s,c])=>(
            <div key={l} style={{background:'var(--bg-overlay)',borderRadius:'var(--radius-md)',padding:'8px 10px'}}>
              <MetricBar label={l} score={s} color={c}/>
            </div>
          ))}
        </div>
        <div className='quick-stats'>
          <div className='quick-stat'><div className='quick-stat-label'>Market</div><div className='quick-stat-value'>{opp.market_size||'Emerging'}</div></div>
          <div className='quick-stat'><div className='quick-stat-label'>Category</div><div className='quick-stat-value' style={{textTransform:'capitalize'}}>{opp.category||'general'}</div></div>
          <div className='quick-stat'><div className='quick-stat-label'>Peak Est</div><div className='quick-stat-value' style={{color:'var(--warning)'}}>{ai.peak_estimated||'Tracking'}</div></div>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {(opp.trend_signals||[]).length>0&&(
          <Collapsible title='Trend Signals' icon={TrendingUp}>
            {opp.trend_signals.slice(0,5).map((s:any,i:number)=>(
              <div key={i} className='signal-row'>
                <div className='signal-platform'>
                  <div className='signal-platform-name'>{s.platform}</div>
                  <div className='signal-strength-track'><div className='signal-strength-fill' style={{width:(s.strength||0)+'%'}}/></div>
                </div>
                <div className='signal-text'>{s.signal}{s.evidence&&<small>{s.evidence}</small>}</div>
                <span className='signal-score'>{s.strength}</span>
              </div>
            ))}
          </Collapsible>
        )}

        {(opp.pain_points||[]).length>0&&(
          <Collapsible title='Pain Points Detected' icon={AlertTriangle}>
            {opp.pain_points.slice(0,4).map((p:any,i:number)=>(
              <div key={i} className='pain-row'>
                <span className={'pain-intensity '+'pain-'+(p.intensity||'low')}>{(p.intensity||'low').toUpperCase()}</span>
                <div><div className='pain-text'>{p.pain}</div>{p.evidence&&<div className='pain-evidence'>{p.evidence}</div>}</div>
              </div>
            ))}
          </Collapsible>
        )}

        {(map.white_spaces||map.incumbents)&&(
          <Collapsible title='Competition X-Ray' icon={Shield}>
            {(map.white_spaces||[]).length>0&&(
              <div className='whitespace-box'>
                <div className='whitespace-title'>White Spaces — Enter Here</div>
                {map.white_spaces.map((w:string,i:number)=>(
                  <div key={i} className='whitespace-item'><div className='whitespace-dot'/>{w}</div>
                ))}
              </div>
            )}
            {(map.incumbents||[]).slice(0,3).map((c:any,i:number)=>(
              <div key={i} className='comp-item'>
                <div style={{display:'flex',justifyContent:'space-between'}}><span className='comp-name'>{c.name}</span>{c.revenue&&<span style={{fontSize:10,color:'var(--text-disabled)'}}>{c.revenue}</span>}</div>
                {c.weakness&&<div className='comp-weak'>Weakness: {c.weakness}</div>}
                {c.your_angle&&<div className='comp-angle'>Your angle: {c.your_angle}</div>}
              </div>
            ))}
          </Collapsible>
        )}

        {mono.recommended_model&&(
          <Collapsible title='Monetization Intelligence' icon={DollarSign}>
            <div style={{background:'rgba(34,197,94,0.04)',border:'1px solid rgba(34,197,94,0.15)',borderRadius:'var(--radius-lg)',padding:'12px 14px',marginBottom:8}}>
              <div style={{fontSize:9,fontWeight:700,color:'var(--success)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Recommended</div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>{mono.recommended_model} <span style={{color:'var(--success)',fontWeight:400,fontSize:12}}>{mono.price_point}</span></div>
              {mono.pricing_psychology&&<p style={{fontSize:10,color:'var(--text-tertiary)',marginTop:6,lineHeight:1.5}}>{mono.pricing_psychology}</p>}
            </div>
            {(mono.paths||[]).length>0&&(
              <div className='grid-2'>{mono.paths.slice(0,4).map((p:any,i:number)=>(
                <div key={i} style={{background:'var(--bg-overlay)',borderRadius:'var(--radius-lg)',padding:'10px 12px'}}>
                  <div style={{fontSize:9,color:'var(--text-disabled)',marginBottom:3,textTransform:'uppercase'}}>{p.model}</div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--warning)'}}>{p.price}</div>
                  {p.margin&&<div style={{fontSize:10,color:'var(--text-disabled)'}}>{p.margin} margin</div>}
                  <div style={{fontSize:9,color:'var(--brand-purple)',marginTop:3}}>{p.timeline}</div>
                </div>
              ))}</div>
            )}
            {mono.ltv_estimate&&(
              <div className='grid-2'>
                <div style={{background:'var(--bg-overlay)',borderRadius:'var(--radius-lg)',padding:'10px 12px'}}><div style={{fontSize:9,color:'var(--text-disabled)',marginBottom:3}}>LTV ESTIMATE</div><div style={{fontSize:13,fontWeight:700,color:'var(--success)'}}>{mono.ltv_estimate}</div></div>
                <div style={{background:'var(--bg-overlay)',borderRadius:'var(--radius-lg)',padding:'10px 12px'}}><div style={{fontSize:9,color:'var(--text-disabled)',marginBottom:3}}>CAC ESTIMATE</div><div style={{fontSize:13,fontWeight:700,color:'var(--warning)'}}>{mono.cac_estimate||'TBD'}</div></div>
              </div>
            )}
          </Collapsible>
        )}

        {exec.mvp_definition&&(
          <Collapsible title='Execution Pipeline' icon={Rocket}>
            <div style={{background:'rgba(99,102,241,0.04)',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'var(--radius-lg)',padding:'12px 14px',marginBottom:8}}>
              <div style={{fontSize:9,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>MVP Definition</div>
              <p style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.5}}>{exec.mvp_definition}</p>
            </div>
            {exec.first_dollar&&(
              <div className='revenue-box' style={{marginBottom:8}}>
                <div style={{fontSize:9,fontWeight:700,color:'var(--success)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>First Revenue — 30 Days</div>
                <p style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.5}}>{exec.first_dollar}</p>
              </div>
            )}
            <div>
              {phases.map(([k,label],idx)=>{
                const step=exec[k]
                if(!step)return null
                return(
                  <div key={k} className='pipeline-step'>
                    <div className='step-line-wrap'>
                      <div className='step-dot'><div className='step-dot-inner'/></div>
                      {idx<phases.length-1&&<div className='step-connector'/>}
                    </div>
                    <div className='step-content'>
                      <div className='step-phase'>{label}{step.cost&&<span className='step-cost'> — {step.cost}</span>}</div>
                      <div className='step-action'>{step.action}</div>
                      {step.outcome&&<div className='step-outcome'>{step.outcome}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Collapsible>
        )}

        {ai.unique_insight&&(
          <div className='insight-box'>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
              <Sparkles size={12} style={{color:'var(--brand-purple)'}}/>
              <span style={{fontSize:9,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Key Intelligence Insight</span>
            </div>
            <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.65}}>{ai.unique_insight}</p>
          </div>
        )}

        <button
          onClick={()=>{onSave(opp.id);setSaved(true)}}
          disabled={saved}
          className='btn btn-ghost'
          style={{width:'100%',justifyContent:'center'}}
        >
          <BookmarkPlus size={13}/>{saved?'Saved to Intelligence Base':'Save Opportunity'}
        </button>
      </div>
    </div>
  )
}

export default function GeneratorPage(){
  const[session,setSession]=useState<any>(null)
  const[profile,setProfile]=useState<any>(null)
  const[mode,setMode]=useState('analyze')
  const[input,setInput]=useState('')
  const[loading,setLoading]=useState(false)
  const[results,setResults]=useState<any[]>([])
  const[error,setError]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session:s}})=>{
      if(!s)return
      setSession(s)
      const{data}=await supabase.from('profiles').select('*').eq('id',s.user.id).single()
      setProfile(data)
    })
  },[])

  async function run(e:React.FormEvent){
    e.preventDefault()
    if(!input.trim()||!session)return
    setLoading(true);setError('');setResults([])
    try{
      const res=await fetch(SUPA_FN,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
        body:JSON.stringify({niche:input,mode})
      })
      const data=await res.json()
      if(!res.ok)throw new Error(data.error||'Analysis failed')
      setResults(data.opportunities||[])
      setProfile((p:any)=>p?{...p,generations_used:(p.generations_used||0)+1}:p)
    }catch(err:any){
      setError(err.message||'Failed. Try again.')
    }finally{
      setLoading(false)
    }
  }

  async function save(id:string){
    if(!session)return
    await supabase.from('saved_opportunities').upsert({user_id:session.user.id,opportunity_id:id})
  }

  const used=profile?.generations_used||0
  const limit=profile?.generations_limit||7
  const pct=Math.min((used/limit)*100,100)

  return(
    <div style={{maxWidth:680,margin:'0 auto'}}>
      <div className='page-header' style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <h1>Market Intelligence Engine</h1>
          <p>Find opportunities before they become obvious</p>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10,color:'var(--text-disabled)',fontFamily:'monospace',marginBottom:4}}>{used}/{limit} CREDITS</div>
          <div style={{width:80,height:3,background:'var(--bg-subtle)',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',background:'linear-gradient(90deg,var(--brand-purple),var(--brand-pink))',borderRadius:99,width:pct+'%',transition:'width 0.5s'}}/>
          </div>
        </div>
      </div>

      <div className='mode-grid'>
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>setMode(m.id)} className={'mode-tab'+(mode===m.id?' active':'')}>
            <div className='mode-tab-label'>{m.label}</div>
            <div className='mode-tab-desc'>{m.desc}</div>
          </button>
        ))}
      </div>

      <div className='card' style={{padding:18,marginBottom:20}}>
        <form onSubmit={run}>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder={PLACEHOLDERS[mode]||PLACEHOLDERS.analyze}
            rows={3}
            className='textarea'
            style={{marginBottom:12}}
          />
          {error&&(
            <div className='alert alert-error' style={{marginBottom:12}}>
              <AlertTriangle size={13} style={{flexShrink:0}}/>
              <span>{error}</span>
            </div>
          )}
          <button
            type='submit'
            disabled={loading||!input.trim()||used>=limit}
            className='btn btn-grad btn-xl'
            style={{width:'100%'}}
          >
            {loading
              ?<><div className='spinner' style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white'}}/>Analyzing Intelligence...</>
              :<><Zap size={15}/>Run Intelligence Engine</>
            }
          </button>
          {used>=limit&&(
            <p style={{fontSize:10,textAlign:'center',color:'var(--text-disabled)',marginTop:8}}>
              Credits exhausted. <a href='/settings/billing' style={{color:'var(--brand-purple)'}}>Upgrade plan</a>
            </p>
          )}
        </form>
      </div>

      {results.map((opp:any)=>(
        <OppCard key={opp.id} opp={opp} onSave={save}/>
      ))}
    </div>
  )
}