'use client'
import{useEffect,useState}from 'react'
import Link from 'next/link'
import{supabase}from '@/lib/supabase/client-singleton'
function rel(d:string){const s=Math.floor((Date.now()-new Date(d).getTime())/1000);if(s<60)return s+'s ago';if(s<3600)return Math.floor(s/60)+'m ago';if(s<86400)return Math.floor(s/3600)+'h ago';return Math.floor(s/86400)+'d ago';}
export default function ProjectsPage(){
  const[projects,setProjects]=useState<any[]>([])
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const{data}=await supabase.from('projects').select('*').eq('user_id',session.user.id).order('updated_at',{ascending:false})
      setProjects(data||[]);setLoading(false)
    })
  },[])
  if(loading)return<div className="flex items-center justify-center h-64"><div className="text-muted-foreground text-sm">Loading...</div></div>
  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/generator" className="nf-btn-primary px-4 py-2 rounded-xl text-sm">New Project</Link>
      </div>
      {!projects.length?(
        <div className="nf-card p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No projects yet. Generate your first business idea!</p>
          <Link href="/generator" className="nf-btn-primary px-4 py-2 rounded-lg text-sm">Get Started</Link>
        </div>
      ):(
        <div className="grid grid-cols-2 gap-4">{projects.map(p=>(
          <Link href={'/projects/'+p.id} key={p.id} className="nf-card p-5 hover:border-nf-purple/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nf-purple/20 to-nf-pink/20 flex items-center justify-center font-bold">{p.name[0].toUpperCase()}</div>
              <span className="text-xs px-2 py-0.5 rounded-full border border-nf-border">{p.status}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground">{rel(p.updated_at)}</p>
          </Link>
        ))}</div>
      )}
    </div>
  )
}