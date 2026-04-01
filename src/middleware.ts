import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    'https://aincmpxokmsygyghvtnm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U',
    { cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cs) {
        cs.forEach(({name,value})=>request.cookies.set(name,value))
        response=NextResponse.next({request})
        cs.forEach(({name,value,options})=>response.cookies.set(name,value,options))
      }
    }}
  )
  await supabase.auth.getUser()
  return response
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']}