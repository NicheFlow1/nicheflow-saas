'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Wand2, FolderOpen, Settings, Zap, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils'
import { PLAN_LIMITS } from '@/types/database'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/generator', label: 'Generator', icon: Wand2 },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const plan = profile?.plan || 'free'
  const used = profile?.generations_used || 0
  const limit = profile?.generations_limit || 7
  const pct = Math.min((used / limit) * 100, 100)

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-nf-surface border-r border-nf-border flex flex-col h-full">
      <div className="px-5 py-5 border-b border-nf-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nf-purple to-nf-pink flex items-center justify-center text-white font-bold text-xs font-mono">NF</div>
          <div>
            <div className="font-bold text-sm">NicheFlow</div>
            <div className="text-xs font-mono text-muted-foreground">AI Startup OS</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active ? 'bg-nf-surface3 text-foreground border border-nf-border2' : 'text-muted-foreground hover:bg-nf-surface2 hover:text-foreground border border-transparent'
              )}>
              <Icon size={15}/> {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-3 border-t border-nf-border pt-3">
        <div className="bg-nf-surface2 border border-nf-border rounded-xl p-3 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-nf-purple">{PLAN_LIMITS[plan].label}</span>
            <Zap size={12} className="text-nf-amber"/>
          </div>
          <div className="text-xs text-muted-foreground mb-2">{used}/{limit} generations</div>
          <div className="h-1 bg-nf-surface3 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-nf-purple to-nf-pink rounded-full" style={{width: pct + '%'}}/>
          </div>
          {plan === 'free' && <Link href="/settings/billing" className="block mt-2 text-xs text-nf-purple hover:underline">Upgrade plan</Link>}
        </div>
        <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-nf-surface2">
          <LogOut size={13}/> Sign out
        </button>
      </div>
    </aside>
  )
}
