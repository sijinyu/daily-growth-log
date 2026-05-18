import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import NicknamePage from '@/pages/NicknamePage'
import { sessionAtom, authLoadingAtom, currentUserAtom } from '@/stores/auth'
import type { WritableAtom } from 'jotai'
import type { Session } from '@supabase/supabase-js'

type AtomValue = readonly [WritableAtom<unknown, [unknown], void>, unknown][]

vi.mock('@/lib/userProfile', () => ({
  fetchUserProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
  createUserProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

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

describe('NicknamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nickname form', () => {
    renderWithProviders(<NicknamePage />, {
      initialAtomValues: [
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, null],
      ] as AtomValue,
    })

    expect(screen.getByPlaceholderText(/닉네임/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /시작/i })).toBeInTheDocument()
  })

  it('shows page title', () => {
    renderWithProviders(<NicknamePage />, {
      initialAtomValues: [
        [authLoadingAtom, false],
        [sessionAtom, mockSession],
        [currentUserAtom, null],
      ] as AtomValue,
    })

    expect(screen.getByText(/닉네임 설정/i)).toBeInTheDocument()
  })
})
