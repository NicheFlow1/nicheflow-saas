'use client'
import{useState}from'react'
import Link from'next/link'
import{supabase}from'@/lib/supabase/client-singleton'
import{Zap,AlertCircle,CheckCircle}from'lucide-react'

export default function SignupPage(){
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[name,setName]=useState('')
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState('')
  const[done,setDone]=useState(false)

  async function handleSignup(e:React.FormEvent){
    e.preventDefault()
    setLoading(true);setError('')
    const{data,error:err}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}})
    if(err){setError(err.message);setLoading(false);return}
    if(data.user){
      await supabase.from('profiles').upsert({id:data.user.id,email,full_name:name,plan:'free',generations_used:0,generations_limit:7})
      window.location.replace('/dashboard')
    }
  }

  if(done)return(
    <div style={{minHeight:'100vh',background:'var(--bg-base)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}><CheckCircle size={40} style={{color:'var(--success)',margin:'0 auto 16px'}}/><h2 style={{fontWeight:800,marginBottom:8}}>Check your email</h2><p style={{color:'var(--text-tertiary)',fontSize:13}}>We sent a confirmation link to {email}</p></div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-base)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)',backgroundSize:'48px 48px',pointerEvents:'none'}}/>
      <div style={{position:'fixed',top:'20%',left:'50%',transform:'translateX(-50%)',width:600,height:600,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 65%)',pointerEvents:'none'}}/>
      
      <div style={{width:'100%',maxWidth:400,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{width:44,height:44,borderRadius:14,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'white',margin:'0 auto 14px',boxShadow:'0 8px 24px rgba(99,102,241,0.35)'}}>NF</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:900,letterSpacing:'-0.03em',color:'var(--text-primary)',marginBottom:6}}>Create your account</h1>
          <p style={{fontSize:13,color:'var(--text-tertiary)'}}>7 free validations. No credit card required.</p>
        </div>

        <div style={{background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:'var(--radius-2xl)',padding:28}}>
          <form onSubmit={handleSignup}>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>Name</label>
              <input type='text' value={name} onChange={e=>setName(e.target.value)} placeholder='Your name' required className='input' style={{fontSize:14}}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>Email</label>
              <input type='email' value={email} onChange={e=>setEmail(e.target.value)} placeholder='you@example.com' required className='input' style={{fontSize:14}}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>Password</label>
              <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Min 6 characters' required minLength={6} className='input' style={{fontSize:14}}/>
            </div>
            {error&&(
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'var(--surface-nogo)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'var(--radius-md)',marginBottom:16}}>
                <AlertCircle size={13} style={{color:'var(--danger)',flexShrink:0}}/>
                <span style={{fontSize:12,color:'var(--danger)'}}>{error}</span>
              </div>
            )}
            <button type='submit' disabled={loading||!email||!password||!name} className='btn btn-grad' style={{width:'100%',justifyContent:'center',padding:'11px 20px',fontSize:14,fontWeight:700,borderRadius:'var(--radius-lg)'}}>
              {loading?<><div className='spinner' style={{width:15,height:15,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white'}}/>Creating account...</>:<><Zap size={14}/>Create account</>}
            </button>
          </form>
        </div>
        <p style={{textAlign:'center',fontSize:13,color:'var(--text-tertiary)',marginTop:20}}>Already have an account? <Link href='/auth/login' style={{color:'var(--brand-purple)',fontWeight:600,textDecoration:'none'}}>Sign in</Link></p>
      </div>
    </div>
  )
}