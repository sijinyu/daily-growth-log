import { describe, it, expect } from 'vitest'
import { createStore } from 'jotai'
import {
  sessionAtom,
  currentUserAtom,
  authLoadingAtom,
  authStatusAtom,
} from '@/stores/auth'
import type { User } from '@/lib/database.types'

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
}

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

describe('auth atoms', () => {
  it('sessionAtom defaults to null', () => {
    const store = createStore()
    expect(store.get(sessionAtom)).toBeNull()
  })

  it('currentUserAtom defaults to null', () => {
    const store = createStore()
    expect(store.get(currentUserAtom)).toBeNull()
  })

  it('authLoadingAtom defaults to true', () => {
    const store = createStore()
    expect(store.get(authLoadingAtom)).toBe(true)
  })
})

describe('authStatusAtom', () => {
  it('returns "unauthenticated" when loading is false and session is null', () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, null)
    store.set(currentUserAtom, null)

    expect(store.get(authStatusAtom)).toBe('unauthenticated')
  })

  it('returns "loading" when authLoading is true', () => {
    const store = createStore()
    store.set(authLoadingAtom, true)

    expect(store.get(authStatusAtom)).toBe('loading')
  })

  it('returns "needs_profile" when session exists but no user profile', () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, mockSession)
    store.set(currentUserAtom, null)

    expect(store.get(authStatusAtom)).toBe('needs_profile')
  })

  it('returns "authenticated" when session and user profile both exist', () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, mockSession)
    store.set(currentUserAtom, mockUser)

    expect(store.get(authStatusAtom)).toBe('authenticated')
  })
})
