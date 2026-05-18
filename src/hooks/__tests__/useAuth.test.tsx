import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  sessionAtom,
  currentUserAtom,
  authLoadingAtom,
} from '@/stores/auth'
import type { User } from '@/lib/database.types'
import type { Session } from '@supabase/supabase-js'

vi.mock('@/lib/auth', () => ({
  signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
}))

import { signInWithOAuth, signOut } from '@/lib/auth'

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
    app_metadata: {},
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
  | [typeof authLoadingAtom, boolean]

function createWrapper(initialValues: AtomValues[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <JotaiProvider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </JotaiProvider>
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

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthenticated status when no session', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper([
        [authLoadingAtom, false],
        [sessionAtom, null],
        [currentUserAtom, null],
      ]),
    })

    expect(result.current.status).toBe('unauthenticated')
    expect(result.current.session).toBeNull()
    expect(result.current.user).toBeNull()
  })

  it('returns authenticated status when session and user exist', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper([
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, mockUser],
      ]),
    })

    expect(result.current.status).toBe('authenticated')
    expect(result.current.session).toEqual(mockSession)
    expect(result.current.user).toEqual(mockUser)
  })

  it('returns needs_profile when session exists but no user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper([
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, null],
      ]),
    })

    expect(result.current.status).toBe('needs_profile')
  })

  it('provides signIn function that calls signInWithOAuth', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper([
        [authLoadingAtom, false],
      ]),
    })

    await act(async () => {
      await result.current.signIn('kakao')
    })

    expect(signInWithOAuth).toHaveBeenCalledWith('kakao')
  })

  it('provides handleSignOut function that calls signOut', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper([
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, mockUser],
      ]),
    })

    await act(async () => {
      await result.current.handleSignOut()
    })

    expect(signOut).toHaveBeenCalled()
  })
})
