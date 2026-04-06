'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
import{User,Shield,Zap}from'lucide-react'
import Link from'next/link'

export default function SettingsPage(){
  const[user,setUser]=useState<any>(null)
  const[profile,setProfile]=useState<any>(null)
  const[name,setName]=useState('')
  const[saving,setSaving]=useState(false)
  const[saved,setSaved]=useState(false)
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      setUser(session.user)
      const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data);setName(data?.full_name||'')
    })
  },[])
  async function save(e:React.FormEvent){
    e.preventDefault();setSaving(true);setSaved(false)
    await supabase.from('profiles').update({full_name:name}).eq('id',user.id)
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500)
  }
  if(!user)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300}}><div style={{fontSize:11,color:'var(--text-muted)',fontFamily:'monospace'}}>Loading...</div></div>
  const used=profile?.generations_used||0,limit=profile?.generations_limit||7,plan=profile?.plan||'free'
  return(
    <div style={{maxWidth:540,margin:'0 auto',paddingTop:4}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:900,letterSpacing:-0.5,color:'var(--text-primary)',marginBottom:4}}>Settings</h1>
        <p style={{fontSize:12,color:'var(--text-muted)'}}>Manage your account and preferences</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div className='intel-card' style={{padding:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}><User size={13} style={{color:'#818cf8'}}/><span style={{fontSize:10,fontWeight:700,fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',color:'#818cf8'}}>Profile</span></div>
          <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:600,color:'var(--text-muted)',marginBottom:5,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.05em'}}>Email</label>
              <input value={user.email||''} disabled className='intel-input' style={{opacity:0.45,cursor:'not-allowed'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:600,color:'var(--text-muted)',marginBottom:5,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.05em'}}>Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className='intel-input' placeholder='Your name'/>
            </div>
            <button type='submit' disabled={saving} className='btn-primary' style={{alignSelf:'flex-start'}}>{saving?'Saving...':saved?'Saved!':'Save Changes'}</button>
          </form>
        </div>
        <div className='intel-card' style={{padding:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}><Zap size={13} style={{color:'#fbbf24'}}/><span style={{fontSize:10,fontWeight:700,fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',color:'#fbbf24'}}>Plan</span></div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:800,color:'var(--text-primary)',marginBottom:2,textTransform:'capitalize'}}>{plan} Plan</div>
              <div style={{fontSize:11,color:'var(--text-muted)'}}>{used} of {limit} analyses used</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,fontFamily:'monospace',padding:'4px 10px',borderRadius:6,textTransform:'uppercase',letterSpacing:'0.05em',...(plan==='free'?{color:'#818cf8',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)'}:{color:'#fbbf24',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)'})}}>{plan}</div>
          </div>
          <div style={{height:4,background:'rgba(255,255,255,0.04)',borderRadius:4,overflow:'hidden',marginBottom:14}}>
            <div style={{height:'100%',width:Math.min((used/limit)*100,100)+'%',background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:4,transition:'width 0.5s'}}/>
          </div>
          {plan==='free'&&<Link href='/settings/billing' className='btn-primary' style={{display:'inline-flex',textDecoration:'none'}}><Zap size={13}/>Upgrade Plan</Link>}
        </div>
        <div className='intel-card' style={{padding:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}><Shield size={13} style={{color:'#34d399'}}/><span style={{fontSize:10,fontWeight:700,fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',color:'#34d399'}}>Security</span></div>
          <div style={{fontSize:11,color:'var(--text-muted)',lineHeight:1.5}}>Your account is secured with email and password authentication. Contact support to change your email address.</div>
        </div>
      </div>
    </div>
  )
}