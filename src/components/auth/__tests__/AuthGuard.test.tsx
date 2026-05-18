import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import { AuthGuard } from '@/components/auth/AuthGuard'
import {
  sessionAtom,
  currentUserAtom,
  authLoadingAtom,
} from '@/stores/auth'
import type { User } from '@/lib/database.types'
import type { Session } from '@supabase/supabase-js'
import type { WritableAtom } from 'jotai'

type AtomValue = readonly [WritableAtom<unknown, [unknown], void>, unknown][]

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

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner when auth is loading', () => {
    renderWithProviders(
      <AuthGuard><div>Protected</div></AuthGuard>,
      {
        initialAtomValues: [
          [authLoadingAtom, true],
        ] as AtomValue,
      },
    )

    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })

  it('renders children when fully authenticated', () => {
    renderWithProviders(
      <AuthGuard><div>Protected</div></AuthGuard>,
      {
        initialAtomValues: [
          [authLoadingAtom, false],
          [sessionAtom, mockSession],
          [currentUserAtom, mockUser],
        ] as AtomValue,
        routerProps: { initialEntries: ['/'] },
      },
    )

    expect(screen.getByText('Protected')).toBeInTheDocument()
  })

  it('redirects to /onboarding when unauthenticated', () => {
    const { container } = renderWithProviders(
      <AuthGuard><div>Protected</div></AuthGuard>,
      {
        initialAtomValues: [
          [authLoadingAtom, false],
          [sessionAtom, null],
          [currentUserAtom, null],
        ] as AtomValue,
        routerProps: { initialEntries: ['/'] },
      },
    )

    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })

  it('redirects to /onboarding/nickname when needs profile', () => {
    renderWithProviders(
      <AuthGuard><div>Protected</div></AuthGuard>,
      {
        initialAtomValues: [
          [authLoadingAtom, false],
          [sessionAtom, mockSession],
          [currentUserAtom, null],
        ] as AtomValue,
        routerProps: { initialEntries: ['/'] },
      },
    )

    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })
})
