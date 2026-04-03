'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://aincmpxokmsygyghvtnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U',
  { auth: { persistSession: true, storageKey: 'nf-auth', storage: typeof window !== 'undefined' ? window.localStorage : undefined } }
)
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    window.location.href = '/dashboard'
  }
  return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nf-purple to-nf-pink flex items-center justify-center text-white font-bold font-mono text-sm">NF</div>
            <span className="font-bold text-lg">NicheFlow</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
        </div>
        <div className="nf-card p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-nf-purple/60"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading} className="w-full nf-btn-primary py-2.5 rounded-lg disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            No account? <Link href="/auth/signup" className="text-nf-purple">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
