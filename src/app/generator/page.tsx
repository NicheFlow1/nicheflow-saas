'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{Zap,TrendingUp,DollarSign,AlertTriangle,CheckCircle,XCircle,Clock,Sparkles,ChevronDown,ChevronUp,BookmarkPlus,Shield,Rocket,Search,Crosshair}from'lucide-react'

const SUPA_FN='https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/analyze-opportunity'
const MODES=[{id:'analyze',label:'Deep Analysis',desc:'Surgical market breakdown'},{id:'discover',label:'Discover 3 Niches',desc:'Find hidden opportunities'},{id:'trend',label:'Trend Analysis',desc:'Lifecycle and timing intel'},{id:'compete',label:'Competition X-Ray',desc:'Map the battlefield'}]

function GoNoBadge({v}:{v:string}){
  if(v==='GO')return<span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/30'><CheckCircle size={11}/>GO</span>
  if(v==='NO_GO')return<span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black text-red-400 bg-red-400/10 border border-red-400/30'><XCircle size={11}/>NO GO</span>
  if(v==='WAIT')return<span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30'><Clock size={11}/>WAIT</span>
  return<span className='inline-flex px-3 py-1 rounded-full text-xs font-black border border-gray-700 text-gray-500'>ANALYZING</span>
}

function ScoreRing({score}:{score:number}){
  const c=score>=80?'#10b981':score>=60?'#f59e0b':'#ef4444'
  const r=28,circ=2*Math.PI*r,dash=circ*(score/100)
  return(
    <svg width={64} height={64} style={{transform:'rotate(-90deg)'}}>
      <circle cx={32} cy={32} r={r} fill='none' stroke='#1a1a2e' strokeWidth={3}/>
      <circle cx={32} cy={32} r={r} fill='none' stroke={c} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ-dash} strokeLinecap='round'/>
      <text x={32} y={33} textAnchor='middle' dominantBaseline='middle' fill={c} fontSize={13} fontWeight='bold' style={{transform:'rotate(90deg)',transformOrigin:'32px 32px'}}>{score}</text>
    </svg>
  )
}

function Bar({label,score,color='bg-indigo-500'}:{label:string,score:number,color?:string}){
  return(
    <div className='space-y-1'>
      <div className='flex justify-between'><span className='text-[10px] text-gray-500 uppercase tracking-wider'>{label}</span><span className='text-[10px] font-bold text-gray-300'>{score}</span></div>
      <div className='h-1 bg-[#0f0f1e] rounded-full overflow-hidden'><div className={'h-full rounded-full transition-all '+color} style={{width:score+'%'}}/></div>
    </div>
  )
}

function Sec({title,Icon,children,def=true}:{title:string,Icon:any,children:React.ReactNode,def?:boolean}){
  const[open,setOpen]=useState(def)
  return(
    <div className='bg-[#0a0a14] border border-[#1a1a2e] rounded-2xl overflow-hidden'>
      <button onClick={()=>setOpen(o=>!o)} className='w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors'>
        <div className='flex items-center gap-2'><Icon size={13} className='text-indigo-400'/><span className='text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider'>{title}</span></div>
        {open?<ChevronUp size={13} className='text-gray-600'/>:<ChevronDown size={13} className='text-gray-600'/>}
      </button>
      {open&&<div className='px-5 pb-5 space-y-2.5'>{children}</div>}
    </div>
  )
}

