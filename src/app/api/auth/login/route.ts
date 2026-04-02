import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
const SUPA_URL = 'https://aincmpxokmsygyghvtnm.supabase.co'
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const response = NextResponse.json({ success: false })
  const supabase = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        // THIS is the key - set cookies directly on the response object
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      }
    }
  })
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
  // Return success with the session cookies properly attached
  response.cookies.getAll() // trigger cookie flush
  const successResponse = NextResponse.json({ success: true, email: data.user?.email })
  // Copy all cookies from supabase client to the success response  
  const supabase2 = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          successResponse.cookies.set(name, value, { ...options, httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
        )
      }
    }
  })
  await supabase2.auth.signInWithPassword({ email, password })
  return successResponse
}
