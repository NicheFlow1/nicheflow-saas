'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
const supabase = createClient('https://aincmpxokmsygyghvtnm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U')
export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return }
      setUser(session.user)
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(data)
      setLoading(false)
    })
  }, [])
  if (loading) return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  )
  return (
    <div className="flex h-screen bg-nf-bg overflow-hidden">
      <Sidebar profile={profile}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} profile={profile}/>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
