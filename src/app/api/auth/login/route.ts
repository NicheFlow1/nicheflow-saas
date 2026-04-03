import { NextResponse, type NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
const SUPA_URL = 'https://aincmpxokmsygyghvtnm.supabase.co'
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
const PROJECT_REF = 'aincmpxokmsygyghvtnm'
// Max cookie size is 4096 bytes - chunk large values
function chunkCookie(name: string, value: string): Array<{name: string; value: string}> {
  const CHUNK_SIZE = 3180
  if (value.length <= CHUNK_SIZE) return [{ name, value }]
  const chunks: Array<{name: string; value: string}> = []
  let i = 0
  let offset = 0
  while (offset < value.length) {
    chunks.push({ name: i === 0 ? name : name + '.' + i, value: value.slice(offset, offset + CHUNK_SIZE) })
    offset += CHUNK_SIZE
    i++
  }
  return chunks
}
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  // Call Supabase REST directly
  const authRes = await fetch(SUPA_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPA_ANON, 'Authorization': 'Bearer ' + SUPA_ANON },
    body: JSON.stringify({ email, password })
  })
  if (!authRes.ok) {
    const err = await authRes.json().catch(() => ({}))
    return NextResponse.json(
      { error: err.error_description || err.msg || 'Invalid credentials' },
      { status: 401, headers: { 'Cache-Control': 'no-store, private' } }
    )
  }
  const session = await authRes.json()
  const { access_token, refresh_token, expires_in, user } = session
  const expiresAt = Math.floor(Date.now() / 1000) + (expires_in || 3600)
  // Build the session object that @supabase/ssr stores in the cookie
  const sessionObj = JSON.stringify({ access_token, refresh_token, expires_in, expires_at: expiresAt, token_type: 'bearer', user })
  const res = NextResponse.json(
    { success: true, email: user?.email },
    { headers: { 'Cache-Control': 'no-store, private' } }
  )
  const cookieBase = 'sb-' + PROJECT_REF + '-auth-token'
  const cookieOpts = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: expires_in || 3600 }
  // Chunk the session value and set each chunk as a separate cookie
  const chunks = chunkCookie(cookieBase, sessionObj)
  chunks.forEach(({ name, value }) => res.cookies.set(name, value, cookieOpts))
  return res
}
