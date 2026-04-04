import{createClient}from'@supabase/supabase-js'
let client:ReturnType<typeof createClient>|null=null
export function getSupabase(){
  if(!client)client=createClient('https://aincmpxokmsygyghvtnm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbmNtcHhva21zeWd5Z2h2dG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODQ4NzAsImV4cCI6MjA4OTg2MDg3MH0.qy9k6S3pgNv7CPnvJlgqeGzgzHBB0J59cCWVsbSa75U')
  return client
}
export const supabase=getSupabase()