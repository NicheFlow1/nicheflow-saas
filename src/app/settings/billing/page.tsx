'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{CheckCircle,Zap,TrendingUp,Shield}from'lucide-react'

const PLANS=[
  {
    id:'free',label:'Free',price:'$0',period:'forever',
    features:['7 trend validations','Real Google Trends data','5-year trend charts','AI market interpretation','Market Radar (3 markets)'],
    cta:'Current Plan',disabled:true,highlight:false
  },
  {
    id:'pro',label:'Pro',price:'$19',period:'per month',
    features:['Unlimited validations','Real Google Trends data','Priority AI analysis','Unlimited Market Radar','Competition X-Ray','Email alerts for GO signals','Export reports'],
    cta:'Upgrade to Pro',disabled:false,highlight:true
  },
  {
    id:'agency',label:'Agency',price:'$49',period:'per month',
    features:['Everything in Pro','5 team seats','White-label reports','API access','Priority support','Custom alert thresholds'],
    cta:'Contact Us',disabled:false,highlight:false
  }
]

export default function BillingPage(){
  const[profile,setProfile]=useState<any>(null)
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data);setLoading(false)
    })
  },[])

  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>

  const currentPlan=profile?.plan||'free'

  return(
    <div>
      <div className='page-header' style={{marginBottom:32}}>
        <h1>Plans & Billing</h1>
        <p>Upgrade for unlimited validations and real competitive intelligence</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}}>
        {PLANS.map(plan=>(
          <div key={plan.id} style={{background:'var(--bg-elevated)',border:'1px solid '+(plan.highlight?'rgba(99,102,241,0.4)':'var(--border-base)'),borderRadius:'var(--radius-2xl)',padding:24,position:'relative',transition:'border-color 0.15s'}}>
            {plan.highlight&&(
              <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:10,fontWeight:800,padding:'3px 12px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>Most Popular</div>
            )}
            {currentPlan===plan.id&&(
              <div style={{position:'absolute',top:14,right:14}}><span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'rgba(34,197,94,0.1)',color:'var(--success)',border:'1px solid rgba(34,197,94,0.2)'}}>CURRENT</span></div>
            )}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>{plan.label}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:4}}>
                <span style={{fontSize:'2rem',fontWeight:900,letterSpacing:'-0.03em',color:'var(--text-primary)'}}>{plan.price}</span>
                <span style={{fontSize:12,color:'var(--text-tertiary)'}}>{plan.period}</span>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              {plan.features.map((f,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <CheckCircle size={12} style={{color:'var(--success)',flexShrink:0}}/>
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{f}</span>
                </div>
              ))}
            </div>
            <button
              disabled={plan.disabled||currentPlan===plan.id}
              onClick={()=>{if(plan.id==='agency')window.open('mailto:hello@nicheflow.ai?subject=Agency Plan','_blank')}}
              className={'btn '+(plan.highlight?'btn-grad':'btn-ghost')}
              style={{width:'100%',justifyContent:'center',opacity:(plan.disabled||currentPlan===plan.id)?0.5:1}}
            >
              {currentPlan===plan.id?'Current Plan':plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className='card' style={{padding:20}}>
        <div style={{fontSize:12,color:'var(--text-tertiary)',textAlign:'center'}}>
          Payment processing coming soon. To unlock Pro early, email{' '}
          <a href='mailto:hello@nicheflow.ai' style={{color:'var(--brand-purple)'}}>hello@nicheflow.ai</a>{' '}
          and we will upgrade your account manually.
        </div>
      </div>
    </div>
  )
}