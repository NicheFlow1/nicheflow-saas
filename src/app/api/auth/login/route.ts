import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
const SUPA_URL = 'https://aincmpxokmsygyghvtnm.supabase.co'
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  // Create the response first so supabase can write cookies to it
  const response = NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store, private' } }
  )
  const supabase = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, { ...options, sameSite: 'lax', secure: true, httpOnly: true, path: '/' })
        )
      }
    }
  })
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401, headers: { 'Cache-Control': 'no-store, private' } }
    )
  }
  // Patch the response JSON body while keeping the cookies already set
  const body = JSON.stringify({ success: true, email: data.user?.email })
  const finalResponse = new NextResponse(body, {
    status: 200,
    headers: response.headers
  })
  finalResponse.headers.set('Content-Type', 'application/json')
  finalResponse.headers.set('Cache-Control', 'no-store, private')
  return finalResponse
}
