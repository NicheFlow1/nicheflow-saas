'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{Wand2,TrendingUp,Target,DollarSign,Zap,Clock,ChevronRight,Sparkles,Search,BookmarkPlus,AlertCircle}from'lucide-react'

function ScoreBar({label,score,color}:{label:string,score:number,color:string}){
  return(
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-bold">{score}/100</span>
      </div>
      <div className="h-1.5 bg-nf-surface3 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{width:score+'%'}}/>
      </div>
    </div>
  )
}

function OpportunityCard({opp,onSave}:{opp:any,onSave:(id:string)=>void}){
  const scoreColor=opp.overall_score>=80?'text-green-400':opp.overall_score>=60?'text-nf-amber':'text-red-400'
  const scoreBg=opp.overall_score>=80?'bg-green-400/10 border-green-400/20':opp.overall_score>=60?'bg-nf-amber/10 border-nf-amber/20':'bg-red-400/10 border-red-400/20'
  return(
    <div className="nf-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-nf-purple/10 text-nf-purple border border-nf-purple/20">{opp.category}</span>
            {opp.tags?.slice(0,2).map((t:string)=><span key={t} className="text-xs font-mono px-2 py-0.5 rounded-full bg-nf-surface2 text-muted-foreground">{t}</span>)}
          </div>
          <h2 className="text-lg font-bold">{opp.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{opp.summary}</p>
        </div>
        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl border flex flex-col items-center justify-center ${scoreBg}`}>
          <span className={`text-2xl font-black ${scoreColor}`}>{opp.overall_score}</span>
          <span className="text-xs text-muted-foreground">score</span>
        </div>
      </div>

      {/* Score bars */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-nf-surface2 rounded-xl">
        <ScoreBar label="Demand" score={opp.demand_score} color="bg-nf-purple"/>
        <ScoreBar label="Low Competition" score={opp.competition_score} color="bg-green-400"/>
        <ScoreBar label="Monetization" score={opp.monetization_score} color="bg-nf-amber"/>
        <ScoreBar label="Scalability" score={opp.scalability_score} color="bg-nf-pink"/>
      </div>

      {/* Market + Audience */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-nf-surface2 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1"><TrendingUp size={12} className="text-nf-purple"/><span className="text-xs text-muted-foreground">Market Size</span></div>
          <p className="text-sm font-semibold">{opp.market_size||'Emerging'}</p>
        </div>
        <div className="p-3 bg-nf-surface2 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1"><Target size={12} className="text-nf-pink"/><span className="text-xs text-muted-foreground">Audience</span></div>
          <p className="text-sm font-semibold">{opp.target_audience?.slice(0,40)||'Broad'}</p>
        </div>
      </div>

      {/* Trend Signals */}
      {opp.trend_signals?.length>0&&(
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Trend Signals</h3>
          <div className="space-y-2">
            {opp.trend_signals.slice(0,3).map((s:any,i:number)=>(
              <div key={i} className="flex items-center gap-3 p-2.5 bg-nf-surface2 rounded-lg">
                <span className="text-xs font-mono w-20 text-nf-purple flex-shrink-0">{s.platform}</span>
                <span className="text-xs text-muted-foreground flex-1">{s.signal}</span>
                <div className="w-12 h-1.5 bg-nf-surface3 rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full bg-nf-purple rounded-full" style={{width:(s.strength||50)+'%'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points */}
      {opp.pain_points?.length>0&&(
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Pain Points Detected</h3>
          <div className="space-y-1.5">
            {opp.pain_points.slice(0,3).map((p:any,i:number)=>(
              <div key={i} className="flex items-start gap-2">
                <AlertCircle size={12} className="text-nf-amber mt-0.5 flex-shrink-0"/>
                <span className="text-xs text-muted-foreground">{p.pain}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${p.intensity==='high'?'bg-red-400/10 text-red-400':p.intensity==='medium'?'bg-nf-amber/10 text-nf-amber':'bg-green-400/10 text-green-400'}`}>{p.intensity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monetization */}
      {opp.monetization_paths?.length>0&&(
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Monetization Paths</h3>
          <div className="space-y-2">
            {opp.monetization_paths.slice(0,2).map((m:any,i:number)=>(
              <div key={i} className="flex items-center gap-3 p-2.5 bg-nf-surface2 rounded-lg">
                <DollarSign size={12} className="text-green-400 flex-shrink-0"/>
                <div className="flex-1">
                  <span className="text-xs font-semibold">{m.model}</span>
                  <span className="text-xs text-nf-purple ml-2">{m.price_point}</span>
                </div>
                <span className="text-xs text-muted-foreground">{m.timeline}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Steps */}
      {opp.execution_steps?.length>0&&(
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Execution Roadmap</h3>
          <div className="space-y-2">
            {opp.execution_steps.map((s:any,i:number)=>(
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-nf-purple/20 border border-nf-purple/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-nf-purple">{i+1}</span>
                  </div>
                  {i<opp.execution_steps.length-1&&<div className="w-px flex-1 bg-nf-border mt-1"/>}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-nf-purple">{s.phase}</span>
                    <span className="text-xs text-muted-foreground">{s.cost}</span>
                  </div>
                  <p className="text-xs font-medium mt-0.5">{s.action}</p>
                  <p className="text-xs text-muted-foreground">{s.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First Revenue Path */}
      {opp.raw_ai_output?.first_revenue_path&&(
        <div className="p-3 bg-green-400/5 border border-green-400/20 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1"><DollarSign size={12} className="text-green-400"/><span className="text-xs font-mono text-green-400">First Revenue Path (30 days)</span></div>
          <p className="text-xs text-muted-foreground">{opp.raw_ai_output.first_revenue_path}</p>
        </div>
      )}

      {/* Unique Insight */}
      {opp.raw_ai_output?.unique_insight&&(
        <div className="p-3 bg-nf-purple/5 border border-nf-purple/20 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1"><Sparkles size={12} className="text-nf-purple"/><span className="text-xs font-mono text-nf-purple">Key Insight</span></div>
          <p className="text-xs text-muted-foreground">{opp.raw_ai_output.unique_insight}</p>
        </div>
      )}

      <button onClick={()=>onSave(opp.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-nf-border text-sm text-muted-foreground hover:bg-nf-surface2 hover:text-foreground transition-all">
        <BookmarkPlus size={14}/> Save Opportunity
      </button>
    </div>
  )
}

export default function GeneratorPage(){
  const[session,setSession]=useState<any>(null)
  const[profile,setProfile]=useState<any>(null)
  const[niche,setNiche]=useState('')
  const[mode,setMode]=useState<'analyze'|'discover'>('analyze')
  const[loading,setLoading]=useState(false)
  const[opportunities,setOpportunities]=useState<any[]>([])
  const[error,setError]=useState('')
  const[savedIds,setSavedIds]=useState<Set<string>>(new Set())

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session:s}})=>{
      if(!s)return
      setSession(s)
      const{data}=await supabase.from('profiles').select('*').eq('id',s.user.id).single()
      setProfile(data)
    })
  },[])

  async function analyze(e:React.FormEvent){
    e.preventDefault()
    if(!niche.trim()||!session)return
    setLoading(true);setError('');setOpportunities([])
    try{
      const res=await fetch('https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/analyze-opportunity',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
        body:JSON.stringify({niche,mode})
      })
      const data=await res.json()
      if(!res.ok){setError(data.error||'Analysis failed');return}
      setOpportunities(data.opportunities||[])
      setProfile((p:any)=>p?{...p,generations_used:(p.generations_used||0)+1}:p)
    }catch(err){
      setError('Network error. Please try again.')
    }finally{
      setLoading(false)
    }
  }

  async function saveOpp(id:string){
    if(!session)return
    await supabase.from('saved_opportunities').upsert({user_id:session.user.id,opportunity_id:id})
    setSavedIds(s=>new Set([...s,id]))
  }

  const used=profile?.generations_used||0
  const limit=profile?.generations_limit||7
  const remaining=limit-used

  return(
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Opportunity Engine</h1>
          <p className="text-sm text-muted-foreground">Find high-demand, low-competition opportunities before others</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">{remaining} analyses left</div>
          <div className="h-1.5 w-24 bg-nf-surface3 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-nf-purple to-nf-pink rounded-full" style={{width:Math.min((used/limit)*100,100)+'%'}}/>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="nf-card p-6">
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setMode('analyze')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode==='analyze'?'bg-nf-purple text-white':'bg-nf-surface2 text-muted-foreground hover:text-foreground'}`}>
            <Wand2 size={14} className="inline mr-1.5"/>Deep Analysis
          </button>
          <button onClick={()=>setMode('discover')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode==='discover'?'bg-nf-purple text-white':'bg-nf-surface2 text-muted-foreground hover:text-foreground'}`}>
            <Search size={14} className="inline mr-1.5"/>Discover Opportunities
          </button>
        </div>
        <form onSubmit={analyze} className="space-y-3">
          <textarea value={niche} onChange={e=>setNiche(e.target.value)}
            placeholder={mode==='analyze'?"Enter a niche, market, or idea...
e.g. AI tools for solo lawyers, eco pet products, remote team culture software":"Enter a broad space to explore...
e.g. fintech, health & wellness, creator economy"}
            rows={3} className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nf-purple/60 resize-none"/>
          {error&&<p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
          <button type="submit" disabled={loading||!niche.trim()||remaining<=0}
            className="w-full nf-btn-primary py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {loading?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Analyzing market intelligence...</>:<><Sparkles size={15}/>{mode==='analyze'?'Analyze Opportunity':'Discover 3 Opportunities'}</>}
          </button>
          {remaining<=0&&<p className="text-xs text-center text-muted-foreground">Generation limit reached. <a href="/settings/billing" className="text-nf-purple">Upgrade your plan</a></p>}
        </form>
      </div>

      {/* Results */}
      {opportunities.map((opp:any)=>(
        <OpportunityCard key={opp.id} opp={opp} onSave={saveOpp}/>
      ))}
    </div>
  )
}