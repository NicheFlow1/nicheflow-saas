'use client'
import{useEffect,useState}from'react'
import{useRouter}from'next/navigation'
import{supabase}from'@/lib/supabase/client-singleton'
import Sidebar from'@/components/layout/Sidebar'
import Topbar from'@/components/layout/Topbar'
export default function DashboardLayout({children}:{children:React.ReactNode}){
  const router=useRouter()
  const[user,setUser]=useState<any>(null)
  const[profile,setProfile]=useState<any>(null)
  const[ready,setReady]=useState(false)
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session){router.replace('/auth/login');return}
      setUser(session.user)
      const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data);setReady(true)
    })
  },[])
  if(!ready)return<div className="min-h-screen bg-nf-bg flex items-center justify-center"><div className="text-muted-foreground text-sm">Loading...</div></div>
  return(
    <div className="flex h-screen bg-nf-bg overflow-hidden">
      <Sidebar profile={profile}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} profile={profile}/>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}