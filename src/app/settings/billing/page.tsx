import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import BillingClient from './BillingClient'
export const revalidate = 0
export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return (
    <div className="flex h-screen bg-nf-bg overflow-hidden">
      <Sidebar profile={profile}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} profile={profile}/>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <BillingClient profile={profile}/>
        </main>
      </div>
    </div>
  )
}
