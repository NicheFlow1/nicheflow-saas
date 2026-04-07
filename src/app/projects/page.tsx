'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{TrendingUp,Trash2,Search}from'lucide-react'
import Link from'next/link'
function ScoreBadge({s}:{s:number}){const c=s>=80?'badge-go':s>=60?'badge-wait':'badge-nogo';return<span className={'badge '+c}>{s}</span>}
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
    const ms=!search||o.title?.toLowerCase().includes(search.toLowerCase())||o.niche?.toLowerCase().includes(search.toLowerCase())
    const mf=filter==='all'||(filter==='go'&&o.go_no_go==='GO')||(filter==='high'&&o.overall_score>=70)
    return ms&&mf
  })
  async function del(id:string){await supabase.from('opportunities').delete().eq('id',id);setOpps(o=>o.filter(x=>x.id!==id))}
  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>
  return(
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
        <div><h1 style={{fontSize:'1.4rem',fontWeight:800,letterSpacing:'-0.025em',color:'var(--text-primary)'}}>Intelligence Base</h1><p style={{fontSize:13,color:'var(--text-tertiary)',marginTop:3}}>{opps.length} opportunities analyzed</p></div>
        <Link href='/generator' className='btn btn-primary'>+ Analyze</Link>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <div className='search-wrap' style={{flex:1,minWidth:200}}>
          <Search size={12} className='search-icon'/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search opportunities...' className='input search-input'/>
        </div>
        <div className='filter-pills'>
          {([['all','All'],['go','GO Signals'],['high','High Score']] as [string,string][]).map(([f,l])=>(
            <button key={f} onClick={()=>setFilter(f)} className={'filter-pill'+(filter===f?' active':'')}>{l}</button>
          ))}
        </div>
      </div>
      {!filtered.length?(
        <div className='card'><div className='empty-state'><div className='empty-icon'><TrendingUp size={20} style={{color:'var(--brand-purple)',opacity:0.4}}/></div><p className='empty-title'>{search?'No matches':'No opportunities yet'}</p><p className='empty-desc'>{filter!=='all'?'Try a different filter':'Analyze a niche to get started'}</p><Link href='/generator' className='btn btn-primary btn-sm'>Start Analyzing</Link></div></div>
      ):(
        <div>{filtered.map(o=>(
          <div key={o.id} className='opp-row'>
            <div className='opp-row-icon'><TrendingUp size={16} style={{color:'var(--brand-purple)'}}/></div>
            <div className='opp-row-meta'>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                <span className='opp-row-title'>{o.title}</span>
                <ScoreBadge s={o.overall_score}/>
                {o.go_no_go==='GO'&&<span className='badge badge-go'>GO</span>}
                <span className='tag'>{o.category}</span>
              </div>
              <p style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{o.summary}</p>
              <div style={{display:'flex',gap:14}}>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>Demand <span style={{color:'var(--brand-purple)',fontWeight:700}}>{o.demand_score}</span></span>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>Low Comp <span style={{color:'var(--success)',fontWeight:700}}>{o.competition_score}</span></span>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>Stage <span style={{color:'var(--warning)',fontWeight:700,textTransform:'capitalize'}}>{o.lifecycle_stage}</span></span>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
              <button onClick={()=>del(o.id)} className='btn btn-danger btn-sm' title='Delete'><Trash2 size={12}/></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  )
}