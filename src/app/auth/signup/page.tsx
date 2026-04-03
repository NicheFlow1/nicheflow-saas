'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://aincmpxokmsygyghvtnm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U')
export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }
  if (done) return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Account created!</h2>
        <p className="text-muted-foreground text-sm mb-4">Check your email for a confirmation link, then sign in.</p>
        <Link href="/auth/login" className="text-nf-purple">Go to login</Link>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">7 free AI generations — no card needed</p>
        </div>
        <div className="nf-card p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your name" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8}
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading} className="w-full nf-btn-primary py-2.5 rounded-lg disabled:opacity-50">
              {loading ? 'Creating...' : 'Create free account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Have an account? <Link href="/auth/login" className="text-nf-purple">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
