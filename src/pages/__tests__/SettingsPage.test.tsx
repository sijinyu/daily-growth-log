import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import SettingsPage from '@/pages/SettingsPage'
import { sessionAtom, currentUserAtom, authLoadingAtom } from '@/stores/auth'
import type { WritableAtom } from 'jotai'
import type { User } from '@/lib/database.types'
import type { Session } from '@supabase/supabase-js'

type AtomValue = readonly [WritableAtom<unknown, [unknown], void>, unknown][]

vi.mock('@/lib/auth', () => ({
  signInWithOAuth: vi.fn(),
  signOut: vi.fn().mockResolvedValue({ error: null }),
}))

import { signOut } from '@/lib/auth'

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

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders settings title', () => {
    renderWithProviders(<SettingsPage />, {
      initialAtomValues: [
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, mockUser],
      ] as AtomValue,
    })

    expect(screen.getByText('설정')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    renderWithProviders(<SettingsPage />, {
      initialAtomValues: [
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, mockUser],
      ] as AtomValue,
    })

    expect(screen.getByRole('button', { name: /로그아웃/i })).toBeInTheDocument()
  })

  it('calls signOut when logout button is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<SettingsPage />, {
      initialAtomValues: [
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, mockUser],
      ] as AtomValue,
    })

    await user.click(screen.getByRole('button', { name: /로그아웃/i }))

    expect(signOut).toHaveBeenCalled()
  })
})