function OppCard({opp,onSave}:{opp:any,onSave:(id:string)=>void}){
  const ai=opp.raw_ai_output||{}
  const exec=ai.execution_pipeline||{}
  const mono=ai.monetization_intelligence||{}
  const map=ai.market_map||{}
  const[saved,setSaved]=useState(false)
  return(
    <div className='space-y-3'>
      <div className='bg-[#0a0a14] border border-[#1a1a2e] rounded-2xl p-5'>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
              <GoNoBadge v={opp.go_no_go||ai.go_no_go||'ANALYZING'}/>
              <span className='text-[10px] font-mono px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'>{opp.lifecycle_stage||'emerging'}</span>
              <span className='text-[10px] font-mono px-2 py-1 rounded bg-[#0f0f1e] text-gray-400 border border-[#1a1a2e]'>{opp.entry_window||'NOW'}</span>
            </div>
            <h2 className='text-xl font-black text-white mb-1'>{opp.title}</h2>
            <p className='text-sm text-gray-400 leading-relaxed'>{opp.summary}</p>
            {ai.go_no_go_reason&&<p className='text-xs text-indigo-300 mt-2 italic'>{ai.go_no_go_reason}</p>}
          </div>
          <div className='flex-shrink-0 text-center'><ScoreRing score={opp.overall_score||0}/><div className='text-[9px] text-gray-600 font-mono mt-1'>SCORE</div></div>
        </div>
        <div className='grid grid-cols-4 gap-2 mb-4'>
          {([['Demand',opp.demand_score,'bg-indigo-500'],['Low Comp',opp.competition_score,'bg-emerald-500'],['Revenue',opp.monetization_score,'bg-amber-500'],['Scale',opp.scalability_score,'bg-pink-500'],['Timing',opp.timing_score,'bg-violet-500'],['Viral',opp.virality_score,'bg-cyan-500'],['Longevity',opp.longevity_score,'bg-orange-500']] as [string,number,string][]).map(([l,s,c])=>(
            <Bar key={l} label={l} score={Number(s)||0} color={c}/>
          ))}
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <div className='bg-[#0f0f1e] rounded-xl p-3'><div className='text-[9px] text-gray-600 font-mono mb-1'>MARKET</div><div className='text-xs font-bold text-white'>{opp.market_size||'Emerging'}</div></div>
          <div className='bg-[#0f0f1e] rounded-xl p-3'><div className='text-[9px] text-gray-600 font-mono mb-1'>CATEGORY</div><div className='text-xs font-bold text-indigo-300 capitalize'>{opp.category}</div></div>
          <div className='bg-[#0f0f1e] rounded-xl p-3'><div className='text-[9px] text-gray-600 font-mono mb-1'>PEAK EST</div><div className='text-xs font-bold text-amber-300'>{ai.peak_estimated||'Tracking'}</div></div>
        </div>
      </div>

      {(opp.trend_signals||[]).length>0&&(
      <Sec title='Trend Signals' Icon={TrendingUp}>
        {opp.trend_signals.slice(0,5).map((s:any,i:number)=>(
          <div key={i} className='flex items-center gap-3 p-3 bg-[#0f0f1e] rounded-xl'>
            <div className='w-20 flex-shrink-0'><div className='text-[9px] font-mono text-indigo-400 uppercase mb-1'>{s.platform}</div><div className='h-1 bg-[#1a1a2e] rounded-full overflow-hidden'><div className='h-full bg-indigo-500 rounded-full' style={{width:(s.strength||0)+'%'}}/></div></div>
            <div className='flex-1'><p className='text-xs text-gray-300'>{s.signal}</p>{s.evidence&&<p className='text-[10px] text-gray-600 mt-0.5'>{s.evidence}</p>}</div>
            <span className='text-xs font-black text-indigo-400 flex-shrink-0'>{s.strength}</span>
          </div>
        ))}
      </Sec>)}

      {(opp.pain_points||[]).length>0&&(
      <Sec title='Pain Points' Icon={AlertTriangle}>
        {opp.pain_points.slice(0,4).map((p:any,i:number)=>(
          <div key={i} className='flex items-start gap-3 p-3 bg-[#0f0f1e] rounded-xl'>
            <span className={'text-[9px] font-mono px-2 py-1 rounded flex-shrink-0 '+(p.intensity==='critical'?'bg-red-500/20 text-red-400':p.intensity==='high'?'bg-orange-500/20 text-orange-400':p.intensity==='medium'?'bg-amber-500/20 text-amber-400':'bg-gray-500/20 text-gray-400')}>{(p.intensity||'med').toUpperCase()}</span>
            <div><p className='text-xs text-gray-200 font-medium'>{p.pain}</p>{p.evidence&&<p className='text-[10px] text-gray-500 mt-0.5'>{p.evidence}</p>}</div>
          </div>
        ))}
      </Sec>)}

      {(map.white_spaces||map.incumbents)&&(
      <Sec title='Competition X-Ray' Icon={Shield}>
        {(map.white_spaces||[]).length>0&&(
          <div className='p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl'>
            <div className='text-[9px] font-mono text-emerald-400 mb-2'>WHITE SPACES - ENTER HERE</div>
            {map.white_spaces.map((w:string,i:number)=>(<div key={i} className='flex items-center gap-2 text-xs text-gray-300 mb-1'><div className='w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0'/>{w}</div>))}
          </div>
        )}
        {(map.incumbents||[]).slice(0,3).map((c:any,i:number)=>(
          <div key={i} className='p-3 bg-[#0f0f1e] rounded-xl'>
            <div className='flex justify-between mb-1'><span className='text-xs font-bold text-white'>{c.name}</span>{c.revenue&&<span className='text-[10px] text-gray-500'>{c.revenue}</span>}</div>
            {c.weakness&&<p className='text-[10px] text-red-400 mb-1'>Weakness: {c.weakness}</p>}
            {c.your_angle&&<p className='text-[10px] text-emerald-400'>Your angle: {c.your_angle}</p>}
          </div>
        ))}
      </Sec>)}

      {mono.recommended_model&&(
      <Sec title='Monetization Intelligence' Icon={DollarSign}>
        <div className='p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl'>
          <div className='text-[9px] font-mono text-emerald-400 mb-1'>RECOMMENDED</div>
          <div className='text-sm font-bold text-white'>{mono.recommended_model} <span className='text-emerald-300 font-normal text-xs'>{mono.price_point}</span></div>
          {mono.pricing_psychology&&<p className='text-[10px] text-gray-400 mt-1.5'>{mono.pricing_psychology}</p>}
        </div>
        {(mono.paths||[]).length>0&&(
          <div className='grid grid-cols-2 gap-2'>{mono.paths.slice(0,4).map((p:any,i:number)=>(<div key={i} className='p-3 bg-[#0f0f1e] rounded-xl'><div className='text-[9px] font-mono text-gray-500 mb-1'>{p.model}</div><div className='text-sm font-bold text-amber-400'>{p.price}</div>{p.margin&&<div className='text-[10px] text-gray-500'>{p.margin}</div>}<div className='text-[10px] text-indigo-400 mt-1'>{p.timeline}</div></div>))}</div>
        )}
        {mono.ltv_estimate&&(
          <div className='grid grid-cols-2 gap-2'><div className='p-3 bg-[#0f0f1e] rounded-xl'><div className='text-[9px] font-mono text-gray-500 mb-1'>LTV</div><div className='text-sm font-bold text-emerald-400'>{mono.ltv_estimate}</div></div><div className='p-3 bg-[#0f0f1e] rounded-xl'><div className='text-[9px] font-mono text-gray-500 mb-1'>CAC</div><div className='text-sm font-bold text-amber-400'>{mono.cac_estimate||'TBD'}</div></div></div>
        )}
      </Sec>)}

      {exec.mvp_definition&&(
      <Sec title='Execution Pipeline' Icon={Rocket}>
        <div className='p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl'><div className='text-[9px] font-mono text-indigo-400 mb-1'>MVP</div><p className='text-xs text-gray-200'>{exec.mvp_definition}</p></div>
        {exec.first_dollar&&<div className='p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl'><div className='text-[9px] font-mono text-emerald-400 mb-1'>FIRST REVENUE IN 30 DAYS</div><p className='text-xs text-gray-200'>{exec.first_dollar}</p></div>}
        <div className='space-y-2'>{(['week1_2','month1','month2_3','month4_6'] as string[]).map((k,idx)=>{const labels=['Week 1-2','Month 1','Month 2-3','Month 4-6'];const step=exec[k];if(!step)return null;return(<div key={k} className='flex gap-3'><div className='flex flex-col items-center flex-shrink-0'><div className='w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center'><div className='w-1.5 h-1.5 rounded-full bg-indigo-500'/></div>{idx<3&&<div className='w-px flex-1 bg-[#1a1a2e] my-1'/>}</div><div className='pb-3 flex-1'><div className='text-[9px] font-mono text-indigo-400 mb-0.5'>{labels[idx]}{step.cost&&<span className='text-gray-600 ml-1'>{step.cost}</span>}</div><p className='text-xs text-gray-200 font-medium'>{step.action}</p>{step.outcome&&<p className='text-[10px] text-gray-500 mt-0.5'>{step.outcome}</p>}</div></div>)})}</div>
      </Sec>)}

      {ai.unique_insight&&(
        <div className='bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-2'><Sparkles size={13} className='text-indigo-400'/><span className='text-[9px] font-mono text-indigo-300 uppercase tracking-wider'>Key Intelligence Insight</span></div>
          <p className='text-sm text-gray-200 leading-relaxed'>{ai.unique_insight}</p>
        </div>
      )}

      <button onClick={()=>{onSave(opp.id);setSaved(true)}} disabled={saved} className='w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1a1a2e] text-sm text-gray-500 hover:bg-[#0f0f1e] hover:text-indigo-300 hover:border-indigo-500/30 transition-all disabled:opacity-50'>
        <BookmarkPlus size={14}/>{saved?'Saved to Intelligence Base':'Save Opportunity'}
      </button>
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
      if(!s)return;setSession(s)
      const{data}=await supabase.from('profiles').select('*').eq('id',s.user.id).single()
      setProfile(data)
    })
  },[])

  async function run(e:React.FormEvent){
    e.preventDefault()
    if(!input.trim()||!session)return
    setLoading(true);setError('');setResults([])
    try{
      const res=await fetch(SUPA_FN,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({niche:input,mode})})
      const data=await res.json()
      if(!res.ok)throw new Error(data.error||'Analysis failed')
      setResults(data.opportunities||[])
      setProfile((p:any)=>p?{...p,generations_used:(p.generations_used||0)+1}:p)
    }catch(err:any){setError(err.message||'Failed. Try again.')
    }finally{setLoading(false)}
  }

  async function save(id:string){
    if(!session)return
    await supabase.from('saved_opportunities').upsert({user_id:session.user.id,opportunity_id:id})
  }

  const used=profile?.generations_used||0,limit=profile?.generations_limit||7,pct=Math.min((used/limit)*100,100)
  const ph:Record<string,string>={analyze:'Enter a niche, market, or idea...
e.g. AI tools for freelance designers, eco pet supplements, B2B proposal SaaS',discover:'Enter a broad space to explore 3 hidden niches...
e.g. health & wellness, creator economy, fintech',trend:'Enter a trend or keyword to analyze its lifecycle...
e.g. AI agents, quiet luxury, longevity supplements',compete:'Enter a market to X-Ray the competition...
e.g. project management SaaS, online fitness coaching'}

  return(
    <div className='max-w-3xl mx-auto space-y-4'>
      <div className='flex items-start justify-between'>
        <div><h1 className='text-2xl font-black text-white'>Market Intelligence Engine</h1><p className='text-sm text-gray-500 mt-0.5'>Find opportunities before they become obvious</p></div>
        <div className='text-right'><div className='text-[10px] font-mono text-gray-600 mb-1'>{used}/{limit} CREDITS</div><div className='w-24 h-1 bg-[#0f0f1e] rounded-full overflow-hidden'><div className='h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full' style={{width:pct+'%'}}/></div></div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>setMode(m.id)} className={'p-3 rounded-xl border text-left transition-all '+(mode===m.id?'bg-indigo-500/10 border-indigo-500/40 text-white':'bg-[#0a0a14] border-[#1a1a2e] text-gray-500 hover:border-[#2a2a3e]')}>
            <div className='text-xs font-bold mb-0.5'>{m.label}</div>
            <div className='text-[10px] text-gray-600'>{m.desc}</div>
          </button>
        ))}
      </div>

      <div className='bg-[#0a0a14] border border-[#1a1a2e] rounded-2xl p-4'>
        <form onSubmit={run} className='space-y-3'>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={ph[mode]||ph.analyze} rows={3} className='w-full bg-[#0f0f1e] border border-[#1a1a2e] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 resize-none'/>
          {error&&<div className='flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl'><AlertTriangle size={13} className='text-red-400 flex-shrink-0'/><span className='text-xs text-red-400'>{error}</span></div>}
          <button type='submit' disabled={loading||!input.trim()||used>=limit} className='w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-all'>
            {loading?<><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'/>Analyzing...</>:<><Zap size={15}/>Run Intelligence Engine</>}
          </button>
          {used>=limit&&<p className='text-[10px] text-center text-gray-600'>Credits exhausted. <a href='/settings/billing' className='text-indigo-400'>Upgrade</a></p>}
        </form>
      </div>

      {results.map((opp:any)=>(<OppCard key={opp.id} opp={opp} onSave={save}/>))}
    </div>
  )
}