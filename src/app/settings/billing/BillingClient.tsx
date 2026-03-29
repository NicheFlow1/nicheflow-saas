'use client'
import { useState } from 'react'
import { PLAN_LIMITS } from '@/types/database'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Check } from 'lucide-react'
export default function BillingClient({ profile }: { profile: Profile | null }) {
  const [loading, setLoading] = useState<string|null>(null)
  const currentPlan = profile?.plan || 'free'
  async function handleUpgrade(plan: 'pro' | 'premium') {
    if (currentPlan === plan) return
    setLoading(plan)
    try {
      const res = await fetch('/api/nowpayments', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({plan}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.invoice_url
    } catch(err) { toast.error(String(err)); setLoading(null) }
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Billing and Plans</h1>
      <p className="text-muted-foreground">Pay with crypto via NowPayments - BTC, ETH, USDT and 100+ more</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="nf-card p-6">
          <div className="text-xs font-mono text-muted-foreground mb-1">FREE</div>
          <div className="text-3xl font-bold mb-4">$0</div>
          <ul className="space-y-2 mb-6">{PLAN_LIMITS.free.features.map((f,i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground"><Check size={12} className="text-nf-teal"/>{f}</li>
          ))}</ul>
          <button disabled className="w-full py-2.5 rounded-xl text-sm border border-nf-border opacity-60">Free Forever</button>
        </div>
        <div className={cn('nf-card p-6', currentPlan==='pro'?'border-nf-purple/50':'glow-purple border-nf-purple/30')}>
          <div className="text-xs font-mono text-nf-purple mb-1">PRO</div>
          <div className="text-3xl font-bold mb-4">$29<span className="text-base text-muted-foreground">/mo</span></div>
          <ul className="space-y-2 mb-6">{PLAN_LIMITS.pro.features.map((f,i) => (
            <li key={i} className="flex items-center gap-2 text-xs"><Check size={12} className="text-nf-teal"/>{f}</li>
          ))}</ul>
          <button onClick={() => handleUpgrade('pro')} disabled={currentPlan==='pro'||!!loading}
            className={cn('w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2', currentPlan==='pro'?'opacity-60':'bg-nf-purple text-white')}>
            {loading==='pro'?'Redirecting...':currentPlan==='pro'?'Current Plan':'Upgrade with Crypto'}
          </button>
        </div>
        <div className="nf-card p-6">
          <div className="text-xs font-mono text-nf-pink mb-1">PREMIUM</div>
          <div className="text-3xl font-bold mb-4">$79<span className="text-base text-muted-foreground">/mo</span></div>
          <ul className="space-y-2 mb-6">{PLAN_LIMITS.premium.features.map((f,i) => (
            <li key={i} className="flex items-center gap-2 text-xs"><Check size={12} className="text-nf-teal"/>{f}</li>
          ))}</ul>
          <button onClick={() => handleUpgrade('premium')} disabled={currentPlan==='premium'||!!loading}
            className={cn('w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2', currentPlan==='premium'?'opacity-60':'bg-nf-pink/90 text-white')}>
            {loading==='premium'?'Redirecting...':currentPlan==='premium'?'Current Plan':'Upgrade with Crypto'}
          </button>
        </div>
      </div>
    </div>
  )
}
