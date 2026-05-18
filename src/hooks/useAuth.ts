import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import {
  sessionAtom,
  currentUserAtom,
  authStatusAtom,
} from '@/stores/auth'
import { signInWithOAuth, signOut } from '@/lib/auth'
import type { AuthProvider } from '@/lib/database.types'

export function useAuth() {
  const session = useAtomValue(sessionAtom)
  const user = useAtomValue(currentUserAtom)
  const status = useAtomValue(authStatusAtom)

  const signIn = useCallback(
    (provider: AuthProvider) => signInWithOAuth(provider),
    [],
  )

  const handleSignOut = useCallback(() => signOut(), [])

  return { session, user, status, signIn, handleSignOut } as const
}
