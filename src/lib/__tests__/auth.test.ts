import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase'
import { signInWithOAuth, signOut, getSession } from '@/lib/auth'

const mockSupabase = vi.mocked(supabase)

describe('signInWithOAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signInWithOAuth with kakao provider', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { provider: 'kakao', url: 'https://kakao-login.com' },
      error: null,
    })

    const result = await signInWithOAuth('kakao')

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'kakao',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    })
    expect(result.error).toBeNull()
  })

  it('calls supabase.auth.signInWithOAuth with google provider', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { provider: 'google', url: 'https://google-login.com' },
      error: null,
    })

    const result = await signInWithOAuth('google')

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    })
    expect(result.error).toBeNull()
  })

  it('returns error when OAuth fails', async () => {
    const authError = { message: 'OAuth failed', name: 'AuthError', status: 500 }
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { provider: 'kakao', url: null },
      error: authError,
    })

    const result = await signInWithOAuth('kakao')

    expect(result.error).toEqual(authError)
  })
})

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signOut', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const result = await signOut()

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    expect(result.error).toBeNull()
  })

  it('returns error when sign out fails', async () => {
    const authError = { message: 'Sign out failed', name: 'AuthError', status: 500 }
    mockSupabase.auth.signOut.mockResolvedValue({ error: authError })

    const result = await signOut()

    expect(result.error).toEqual(authError)
  })
})

describe('getSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session when authenticated', async () => {
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
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })

    const result = await getSession()

    expect(result.data.session).toEqual(mockSession)
    expect(result.error).toBeNull()
  })

  it('returns null session when not authenticated', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const result = await getSession()

    expect(result.data.session).toBeNull()
    expect(result.error).toBeNull()
  })
})
