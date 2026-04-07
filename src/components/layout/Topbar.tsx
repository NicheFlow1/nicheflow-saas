'use client'
export default function Topbar({user,profile}:{user:any,profile:any}){
  const plan=profile?.plan||'free'
  const initial=(user?.email||'?')[0].toUpperCase()
  const name=profile?.full_name?profile.full_name.split(' ')[0]:'Intelligence OS'
  return(
    <header className='topbar'>
      <div className='topbar-title'>Welcome back, {name}</div>
      <div className='topbar-right'>
        <span className={'plan-badge '+(plan==='free'?'plan-free':'plan-pro')}>{plan}</span>
        <div className='avatar'>{initial}</div>
      </div>
    </header>
  )
}