'use client'
import{useEffect,useState}from'react'
import Link from'next/link'
import{supabase}from'@/lib/supabase/client-singleton'
import{User,CreditCard,Zap,CheckCircle}from'lucide-react'

export default function SettingsPage(){
  const[user,setUser]=useState<any>(null)
  const[profile,setProfile]=useState<any>(null)
  const[fullName,setFullName]=useState('')
  const[saving,setSaving]=useState(false)
  const[saved,setSaved]=useState(false)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      setUser(session.user)
      const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data);setFullName(data?.full_name||'')
    })
  },[])

  async function save(e:React.FormEvent){
    e.preventDefault();setSaving(true);setSaved(false)
    await supabase.from('profiles').update({full_name:fullName}).eq('id',user.id)
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),3000)
  }

  if(!user)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>

  const used=profile?.generations_used||0,limit=profile?.generations_limit||7,plan=profile?.plan||'free'

  return(
    <div style={{maxWidth:560}}>
      <div className='page-header'><h1>Settings</h1><p>Manage your account and plan</p></div>

      {/* Profile */}
      <div className='card' style={{padding:24,marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <div style={{width:32,height:32,borderRadius:'var(--radius-md)',background:'rgba(99,102,241,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <User size={15} style={{color:'var(--brand-purple)'}}/>
          </div>
          <h3 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)'}}>Profile</h3>
        </div>
        <form onSubmit={save}>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:11,color:'var(--text-tertiary)',marginBottom:6,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em'}}>Email</label>
            <input value={user.email||''} disabled className='input' style={{opacity:0.5,cursor:'not-allowed'}}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:'block',fontSize:11,color:'var(--text-tertiary)',marginBottom:6,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em'}}>Display Name</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder='Your name' className='input'/>
          </div>
          <button type='submit' disabled={saving} className={'btn '+(saved?'btn-ghost':'btn-primary')} style={{gap:6}}>
            {saved?<><CheckCircle size={13}/>Saved!</>:saving?'Saving...':'Save Changes'}
          </button>
        </form>
      </div>

      {/* Plan & Credits */}
      <div className='card' style={{padding:24,marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <div style={{width:32,height:32,borderRadius:'var(--radius-md)',background:'rgba(245,158,11,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Zap size={15} style={{color:'var(--warning)'}}/>
          </div>
          <h3 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)'}}>Plan & Credits</h3>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>Current Plan</div>
            <div style={{fontSize:15,fontWeight:800,color:'var(--text-primary)',textTransform:'capitalize'}}>{plan}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>Validations Used</div>
            <div style={{fontSize:15,fontWeight:800,color:'var(--text-primary)'}}>{used} / {limit}</div>
          </div>
        </div>
        <div style={{height:6,background:'var(--bg-subtle)',borderRadius:99,overflow:'hidden',marginBottom:18}}>
          <div style={{height:'100%',background:used>=limit?'var(--danger)':'linear-gradient(90deg,var(--brand-purple),var(--brand-pink))',borderRadius:99,width:Math.min((used/limit)*100,100)+'%',transition:'width 0.5s'}}/>
        </div>
        {plan==='free'&&<p style={{fontSize:12,color:'var(--text-tertiary)',marginBottom:16}}>Upgrade to Pro for unlimited validations, priority analysis, and competition data.</p>}
        <Link href='/settings/billing' className='btn btn-primary' style={{display:'inline-flex',gap:6}}>
          <CreditCard size={13}/>{plan==='free'?'Upgrade to Pro':'Manage Billing'}
        </Link>
      </div>
    </div>
  )
}