import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider as JotaiProvider, createStore } from 'jotai'
import { useAuthInitializer } from '@/hooks/useAuthInitializer'
import { sessionAtom, authLoadingAtom, currentUserAtom } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const mockSupabase = vi.mocked(supabase)

vi.mock('@/lib/userProfile', () => ({
  fetchUserProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

import { fetchUserProfile } from '@/lib/userProfile'

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
}

describe('useAuthInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets authLoading to false after initialization', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const store = createStore()

    renderHook(() => useAuthInitializer(), {
      wrapper: ({ children }) => (
        <JotaiProvider store={store}>{children}</JotaiProvider>
      ),
    })

    await waitFor(() => {
      expect(store.get(authLoadingAtom)).toBe(false)
    })
  })

  it('sets session when getSession returns a session', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })

    const store = createStore()

    renderHook(() => useAuthInitializer(), {
      wrapper: ({ children }) => (
        <JotaiProvider store={store}>{children}</JotaiProvider>
      ),
    })

    await waitFor(() => {
      expect(store.get(sessionAtom)).toEqual(mockSession)
    })
  })

  it('fetches user profile when session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })
    vi.mocked(fetchUserProfile).mockResolvedValue({
      data: {
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
      },
      error: null,
    })

    const store = createStore()

    renderHook(() => useAuthInitializer(), {
      wrapper: ({ children }) => (
        <JotaiProvider store={store}>{children}</JotaiProvider>
      ),
    })

    await waitFor(() => {
      expect(fetchUserProfile).toHaveBeenCalledWith('user-123')
      expect(store.get(currentUserAtom)).not.toBeNull()
    })
  })

  it('registers onAuthStateChange listener', () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const store = createStore()

    renderHook(() => useAuthInitializer(), {
      wrapper: ({ children }) => (
        <JotaiProvider store={store}>{children}</JotaiProvider>
      ),
    })

    expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled()
  })
})
