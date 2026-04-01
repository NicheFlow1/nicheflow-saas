'use server'
import { createClient } from '@/lib/supabase/server'
export async function signup(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  if (password.length < 8) return { error: 'Password must be at least 8 characters' }
  const { error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } }
  })
  if (error) return { error: error.message }
  return { done: true }
}
