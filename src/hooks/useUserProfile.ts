import { useAtomValue, useSetAtom } from 'jotai'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { sessionAtom, currentUserAtom } from '@/stores/auth'
import { fetchUserProfile, createUserProfile } from '@/lib/userProfile'
import type { AuthProvider } from '@/lib/database.types'

export function useUserProfile() {
  const session = useAtomValue(sessionAtom)
  const setCurrentUser = useSetAtom(currentUserAtom)
  const queryClient = useQueryClient()

  const userId = session?.user.id ?? null

  const profileQuery = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null
      const { data, error } = await fetchUserProfile(userId)
      if (error) throw error
      if (data) setCurrentUser(data)
      return data
    },
    enabled: !!userId,
  })

  const createProfileMutation = useMutation({
    mutationFn: async (nickname: string) => {
      if (!userId || !session) throw new Error('No session')
      const provider =
        (session.user.app_metadata.provider as AuthProvider) ?? 'kakao'
      const { data, error } = await createUserProfile({
        id: userId,
        nickname,
        auth_provider: provider,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      if (data) {
        setCurrentUser(data)
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      }
    },
  })

  const createProfile = useCallback(
    (nickname: string) => createProfileMutation.mutateAsync(nickname),
    [createProfileMutation],
  )

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    createProfile,
    isCreating: createProfileMutation.isPending,
  } as const
}
