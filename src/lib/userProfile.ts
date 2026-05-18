import { supabase } from '@/lib/supabase'
import type { AuthProvider, User } from '@/lib/database.types'

interface CreateUserProfileInput {
  readonly id: string
  readonly nickname: string
  readonly auth_provider: AuthProvider
}

export async function fetchUserProfile(
  userId: string,
): Promise<{ data: User | null; error: unknown }> {
  return supabase.from('users').select('*').eq('id', userId).maybeSingle()
}

export async function createUserProfile(
  input: CreateUserProfileInput,
): Promise<{ data: User | null; error: unknown }> {
  return supabase.from('users').insert(input).select().single()
}
