import { supabase } from '@/lib/supabase'
import type { AuthProvider } from '@/lib/database.types'

export async function signInWithOAuth(provider: AuthProvider) {
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}
