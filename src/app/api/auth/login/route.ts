import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
const SUPA_URL = 'https://aincmpxokmsygyghvtnm.supabase.co'
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
export const dynamic = 'force-dynamic'
type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  // Capture cookies that supabase wants to set
  const cookiesToSet: CookieToSet[] = []
  const supabase = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cs) {
        // Capture ALL cookies supabase wants to set
        cs.forEach(c => cookiesToSet.push(c))
      }
    }
  })
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: error.message }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store, private' }
    })
  }
  // Build response and manually apply every captured cookie
  const res = NextResponse.json({ success: true, email: data.user?.email }, {
    headers: { 'Cache-Control': 'no-store, private' }
  })
  cookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, {
      ...(options as Record<string, unknown>),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    })
  })
  return res
}
