'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signup } from './actions'
export default function SignupForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await signup(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
    else if (result?.done) setDone(true)
  }
  if (done) return (
    <div className="min-h-screen bg-nf-bg flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-muted-foreground text-sm">Click the confirmation link to activate your account</p>
        <Link href="/auth/login" className="text-nf-purple text-sm mt-4 block">Back to login</Link>
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
          <form action={handleSubmit} className="space-y-4">
            <input name="fullName" type="text" placeholder="Your name" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <input name="email" type="email" placeholder="you@example.com" required
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            <input name="password" type="password" placeholder="Min. 8 characters" required minLength={8}
              className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-2.5 text-sm focus:outline-none"/>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full nf-btn-primary py-2.5 rounded-lg disabled:opacity-50">
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
