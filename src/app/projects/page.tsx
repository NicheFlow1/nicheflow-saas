'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{TrendingUp,Trash2,Search,Filter,BookmarkCheck,Crosshair}from'lucide-react'
import Link from'next/link'

function ScoreBadge({s}:{s:number}){
  const c=s>=80?'text-emerald-400 bg-emerald-400/10 border-emerald-400/20':s>=60?'text-amber-400 bg-amber-400/10 border-amber-400/20':'text-red-400 bg-red-400/10 border-red-400/20'
  return<span className={'text-[10px] font-black px-2 py-0.5 rounded-full border '+c}>{s}</span>
}

export default function ProjectsPage(){
  const[opps,setOpps]=useState<any[]>([])
  const[loading,setLoading]=useState(true)
  const[filter,setFilter]=useState('all')
  const[search,setSearch]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const{data}=await supabase.from('opportunities').select('*').eq('user_id',session.user.id).order('overall_score',{ascending:false})
      setOpps(data||[]);setLoading(false)
    })
  },[])

  const filtered=opps.filter(o=>{
    const matchSearch=!search||o.title?.toLowerCase().includes(search.toLowerCase())||o.niche?.toLowerCase().includes(search.toLowerCase())
    const matchFilter=filter==='all'||(filter==='go'&&o.go_no_go==='GO')||(filter==='high'&&o.overall_score>=70)
    return matchSearch&&matchFilter
  })

  async function del(id:string){await supabase.from('opportunities').delete().eq('id',id);setOpps(o=>o.filter(x=>x.id!==id))}

  if(loading)return<div className='flex items-center justify-center h-64'><div className='w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin'/></div>

  return(
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <div><h1 className='text-2xl font-black text-white'>Intelligence Base</h1><p className='text-sm text-gray-500 mt-0.5'>{opps.length} opportunities analyzed</p></div>
        <Link href='/generator' className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold hover:opacity-90'>+ Analyze</Link>
      </div>

      {/* SEARCH + FILTERS */}
      <div className='flex gap-2'>
        <div className='flex-1 relative'><Search size={13} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600'/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search opportunities...' className='w-full pl-8 pr-4 py-2 bg-[#0a0a14] border border-[#1a1a2e] rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50'/></div>
        {['all','go','high'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={'px-3 py-2 rounded-xl text-xs font-bold border transition-all '+(filter===f?'bg-indigo-500/10 border-indigo-500/40 text-indigo-300':'bg-[#0a0a14] border-[#1a1a2e] text-gray-600 hover:border-[#2a2a3e]')}>
            {f==='all'?'All':f==='go'?'GO Signals':'High Score'}
          </button>
        ))}
      </div>

      {!filtered.length?(
        <div className='intel-card p-12 text-center'>
          <Crosshair size={28} className='text-indigo-500/20 mx-auto mb-3'/>
          <p className='text-sm text-gray-600 mb-4'>{search?'No matches found.':filter!=='all'?'No '+filter+' opportunities yet.':'No intelligence data yet.'}</p>
          <Link href='/generator' className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20'>Start analyzing</Link>
        </div>
      ):(
        <div className='space-y-2'>
          {filtered.map(o=>(
            <div key={o.id} className='intel-card-glow p-4'>
              <div className='flex items-start gap-3'>
                <div className='w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0 border border-indigo-500/10'><TrendingUp size={16} className='text-indigo-400'/></div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap mb-1'>
                    <span className='text-sm font-bold text-white'>{o.title}</span>
                    <ScoreBadge s={o.overall_score}/>
                    {o.go_no_go==='GO'&&<span className='text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'>GO</span>}
                    <span className='text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0f0f1e] text-gray-500 border border-[#1a1a2e]'>{o.category}</span>
                  </div>
                  <p className='text-[11px] text-gray-500 mb-2 line-clamp-2'>{o.summary}</p>
                  <div className='flex items-center gap-4'>
                    <span className='text-[10px] text-gray-600'>Demand <span className='text-indigo-400 font-bold'>{o.demand_score}</span></span>
                    <span className='text-[10px] text-gray-600'>Competition <span className='text-emerald-400 font-bold'>{o.competition_score}</span></span>
                    <span className='text-[10px] text-gray-600'>Stage <span className='text-amber-400 font-bold capitalize'>{o.lifecycle_stage}</span></span>
                  </div>
                </div>
                <button onClick={()=>del(o.id)} className='flex-shrink-0 p-2 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-400/5 transition-colors'><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}