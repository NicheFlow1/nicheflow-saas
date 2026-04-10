'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{CheckCircle,Zap,Loader}from'lucide-react'

const NOWPAY_API='https://api.nowpayments.io/v1'
const NOWPAY_KEY='9Z5S7VS-F0G4K15-KMJSAJ9-BFZSV4Q'
const SUPA_URL='https://aincmpxokmsygyghvtnm.supabase.co'

const PLANS=[
  {
    id:'free',label:'Free',price:'$0',priceUSD:0,period:'forever',
    features:['7 trend validations','Real Google Trends data','5-year trend charts','AI market interpretation','Market Radar (3 markets)'],
    cta:'Current Plan',highlight:false
  },
  {
    id:'pro',label:'Pro',price:'$19',priceUSD:19,period:'per month',
    features:['Unlimited validations','Real Google Trends data','Priority AI analysis','Unlimited Market Radar','Competition X-Ray','Email GO signal alerts','Export reports'],
    cta:'Upgrade to Pro',highlight:true
  },
  {
    id:'agency',label:'Agency',price:'$49',priceUSD:49,period:'per month',
    features:['Everything in Pro','5 team seats','White-label reports','API access','Priority support','Custom alert thresholds'],
    cta:'Get Agency',highlight:false
  }
]

export default function BillingPage(){
  const[profile,setProfile]=useState<any>(null)
  const[user,setUser]=useState<any>(null)
  const[loading,setLoading]=useState(true)
  const[paying,setPaying]=useState<string|null>(null)
  const[payError,setPayError]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      setUser(session.user)
      const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data);setLoading(false)
    })
  },[])

  async function startPayment(planId:string,priceUSD:number){
    if(!user)return
    setPaying(planId);setPayError('')
    try{
      // Create NowPayments invoice
      const res=await fetch(NOWPAY_API+'/invoice',{
        method:'POST',
        headers:{'x-api-key':NOWPAY_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({
          price_amount:priceUSD,
          price_currency:'usd',
          order_id:'nf-'+planId+'-'+user.id+'-'+Date.now(),
          order_description:'NicheFlow '+planId.charAt(0).toUpperCase()+planId.slice(1)+' Plan',
          ipn_callback_url:SUPA_URL+'/functions/v1/payment-webhook',
          success_url:'https://nicheflow-saas-ahmadzais-projects-d1a202ca.vercel.app/settings/billing?success=1',
          cancel_url:'https://nicheflow-saas-ahmadzais-projects-d1a202ca.vercel.app/settings/billing?cancel=1',
          is_fixed_rate:true,
          is_fee_paid_by_user:false
        })
      })
      const data=await res.json()
      if(data.invoice_url){
        window.open(data.invoice_url,'_blank')
      }else{
        throw new Error(data.message||'Payment initiation failed')
      }
    }catch(err:any){
      setPayError(err.message||'Payment failed. Please try again.')
    }finally{
      setPaying(null)
    }
  }

  if(loading)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}>
      <div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/>
    </div>
  )

  const currentPlan=profile?.plan||'free'
  const urlParams=typeof window!=='undefined'?new URLSearchParams(window.location.search):null
  const success=urlParams?.get('success')
  const cancel=urlParams?.get('cancel')

  return(
    <div style={{maxWidth:900}}>
      <div className='page-header' style={{marginBottom:28}}>
        <h1>Plans & Billing</h1>
        <p>Upgrade for unlimited validations and real competitive intelligence</p>
      </div>

      {success&&(
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:'var(--radius-xl)',marginBottom:20}}>
          <CheckCircle size={16} style={{color:'var(--success)'}}/>
          <div><div style={{fontSize:13,fontWeight:700,color:'var(--success)'}}>Payment received!</div><div style={{fontSize:11,color:'var(--text-tertiary)'}}>Your plan will be upgraded within a few minutes. Refresh the page if it does not update.</div></div>
        </div>
      )}
      {cancel&&(
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'var(--radius-xl)',marginBottom:20}}>
          <div style={{fontSize:13,color:'var(--warning)'}}>Payment cancelled. Your plan has not changed.</div>
        </div>
      )}
      {payError&&(
        <div style={{padding:'12px 16px',background:'var(--surface-nogo)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'var(--radius-lg)',marginBottom:16,fontSize:12,color:'var(--danger)'}}>{payError}</div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
        {PLANS.map(plan=>{
          const isCurrent=currentPlan===plan.id
          const isHigher=plan.priceUSD>(PLANS.find(p=>p.id===currentPlan)?.priceUSD||0)
          return(
            <div key={plan.id} style={{background:'var(--bg-elevated)',border:'1px solid '+(plan.highlight?'rgba(99,102,241,0.4)':'var(--border-base)'),borderRadius:'var(--radius-2xl)',padding:24,position:'relative'}}>
              {plan.highlight&&(
                <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:10,fontWeight:800,padding:'3px 12px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>Most Popular</div>
              )}
              {isCurrent&&(
                <div style={{position:'absolute',top:14,right:14}}>
                  <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'rgba(34,197,94,0.1)',color:'var(--success)',border:'1px solid rgba(34,197,94,0.2)'}}>CURRENT</span>
                </div>
              )}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>{plan.label}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4}}>
                  <span style={{fontSize:'2rem',fontWeight:900,letterSpacing:'-0.03em',color:'var(--text-primary)'}}>{plan.price}</span>
                  <span style={{fontSize:12,color:'var(--text-tertiary)'}}>{plan.period}</span>
                </div>
              </div>
              <div style={{marginBottom:20}}>
                {plan.features.map((f,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:7}}>
                    <CheckCircle size={11} style={{color:'var(--success)',flexShrink:0,marginTop:1}}/>
                    <span style={{fontSize:12,color:'var(--text-secondary)'}}>{f}</span>
                  </div>
                ))}
              </div>
              {isCurrent?(
                <div style={{width:'100%',padding:'9px 14px',textAlign:'center',fontSize:13,color:'var(--text-disabled)',background:'var(--bg-subtle)',borderRadius:'var(--radius-md)',border:'1px solid var(--border-base)'}}>Current Plan</div>
              ):plan.priceUSD===0?(
                <div style={{width:'100%',padding:'9px 14px',textAlign:'center',fontSize:13,color:'var(--text-disabled)',background:'var(--bg-subtle)',borderRadius:'var(--radius-md)',border:'1px solid var(--border-base)'}}>Free Tier</div>
              ):(
                <button
                  onClick={()=>startPayment(plan.id,plan.priceUSD)}
                  disabled={paying===plan.id}
                  className={'btn '+(plan.highlight?'btn-grad':'btn-ghost')}
                  style={{width:'100%',justifyContent:'center',fontSize:13,fontWeight:700}}
                >
                  {paying===plan.id
                    ?<><Loader size={13} style={{animation:'spin 0.8s linear infinite'}}/>{' '}Opening checkout...</>
                    :<><Zap size={13}/>{plan.cta}</>
                  }
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className='card' style={{padding:18}}>
        <div style={{fontSize:12,color:'var(--text-tertiary)'}}>
          <strong style={{color:'var(--text-secondary)'}}>Payments accepted via crypto</strong> (Bitcoin, Ethereum, USDC, and 50+ coins) through NowPayments.
          Your plan upgrades automatically after payment confirmation. Questions? Email{' '}
          <a href='mailto:hello@nicheflow.ai' style={{color:'var(--brand-purple)'}}>hello@nicheflow.ai</a>
        </div>
      </div>
    </div>
  )
}