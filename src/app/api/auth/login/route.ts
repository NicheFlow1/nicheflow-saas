import { NextResponse, type NextRequest } from 'next/server'
const SUPA_URL = 'https://aincmpxokmsygyghvtnm.supabase.co'
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  // Call Supabase Auth REST API directly
  const authRes = await fetch(SUPA_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPA_ANON,
      'Authorization': 'Bearer ' + SUPA_ANON,
    },
    body: JSON.stringify({ email, password })
  })
  if (!authRes.ok) {
    const err = await authRes.json()
    return NextResponse.json({ error: err.error_description || err.msg || 'Invalid credentials' }, { status: 401 })
  }
  const session = await authRes.json()
  const { access_token, refresh_token, expires_in } = session
  // Build response and manually set the auth cookies that @supabase/ssr expects
  const response = NextResponse.json({ success: true, email: session.user?.email })
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: expires_in
  }
  // Set the exact cookie names that @supabase/ssr reads
  const projectRef = 'aincmpxokmsygyghvtnm'
  response.cookies.set('sb-' + projectRef + '-auth-token', JSON.stringify({
    access_token,
    refresh_token,
    expires_in,
    expires_at: Math.floor(Date.now() / 1000) + expires_in,
    token_type: 'bearer',
    user: session.user
  }), cookieOpts)
  response.cookies.set('sb-' + projectRef + '-auth-token-code-verifier', '', { ...cookieOpts, maxAge: 0 })
  return response
}
