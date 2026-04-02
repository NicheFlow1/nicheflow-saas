import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
const SUPA_URL = 'https://aincmpxokmsygyghvtnm.supabase.co'
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U'
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  // Create the response object FIRST so we can write cookies to it
  const response = NextResponse.json({ success: true })
  // Create supabase client that writes cookies directly to our response
  const supabase = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      }
    }
  })
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
  // Update the response body with user info
  // The cookies are already set on 'response' via setAll above
  const successResponse = NextResponse.json(
    { success: true, email: data.user?.email },
    { status: 200, headers: response.headers }
  )
  return successResponse
}
