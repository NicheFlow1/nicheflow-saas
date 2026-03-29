import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { formatRelativeTime, STATUS_COLORS, cn } from '@/lib/utils'
import { Wand2, ChevronRight } from 'lucide-react'
export const revalidate = 0
export default async function ProjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: projects } = await supabase.from('projects').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
  return (
    <div className="flex h-screen bg-nf-bg overflow-hidden">
      <Sidebar profile={profile}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} profile={profile}/>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Projects</h1>
              <Link href="/generator" className="nf-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl"><Wand2 size={14}/> New Business</Link>
            </div>
            {!projects?.length ? (
              <div className="nf-card p-16 text-center">
                <h2 className="text-lg font-bold mb-2">No projects yet</h2>
                <Link href="/generator" className="nf-btn-primary px-6 py-2.5 rounded-xl inline-flex items-center gap-2">Generate First</Link>
              </div>
            ) : (
              <div className="grid gap-3">{projects.map(p => (
                <Link href={'/projects/'+p.id} key={p.id} className="nf-card-hover p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-nf-surface2 flex items-center justify-center">💡</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border', STATUS_COLORS[p.status])}>{p.status}</span>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">{formatRelativeTime(p.updated_at)}</div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground"/>
                </Link>
              ))}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
