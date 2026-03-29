'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }
  async function handleMagicLink() {
    if (!email) { toast.error('Enter your email first'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + '/api/auth/callback' } })
    setLoading(false)
    if (error) toast.error(error.message)
    else toast.success('Magic link sent!')
  }
  return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nf-purple to-nf-pink flex items-center justify-center text-white font-bold font-mono">NF</div>
            <span className="font-bold text-lg">NicheFlow</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
        </div>
        <div className="nf-card p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-nf-purple/60"/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <button type="submit" disabled={loading} className="w-full nf-btn-primary py-2.5 rounded-lg disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <button onClick={handleMagicLink} disabled={loading} className="w-full nf-btn-ghost border border-nf-border py-2.5 rounded-lg mt-4">
            Send magic link
          </button>
          <p className="text-center text-sm text-muted-foreground mt-6">No account? <Link href="/auth/signup" className="text-nf-purple">Create one free</Link></p>
        </div>
      </div>
    </div>
  )
}
