'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: location.origin + '/api/auth/callback' }
    })
    setLoading(false)
    if (error) toast.error(error.message)
    else setDone(true)
  }
  if (done) return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p>Confirmation sent to {email}</p>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">7 free AI generations - no card needed</p>
        </div>
        <div className="nf-card p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8}
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <button type="submit" disabled={loading} className="w-full nf-btn-primary py-2.5 rounded-lg disabled:opacity-50">
              {loading ? 'Creating...' : 'Create free account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">Have an account? <Link href="/auth/login" className="text-nf-purple">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
