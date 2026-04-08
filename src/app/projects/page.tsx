'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{Search,Database,Trash2,TrendingUp}from'lucide-react'
import Link from'next/link'

export default function ProjectsPage(){
  const[reports,setReports]=useState<any[]>([])
  const[loading,setLoading]=useState(true)
  const[search,setSearch]=useState('')
  const[filter,setFilter]=useState('all')

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const{data}=await supabase.from('validation_reports').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false})
      setReports(data||[]);setLoading(false)
    })
  },[])

  const filtered=reports.filter(r=>{
    const ms=!search||r.keyword?.toLowerCase().includes(search.toLowerCase())
    const mf=filter==='all'||(filter==='go'&&r.signal==='GO')||(filter==='real'&&r.data_sources?.some((s:string)=>s.includes('Google')))
    return ms&&mf
  })

  async function del(id:string){await supabase.from('validation_reports').delete().eq('id',id);setReports(r=>r.filter(x=>x.id!==id))}

  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>

  return(
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
        <div><h1 style={{fontSize:'1.4rem',fontWeight:900,letterSpacing:'-0.025em'}}>Validation Reports</h1><p style={{fontSize:13,color:'var(--text-tertiary)',marginTop:3}}>{reports.length} reports</p></div>
        <Link href='/validate' className='btn btn-primary'><Search size={13}/>New Validation</Link>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:200,position:'relative'}}><Search size={12} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text-disabled)',pointerEvents:'none'}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search reports...' className='input' style={{paddingLeft:34}}/></div>
        <div className='filter-pills'>
          {([['all','All'],['go','GO Signals'],['real','Real Data']] as [string,string][]).map(([f,l])=>(
            <button key={f} onClick={()=>setFilter(f)} className={'filter-pill'+(filter===f?' active':'')}>{l}</button>
          ))}
        </div>
      </div>
      {!filtered.length?(
        <div className='card'><div className='empty-state'><p className='empty-title'>{search?'No matches':'No reports yet'}</p><p className='empty-desc'>Validate a keyword to build your report history</p><Link href='/validate' className='btn btn-primary btn-sm'>Validate Now</Link></div></div>
      ):(
        <div>{filtered.map((r:any)=>(
          <div key={r.id} className='opp-row'>
            <div className='opp-row-icon'><TrendingUp size={15} style={{color:'var(--brand-purple)'}}/></div>
            <div className='opp-row-meta'>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                <span className='opp-row-title'>{r.keyword}</span>
                <span className={'badge '+(r.signal==='GO'?'badge-go':r.signal==='WAIT'?'badge-wait':'badge-nogo')}>{r.signal}</span>
                {r.data_sources?.some((s:string)=>s.includes('Google'))&&<span style={{fontSize:9,padding:'1px 5px',borderRadius:3,background:'rgba(34,197,94,0.08)',color:'var(--success)',border:'1px solid rgba(34,197,94,0.15)',fontFamily:'monospace',fontWeight:600}}>REAL DATA</span>}
              </div>
              <div style={{display:'flex',gap:12}}>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>Score <span style={{fontWeight:700,color:'var(--text-secondary)'}}>{r.overall_score||0}</span></span>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>Trend <span style={{fontWeight:700,color:'var(--brand-purple)'}}>{r.trend_score||0}</span></span>
                <span style={{fontSize:10,color:'var(--text-disabled)'}}>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{flexShrink:0}}><button onClick={()=>del(r.id)} className='btn btn-danger btn-sm'><Trash2 size={12}/></button></div>
          </div>
        ))}</div>
      )}
    </div>
  )
}