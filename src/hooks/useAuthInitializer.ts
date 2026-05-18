import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { sessionAtom, authLoadingAtom, currentUserAtom } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import { fetchUserProfile } from '@/lib/userProfile'

export function useAuthInitializer() {
  const setSession = useSetAtom(sessionAtom)
  const setAuthLoading = useSetAtom(authLoadingAtom)
  const setCurrentUser = useSetAtom(currentUserAtom)

  useEffect(() => {
    async function initSession() {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      setSession(session)

      if (session) {
        const { data: profile } = await fetchUserProfile(session.user.id)
        if (profile) {
          setCurrentUser(profile)
        }
      }

      setAuthLoading(false)
    }

    initSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)

        if (session) {
          const { data: profile } = await fetchUserProfile(session.user.id)
          setCurrentUser(profile ?? null)
        } else {
          setCurrentUser(null)
        }
      },
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [setSession, setAuthLoading, setCurrentUser])
}
