'use client'
import{useEffect,useState}from 'react'
import Link from 'next/link'
import{supabase}from '@/lib/supabase/client-singleton'
function rel(d:string){const s=Math.floor((Date.now()-new Date(d).getTime())/1000);if(s<60)return s+'s ago';if(s<3600)return Math.floor(s/60)+'m ago';if(s<86400)return Math.floor(s/3600)+'h ago';return Math.floor(s/86400)+'d ago';}
export default function DashboardPage(){
  const[profile,setProfile]=useState<any>(null)
  const[projects,setProjects]=useState<any[]>([])
  const[activity,setActivity]=useState<any[]>([])
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const uid=session.user.id
      const[{data:pr},{data:pj},{data:ac}]=await Promise.all([
        supabase.from('profiles').select('*').eq('id',uid).single(),
        supabase.from('projects').select('*').eq('user_id',uid).order('updated_at',{ascending:false}).limit(5),
        supabase.from('activity_feed').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(8)
      ])
      setProfile(pr);setProjects(pj||[]);setActivity(ac||[]);setLoading(false)
    })
  },[])
  if(loading)return<div className="flex items-center justify-center h-64"><div className="text-muted-foreground text-sm">Loading...</div></div>
  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/generator" className="nf-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">Generate Business</Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="nf-card p-5"><div className="text-xs font-mono text-muted-foreground mb-1">PROJECTS</div><div className="text-3xl font-bold">{projects.length}</div></div>
        <div className="nf-card p-5"><div className="text-xs font-mono text-muted-foreground mb-1">GENERATIONS</div><div className="text-3xl font-bold">{profile?.generations_used||0}/{profile?.generations_limit||7}</div></div>
        <div className="nf-card p-5"><div className="text-xs font-mono text-muted-foreground mb-1">PLAN</div><div className="text-3xl font-bold capitalize">{profile?.plan||'free'}</div></div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 nf-card overflow-hidden">
          <div className="flex justify-between px-5 py-4 border-b border-nf-border"><h2 className="text-sm font-semibold">Recent Projects</h2><Link href="/projects" className="text-xs text-nf-purple">View all</Link></div>
          {!projects.length?(
            <div className="p-8 text-center"><p className="text-sm text-muted-foreground mb-4">No projects yet.</p><Link href="/generator" className="nf-btn-primary text-xs px-4 py-2 rounded-lg">Start generating</Link></div>
          ):(
            <div>{projects.map(p=>(
              <Link href={'/projects/'+p.id} key={p.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-nf-border last:border-0 hover:bg-nf-surface2">
                <div className="w-9 h-9 rounded-lg bg-nf-surface2 flex items-center justify-center text-sm font-bold">{p.name[0].toUpperCase()}</div>
                <div className="flex-1"><div className="text-sm font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{rel(p.updated_at)}</div></div>
                <span className="text-xs px-2 py-0.5 rounded-full border border-nf-border">{p.status}</span>
              </Link>
            ))}</div>
          )}
        </div>
        <div className="nf-card overflow-hidden">
          <div className="px-5 py-4 border-b border-nf-border"><h2 className="text-sm font-semibold">Activity</h2></div>
          {!activity.length?(<p className="p-6 text-xs text-muted-foreground">No activity yet</p>):(
            <div className="divide-y divide-nf-border">{activity.map(a=>(
              <div key={a.id} className="px-5 py-3 flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-nf-purple mt-1.5"/><p className="text-xs text-muted-foreground">{a.message}</p></div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  )
}