'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{TrendingUp,BookmarkCheck,Trash2,Filter}from'lucide-react'
import Link from'next/link'

function ScoreBadge({score}:{score:number}){
  const color=score>=80?'text-green-400 bg-green-400/10 border-green-400/20':score>=60?'text-nf-amber bg-nf-amber/10 border-nf-amber/20':'text-red-400 bg-red-400/10 border-red-400/20'
  return<span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{score}</span>
}

export default function ProjectsPage(){
  const[opportunities,setOpportunities]=useState<any[]>([])
  const[loading,setLoading]=useState(true)
  const[filter,setFilter]=useState<'all'|'high'|'saved'>('all')
  const[userId,setUserId]=useState<string|null>(null)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      setUserId(session.user.id)
      const{data}=await supabase.from('opportunities').select('*').eq('user_id',session.user.id).order('overall_score',{ascending:false})
      setOpportunities(data||[]);setLoading(false)
    })
  },[])

  const filtered=opportunities.filter(o=>{
    if(filter==='high')return o.overall_score>=70
    return true
  })

  async function del(id:string){
    await supabase.from('opportunities').delete().eq('id',id)
    setOpportunities(o=>o.filter(x=>x.id!==id))
  }

  if(loading)return<div className="flex items-center justify-center h-64"><div className="text-muted-foreground text-sm">Loading...</div></div>

  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Opportunities</h1>
          <p className="text-sm text-muted-foreground">{opportunities.length} opportunities analyzed</p>
        </div>
        <Link href="/generator" className="nf-btn-primary px-4 py-2 rounded-xl text-sm">+ Analyze New</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all','high'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===f?'bg-nf-purple text-white':'bg-nf-surface2 text-muted-foreground hover:text-foreground'}`}>
            {f==='all'?'All Opportunities':'High Score (70+)'}
          </button>
        ))}
      </div>

      {!filtered.length?(
        <div className="nf-card p-12 text-center">
          <TrendingUp size={32} className="text-nf-purple/30 mx-auto mb-3"/>
          <p className="text-muted-foreground text-sm mb-4">{filter==='high'?'No high-score opportunities yet. Try analyzing more niches.':'No opportunities yet.'}</p>
          <Link href="/generator" className="nf-btn-primary px-4 py-2 rounded-lg text-sm">Start Analyzing</Link>
        </div>
      ):(
        <div className="space-y-3">
          {filtered.map(o=>(
            <div key={o.id} className="nf-card p-5 hover:border-nf-purple/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nf-purple/20 to-nf-pink/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={18} className="text-nf-purple"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{o.title}</h3>
                    <ScoreBadge score={o.overall_score}/>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-nf-surface2 text-muted-foreground">{o.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{o.summary?.slice(0,120)}...</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">Demand: <span className="text-nf-purple font-medium">{o.demand_score}</span></span>
                    <span className="text-xs text-muted-foreground">Competition: <span className="text-green-400 font-medium">{o.competition_score}</span></span>
                    <span className="text-xs text-muted-foreground">Market: <span className="font-medium">{o.market_size?.slice(0,20)||'Emerging'}</span></span>
                  </div>
                </div>
                <button onClick={()=>del(o.id)} className="flex-shrink-0 p-2 rounded-lg hover:bg-red-400/10 text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}