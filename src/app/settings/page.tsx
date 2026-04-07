'use client'
import{useEffect,useState}from'react'
import{supabase}from'@/lib/supabase/client-singleton'
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
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500)
  }
  if(!user)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}><div className='spinner' style={{width:20,height:20,border:'2px solid var(--border-base)',borderTopColor:'var(--brand-purple)'}}/></div>
  return(
    <div style={{maxWidth:520}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:'1.4rem',fontWeight:800,letterSpacing:'-0.025em'}}>Settings</h1><p style={{fontSize:13,color:'var(--text-tertiary)',marginTop:3}}>Manage your account</p></div>
      <div className='card' style={{padding:24,marginBottom:12}}>
        <h3 style={{fontSize:13,fontWeight:700,marginBottom:16}}>Profile</h3>
        <form onSubmit={save}>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:11,color:'var(--text-tertiary)',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Email</label>
            <input value={user.email||''} disabled className='input' style={{opacity:0.5}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:11,color:'var(--text-tertiary)',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Display Name</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder='Your name' className='input'/>
          </div>
          <button type='submit' disabled={saving} className='btn btn-primary'>{saving?'Saving...':saved?'Saved!':'Save Changes'}</button>
        </form>
      </div>
      <div className='card' style={{padding:24}}>
        <h3 style={{fontSize:13,fontWeight:700,marginBottom:6}}>Plan</h3>
        <p style={{fontSize:12,color:'var(--text-tertiary)',marginBottom:16}}>Plan: <strong style={{color:'var(--text-primary)',textTransform:'capitalize'}}>{profile?.plan||'free'}</strong></p>
        <a href='/settings/billing' className='btn btn-ghost'>Manage Billing</a>
      </div>
    </div>
  )
}