'use client'
import{useEffect,useState}from'react'
import Link from'next/link'
import{supabase}from'@/lib/supabase/client-singleton'
import{TrendingUp,Wand2,BookmarkCheck,Zap,ChevronRight,Target,DollarSign}from'lucide-react'

function ScoreBadge({score}:{score:number}){
  const color=score>=80?'text-green-400 bg-green-400/10 border-green-400/20':score>=60?'text-nf-amber bg-nf-amber/10 border-nf-amber/20':'text-red-400 bg-red-400/10 border-red-400/20'
  return<span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{score}</span>
}

export default function DashboardPage(){
  const[profile,setProfile]=useState<any>(null)
  const[opportunities,setOpportunities]=useState<any[]>([])
  const[saved,setSaved]=useState<number>(0)
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const uid=session.user.id
      const[{data:pr},{data:opps},{data:sv}]=await Promise.all([
        supabase.from('profiles').select('*').eq('id',uid).single(),
        supabase.from('opportunities').select('*').eq('user_id',uid).order('overall_score',{ascending:false}).limit(5),
        supabase.from('saved_opportunities').select('id',{count:'exact'}).eq('user_id',uid)
      ])
      setProfile(pr);setOpportunities(opps||[]);setSaved(sv?.length||0);setLoading(false)
    })
  },[])

  if(loading)return<div className="flex items-center justify-center h-64"><div className="text-muted-foreground text-sm">Loading intelligence...</div></div>

  const used=profile?.generations_used||0
  const limit=profile?.generations_limit||7

  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Intelligence Hub</h1>
          <p className="text-sm text-muted-foreground">Your opportunity discovery dashboard</p>
        </div>
        <Link href="/generator" className="nf-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
          <Wand2 size={14}/> Find Opportunities
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="nf-card p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={15} className="text-nf-purple"/><span className="text-xs font-mono text-muted-foreground">ANALYZED</span></div>
          <div className="text-3xl font-black">{opportunities.length}</div>
          <div className="text-xs text-muted-foreground mt-1">opportunities</div>
        </div>
        <div className="nf-card p-5">
          <div className="flex items-center gap-2 mb-2"><BookmarkCheck size={15} className="text-nf-pink"/><span className="text-xs font-mono text-muted-foreground">SAVED</span></div>
          <div className="text-3xl font-black">{saved}</div>
          <div className="text-xs text-muted-foreground mt-1">bookmarked</div>
        </div>
        <div className="nf-card p-5">
          <div className="flex items-center gap-2 mb-2"><Zap size={15} className="text-nf-amber"/><span className="text-xs font-mono text-muted-foreground">CREDITS</span></div>
          <div className="text-3xl font-black">{limit-used}</div>
          <div className="text-xs text-muted-foreground mt-1">remaining</div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="nf-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-nf-border">
          <h2 className="text-sm font-semibold">Top Opportunities</h2>
          <Link href="/projects" className="text-xs text-nf-purple flex items-center gap-1">View all<ChevronRight size={12}/></Link>
        </div>
        {!opportunities.length?(
          <div className="p-10 text-center">
            <Wand2 size={32} className="text-nf-purple/30 mx-auto mb-3"/>
            <p className="text-sm text-muted-foreground mb-4">No opportunities analyzed yet.</p>
            <Link href="/generator" className="nf-btn-primary text-sm px-4 py-2 rounded-lg">Start discovering</Link>
          </div>
        ):(
          <div className="divide-y divide-nf-border">
            {opportunities.map((o:any)=>(
              <div key={o.id} className="flex items-center gap-4 px-5 py-4 hover:bg-nf-surface2 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nf-purple/20 to-nf-pink/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} className="text-nf-purple"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{o.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{o.niche}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-muted-foreground">Market</div>
                    <div className="text-xs font-medium">{o.market_size?.slice(0,15)||'Emerging'}</div>
                  </div>
                  <ScoreBadge score={o.overall_score}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/generator" className="nf-card p-5 hover:border-nf-purple/40 transition-colors group">
          <Wand2 size={20} className="text-nf-purple mb-3"/>
          <h3 className="font-semibold text-sm">Analyze Opportunity</h3>
          <p className="text-xs text-muted-foreground mt-1">Deep-dive into any niche or market idea</p>
        </Link>
        <Link href="/projects" className="nf-card p-5 hover:border-nf-pink/40 transition-colors group">
          <BookmarkCheck size={20} className="text-nf-pink mb-3"/>
          <h3 className="font-semibold text-sm">Saved Opportunities</h3>
          <p className="text-xs text-muted-foreground mt-1">Review your bookmarked ideas</p>
        </Link>
      </div>
    </div>
  )
}