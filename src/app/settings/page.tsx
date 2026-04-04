'use client'
import{useEffect,useState}from 'react'
import{supabase}from '@/lib/supabase/client-singleton'
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
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2000)
  }
  if(!user)return<div className="flex items-center justify-center h-64"><div className="text-muted-foreground text-sm">Loading...</div></div>
  return(
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="nf-card p-6">
        <h2 className="text-sm font-semibold mb-4">Profile</h2>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Email</label>
            <input value={user.email||''} disabled className="w-full bg-nf-surface3 border border-nf-border rounded-lg px-4 py-2.5 text-sm opacity-50"/>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Full Name</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
          </div>
          <button type="submit" disabled={saving} className="nf-btn-primary px-5 py-2 rounded-lg text-sm disabled:opacity-50">
            {saving?'Saving...':saved?'Saved!':'Save Changes'}
          </button>
        </form>
      </div>
      <div className="nf-card p-6">
        <h2 className="text-sm font-semibold mb-1">Plan</h2>
        <p className="text-xs text-muted-foreground mb-3">Current plan: <span className="capitalize font-medium text-foreground">{profile?.plan||'free'}</span></p>
        <a href="/settings/billing" className="nf-btn-primary px-4 py-2 rounded-lg text-sm">Manage Billing</a>
      </div>
    </div>
  )
}