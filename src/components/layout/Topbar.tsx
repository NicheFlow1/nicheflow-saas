'use client'
import{Bell,Command,Search}from'lucide-react'

export default function Topbar({user,profile}:{user:any,profile:any}){
  const name=profile?.full_name||user?.email?.split('@')[0]||'User'
  const initials=name.slice(0,2).toUpperCase()
  const plan=profile?.plan||'free'
  return(
    <header className='topbar'>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div className='topbar-search'>
          <Search size={12} style={{color:'var(--text-muted)',flexShrink:0}}/>
          <input placeholder='Search opportunities...' style={{background:'none',border:'none',outline:'none',fontSize:12,color:'var(--text-primary)',width:'100%'}}/>
          <div style={{display:'flex',alignItems:'center',gap:2,padding:'2px 6px',background:'var(--bg-subtle)',borderRadius:5,border:'1px solid var(--border)'}}>
            <Command size={9} style={{color:'var(--text-muted)'}}/>
            <span style={{fontSize:9,color:'var(--text-muted)',fontFamily:'monospace'}}>K</span>
          </div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:8}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:'#34d399',boxShadow:'0 0 6px rgba(52,211,153,0.6)'}}/>
          <span style={{fontSize:10,fontFamily:'monospace',fontWeight:600,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Live</span>
        </div>
        <button style={{width:30,height:30,borderRadius:8,background:'var(--bg-subtle)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)',transition:'all 0.15s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-hover)';e.currentTarget.style.color='var(--text-primary)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-muted)'}}>  
          <Bell size={13}/>
        </button>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 10px 4px 4px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:10,cursor:'pointer',transition:'all 0.15s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--border-hover)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
          <div style={{width:26,height:26,borderRadius:8,background:'linear-gradient(135deg,var(--indigo),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'white'}}>{initials}</div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:'var(--text-primary)',lineHeight:1.2}}>{name}</div>
            <div style={{fontSize:9,color:'var(--text-muted)',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.04em'}}>{plan}</div>
          </div>
        </div>
      </div>
    </header>
  )
}