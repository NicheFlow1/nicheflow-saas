import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatRelativeTime, STATUS_COLORS, cn } from '@/lib/utils'
import { Wand2 } from 'lucide-react'
export const revalidate = 0
export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: profile }, { data: projects }, { data: activity }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('projects').select('*').eq('user_id', user!.id).order('updated_at', { ascending: false }).limit(5),
    supabase.from('activity_feed').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(8)
  ])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/generator" className="nf-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl">
          <Wand2 size={15}/> Generate Business
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="nf-card p-5">
          <div className="text-xs font-mono text-muted-foreground mb-1">PROJECTS</div>
          <div className="text-3xl font-bold">{projects?.length || 0}</div>
        </div>
        <div className="nf-card p-5">
          <div className="text-xs font-mono text-muted-foreground mb-1">GENERATIONS</div>
          <div className="text-3xl font-bold">{profile?.generations_used || 0}/{profile?.generations_limit || 7}</div>
        </div>
        <div className="nf-card p-5">
          <div className="text-xs font-mono text-muted-foreground mb-1">PLAN</div>
          <div className="text-3xl font-bold capitalize">{profile?.plan || 'free'}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 nf-card overflow-hidden">
          <div className="flex justify-between px-5 py-4 border-b border-nf-border">
            <h2 className="text-sm font-semibold">Recent Projects</h2>
            <Link href="/projects" className="text-xs text-nf-purple">View all</Link>
          </div>
          {!projects?.length ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">No projects yet.</p>
              <Link href="/generator" className="nf-btn-primary text-xs px-4 py-2 rounded-lg">Start generating</Link>
            </div>
          ) : (
            <div>{projects.map(p => (
              <Link href={'/projects/' + p.id} key={p.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-nf-border last:border-0 hover:bg-nf-surface2">
                <div className="w-9 h-9 rounded-lg bg-nf-surface2 flex items-center justify-center">{p.status[0].toUpperCase()}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{formatRelativeTime(p.updated_at)}</div>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full border', STATUS_COLORS[p.status])}>{p.status}</span>
              </Link>
            ))}</div>
          )}
        </div>
        <div className="nf-card overflow-hidden">
          <div className="px-5 py-4 border-b border-nf-border"><h2 className="text-sm font-semibold">Activity</h2></div>
          {!activity?.length ? (
            <p className="p-6 text-xs text-muted-foreground">No activity yet</p>
          ) : (
            <div className="divide-y divide-nf-border">{activity.map(a => (
              <div key={a.id} className="px-5 py-3 flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-nf-purple mt-1.5"/>
                <p className="text-xs text-muted-foreground">{a.message}</p>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  )
}
