'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return }
      // Hard redirect - forces full page reload so cookies are read fresh
      window.location.href = '/dashboard'
    } catch {
      setError('Network error, please try again')
      setLoading(false)
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" placeholder="you@example.com" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-nf-purple/60"/>
            <input name="password" type="password" placeholder="Password" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full nf-btn-primary py-2.5 rounded-lg disabled:opacity-50">
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
