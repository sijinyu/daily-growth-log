import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useUserProfile } from '@/hooks/useUserProfile'
import { sessionAtom, currentUserAtom } from '@/stores/auth'
import type { User } from '@/lib/database.types'
import type { Session } from '@supabase/supabase-js'

vi.mock('@/lib/userProfile', () => ({
  fetchUserProfile: vi.fn(),
  createUserProfile: vi.fn(),
}))

import { fetchUserProfile, createUserProfile } from '@/lib/userProfile'

const mockSession = {
  access_token: 'token',
  refresh_token: 'refresh',
  expires_in: 3600,
  expires_at: 9999999999,
  token_type: 'bearer' as const,
  user: {
    id: 'user-123',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    app_metadata: { provider: 'kakao' },
    user_metadata: {},
    identities: [],
    created_at: '2024-01-01',
  },
} satisfies Session

const mockUser: User = {
  id: 'user-123',
  nickname: '테스터',
  email: 'test@example.com',
  auth_provider: 'kakao',
  points: 0,
  level: 1,
  streak: 0,
  longest_streak: 0,
  last_active_date: null,
  subscription_tier: 'free',
  is_private: false,
  push_enabled: true,
  invited_by: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

type AtomValues = [typeof sessionAtom, Session | null]
  | [typeof currentUserAtom, User | null]

function createWrapper(initialValues: AtomValues[] = []) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <HydrateAtoms initialValues={initialValues}>
            {children}
          </HydrateAtoms>
        </JotaiProvider>
      </QueryClientProvider>
    )
  }
}

function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: AtomValues[]
  children: React.ReactNode
}) {
  useHydrateAtoms(initialValues)
  return children
}

describe('useUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch profile when no session', () => {
    renderHook(() => useUserProfile(), {
      wrapper: createWrapper([[sessionAtom, null]]),
    })

    expect(fetchUserProfile).not.toHaveBeenCalled()
  })

  it('fetches profile when session exists', async () => {
    vi.mocked(fetchUserProfile).mockResolvedValue({
      data: mockUser,
      error: null,
    })

    renderHook(() => useUserProfile(), {
      wrapper: createWrapper([[sessionAtom, mockSession]]),
    })

    await waitFor(() => {
      expect(fetchUserProfile).toHaveBeenCalledWith('user-123')
    })
  })

  it('provides createProfile mutation', async () => {
    vi.mocked(createUserProfile).mockResolvedValue({
      data: mockUser,
      error: null,
    })

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper([[sessionAtom, mockSession]]),
    })

    expect(result.current.createProfile).toBeDefined()
    expect(typeof result.current.createProfile).toBe('function')
  })
})
