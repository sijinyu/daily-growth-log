import { atom } from 'jotai'
import type { Session } from '@supabase/supabase-js'
import type { User } from '@/lib/database.types'

export type AuthStatus =
  | 'loading'
  | 'unauthenticated'
  | 'needs_profile'
  | 'authenticated'

export const sessionAtom = atom<Session | null>(null)
export const currentUserAtom = atom<User | null>(null)
export const authLoadingAtom = atom<boolean>(true)

export const authStatusAtom = atom<AuthStatus>((get): AuthStatus => {
  const loading = get(authLoadingAtom)
  if (loading) return 'loading'

  const session = get(sessionAtom)
  if (!session) return 'unauthenticated'

  const user = get(currentUserAtom)
  if (!user) return 'needs_profile'

  return 'authenticated'
})
