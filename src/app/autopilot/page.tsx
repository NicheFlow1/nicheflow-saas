'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import Link from'next/link'
import{Zap,TrendingUp,Radio,Sparkles,RefreshCw,Plus,ArrowUpRight,ChevronRight}from'lucide-react'

const AUTOPILOT_FN='https://aincmpxokmsygyghvtnm.supabase.co/functions/v1/autopilot'

function SignalPill({v}:{v:string}){
  const s=v==='GO'?{bg:'rgba(34,197,94,.1)',br:'rgba(34,197,94,.25)',c:'var(--success)',d:'#22c55e'}
    :v==='WAIT'?{bg:'rgba(245,158,11,.1)',br:'rgba(245,158,11,.25)',c:'var(--warning)',d:'#f59e0b'}
    :{bg:'rgba(239,68,68,.1)',br:'rgba(239,68,68,.25)',c:'var(--danger)',d:'#ef4444'}
  return<span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 8px',borderRadius:99,background:s.bg,border:'1px solid '+s.br,fontSize:10,fontWeight:800,color:s.c,textTransform:'uppercase',letterSpacing:'.05em'}}>
    <span style={{width:5,height:5,borderRadius:'50%',background:s.d,flexShrink:0}}/>{v}
  </span>
}

export default function AutopilotPage(){
  const[session,setSession]=useState<any>(null)
  const[loading,setLoading]=useState(false)
  const[briefing,setBriefing]=useState<any>(null)
  const[headline,setHeadline]=useState('')
  const[insight,setInsight]=useState('')
  const[kits,setKits]=useState<any[]>([])
  const[watchlist,setWatchlist]=useState<any[]>([])
  const[newKeyword,setNewKeyword]=useState('')
  const[addingKw,setAddingKw]=useState(false)
  const[error,setError]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session:s}})=>{
      if(!s)return
      setSession(s)
      const[{data:today},{data:sk},{data:wl}]=await Promise.all([
        supabase.from('daily_briefings').select('*').eq('user_id',s.user.id).order('briefing_date',{ascending:false}).limit(1),
        supabase.from('starter_kits').select('id,keyword,signal,overall_score,one_liner,created_at').eq('user_id',s.user.id).order('created_at',{ascending:false}).limit(6),
        supabase.from('watchlist').select('*').eq('user_id',s.user.id).eq('is_active',true).order('last_score',{ascending:false})
      ])
      if(today?.[0]){setBriefing(today[0]);setHeadline("Today's Market Intelligence")}
      setKits(sk||[])
      setWatchlist(wl||[])
    })
  },[])

  async function generateBriefing(){
    if(!session)return
    setLoading(true);setError('')
    const{data:{session:fresh}}=await supabase.auth.getSession()
    try{
      const res=await fetch(AUTOPILOT_FN,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+(fresh?.access_token||session.access_token)},body:JSON.stringify({action:'generate_briefing'})})
      const d=await res.json()
      if(!res.ok)throw new Error(d.error||'Failed')
      setBriefing(d.briefing);setHeadline(d.headline||"Today's Intelligence");setInsight(d.todays_insight||'')
    }catch(e:any){setError(e.message)}
    finally{setLoading(false)}
  }

  async function addToWatchlist(){
    if(!newKeyword.trim()||!session)return
    setAddingKw(true)
    await supabase.from('watchlist').upsert({user_id:session.user.id,keyword:newKeyword.trim()},{onConflict:'user_id,keyword'})
    const{data}=await supabase.from('watchlist').select('*').eq('user_id',session.user.id).eq('is_active',true).order('last_score',{ascending:false})
    setWatchlist(data||[]);setNewKeyword('');setAddingKw(false)
  }

  const opps=briefing?.opportunities||[]
  const hotTrends=briefing?.hot_trends||[]

  return(
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}><Zap size={16} style={{color:'white'}}/></div>
            <h1 style={{fontSize:'1.4rem',fontWeight:900,letterSpacing:'-.025em'}}>Autopilot</h1>
            <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'rgba(99,102,241,.1)',color:'var(--brand-purple)',border:'1px solid rgba(99,102,241,.2)',textTransform:'uppercase',letterSpacing:'.05em'}}>BETA</span>
          </div>
          <p style={{fontSize:13,color:'var(--text-tertiary)'}}>AI scans markets daily. Get GO signals and complete starter kits.</p>
        </div>
        <button onClick={generateBriefing} disabled={loading} className='btn btn-grad' style={{gap:6}}>
          {loading?<><div className='spinner' style={{width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white'}}/>Scanning...</>:<><RefreshCw size={13}/>Get Today's Briefing</>}
        </button>
      </div>

      {error&&<div style={{padding:'10px 14px',background:'var(--surface-nogo)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'var(--radius-lg)',fontSize:12,color:'var(--danger)',marginBottom:16}}>{error}</div>}

      {!briefing&&!loading&&(
        <div style={{textAlign:'center',padding:'60px 24px',background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:'var(--radius-2xl)',marginBottom:24}}>
          <div style={{fontSize:44,marginBottom:16}}>&#x1F50D;</div>
          <h3 style={{fontSize:'1.1rem',fontWeight:800,marginBottom:8}}>No briefing yet today</h3>
          <p style={{fontSize:13,color:'var(--text-tertiary)',marginBottom:20,maxWidth:400,margin:'0 auto 20px'}}>Click the button above &#x2014; ARIA will scan trending markets using real Google Trends data and deliver your daily intelligence brief.</p>
          <button onClick={generateBriefing} className='btn btn-grad' style={{gap:6}}><Zap size={13}/>Generate Briefing</button>
        </div>
      )}

      {loading&&(
        <div style={{textAlign:'center',padding:'60px 24px',background:'var(--bg-elevated)',border:'1px solid rgba(99,102,241,.2)',borderRadius:'var(--radius-2xl)',marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><Radio size={20} style={{color:'white'}}/></div>
          <h3 style={{fontSize:'1rem',fontWeight:800,marginBottom:6}}>ARIA is scanning markets...</h3>
          <p style={{fontSize:12,color:'var(--text-tertiary)'}}>Fetching real Google Trends data &#183; Analyzing signals &#183; Building your briefing</p>
        </div>
      )}

      {briefing&&!loading&&(
        <div>
          <div style={{padding:'16px 20px',background:'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05))',border:'1px solid rgba(99,102,241,.2)',borderRadius:'var(--radius-2xl)',marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
              <Sparkles size={12} style={{color:'var(--brand-purple)'}}/>
              <span style={{fontSize:9,fontWeight:700,color:'var(--brand-purple)',textTransform:'uppercase',letterSpacing:'.07em'}}>ARIA Daily Brief &#183; {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</span>
            </div>
            <h2 style={{fontSize:'1.1rem',fontWeight:900,color:'var(--text-primary)',marginBottom:insight?6:0}}>{headline}</h2>
            {insight&&<p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6,fontStyle:'italic'}}>&#x1F4A1; {insight}</p>}
          </div>

          {opps.length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:10,fontWeight:800,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12}}>Top Opportunities Today</div>
              {opps.map((opp:any,i:number)=>(
                <div key={i} style={{background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:'var(--radius-2xl)',padding:20,marginBottom:10}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:i===0?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(99,102,241,.12)',color:i===0?'white':'var(--brand-purple)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flexShrink:0}}>{opp.rank||i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                        <span style={{fontSize:14,fontWeight:800,color:'var(--text-primary)'}}>{opp.market}</span>
                        <SignalPill v={opp.signal||'WAIT'}/>
                        {opp.time_sensitive&&<span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:3,background:'rgba(245,158,11,.1)',color:'var(--warning)',border:'1px solid rgba(245,158,11,.2)'}}>&#x26A1; ACT NOW</span>}
                      </div>
                      <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6,marginBottom:6}}>{opp.why_now}</p>
                      {opp.trend_evidence&&<p style={{fontSize:11,color:'var(--brand-purple)',fontStyle:'italic',marginBottom:8}}>&#x1F4CA; {opp.trend_evidence}</p>}
                      <div style={{padding:'8px 12px',background:'rgba(34,197,94,.05)',border:'1px solid rgba(34,197,94,.15)',borderRadius:'var(--radius-md)'}}>
                        <span style={{fontSize:10,fontWeight:700,color:'var(--success)'}}>First move: </span>
                        <span style={{fontSize:11,color:'var(--text-secondary)'}}>{opp.first_move}</span>
                      </div>
                    </div>
                    <div style={{flexShrink:0,textAlign:'center',background:'var(--bg-overlay)',borderRadius:12,padding:'10px 14px'}}>
                      <div style={{fontSize:'1.3rem',fontWeight:900,color:(opp.score||0)>=65?'var(--success)':(opp.score||0)>=40?'var(--warning)':'var(--danger)'}}>{opp.score||0}</div>
                      <div style={{fontSize:8,color:'var(--text-disabled)',textTransform:'uppercase'}}>score</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <Link href={'/validate?keyword='+encodeURIComponent(opp.market)} className='btn btn-ghost btn-sm' style={{flex:1,justifyContent:'center'}}><TrendingUp size={11}/>Validate</Link>
                    <Link href={'/autopilot/starter?keyword='+encodeURIComponent(opp.market)} className='btn btn-primary btn-sm' style={{flex:1,justifyContent:'center'}}><Zap size={11}/>Starter Kit</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hotTrends.length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:10,fontWeight:800,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12}}>Trending Signals</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
                {hotTrends.map((t:any,i:number)=>(
                  <div key={i} style={{padding:'12px 14px',background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:'var(--radius-lg)'}}>
                    <span style={{fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:3,background:t.momentum==='breakout'?'rgba(245,158,11,.1)':'rgba(34,197,94,.08)',color:t.momentum==='breakout'?'var(--warning)':'var(--success)',textTransform:'uppercase',display:'inline-block',marginBottom:4}}>{t.momentum}</span>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--text-primary)',marginBottom:3}}>{t.trend}</div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',lineHeight:1.5}}>{t.opportunity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {kits.length>0&&(
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:800,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.07em'}}>Your Starter Kits</div>
            <Link href='/autopilot/starter' style={{fontSize:11,color:'var(--brand-purple)',textDecoration:'none',display:'flex',alignItems:'center',gap:3}}>New<ChevronRight size={11}/></Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8}}>
            {kits.map((k:any)=>(
              <Link key={k.id} href={'/autopilot/kit/'+k.id} style={{padding:'14px',background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:'var(--radius-xl)',textDecoration:'none',display:'block'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                  <span style={{fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:3,background:k.signal==='GO'?'rgba(34,197,94,.1)':'rgba(245,158,11,.1)',color:k.signal==='GO'?'var(--success)':'var(--warning)',border:'1px solid '+(k.signal==='GO'?'rgba(34,197,94,.2)':'rgba(245,158,11,.2)')}}>{k.signal}</span>
                  <span style={{fontSize:9,fontWeight:700,color:'var(--brand-purple)'}}>{k.overall_score}/100</span>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:'var(--text-primary)',marginBottom:3}}>{k.keyword}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.4}}>{k.one_liner||'Starter kit ready'}</div>
                <div style={{display:'flex',alignItems:'center',gap:3,marginTop:8,fontSize:10,color:'var(--brand-purple)',fontWeight:600}}>View<ArrowUpRight size={10}/></div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:'var(--radius-2xl)',padding:20}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:800,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.07em',display:'flex',alignItems:'center',gap:6}}><Radio size={11} style={{color:'var(--brand-purple)'}}/>Watchlist</div>
          <span style={{fontSize:10,color:'var(--text-disabled)'}}>{watchlist.length} markets</span>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:watchlist.length?16:8}}>
          <input value={newKeyword} onChange={e=>setNewKeyword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addToWatchlist()} placeholder='Add a market to track...' className='input' style={{flex:1,fontSize:12}}/>
          <button onClick={addToWatchlist} disabled={!newKeyword.trim()||addingKw} className='btn btn-primary btn-sm'><Plus size={12}/></button>
        </div>
        {!watchlist.length&&<div style={{textAlign:'center',padding:'16px 0',color:'var(--text-disabled)',fontSize:12}}>Add markets above to track their GO signals over time.</div>}
        {watchlist.map((item:any)=>(
          <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:item.last_score>=65?'rgba(34,197,94,.1)':item.last_score>=40?'rgba(245,158,11,.1)':'rgba(99,102,241,.1)',color:item.last_score>=65?'var(--success)':item.last_score>=40?'var(--warning)':'var(--brand-purple)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flexShrink:0}}>{item.last_score||'&#x2014;'}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>{item.keyword}</div>
              <div style={{fontSize:10,color:'var(--text-disabled)'}}>{item.last_checked_at?'Updated '+new Date(item.last_checked_at).toLocaleDateString():'Not scanned yet'}</div>
            </div>
            <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:99,background:item.last_signal==='GO'?'rgba(34,197,94,.1)':'rgba(99,102,241,.08)',color:item.last_signal==='GO'?'var(--success)':'var(--brand-purple)',border:'1px solid '+(item.last_signal==='GO'?'rgba(34,197,94,.25)':'rgba(99,102,241,.15)')}}>{item.last_signal||'TRACKING'}</span>
            <Link href={'/validate?keyword='+encodeURIComponent(item.keyword)} className='btn btn-ghost btn-sm'><TrendingUp size={11}/></Link>
          </div>
        ))}
      </div>
    </div>
  )
}
