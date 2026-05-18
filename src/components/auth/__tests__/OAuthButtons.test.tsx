import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { authLoadingAtom } from '@/stores/auth'
import type { WritableAtom } from 'jotai'

type AtomValue = readonly [WritableAtom<unknown, [unknown], void>, unknown][]

vi.mock('@/lib/auth', () => ({
  signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn(),
}))

import { signInWithOAuth } from '@/lib/auth'

describe('OAuthButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders kakao and google login buttons', () => {
    renderWithProviders(<OAuthButtons />, {
      initialAtomValues: [[authLoadingAtom, false]] as AtomValue,
    })

    expect(screen.getByRole('button', { name: /카카오/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /구글/i })).toBeInTheDocument()
  })

  it('calls signInWithOAuth with kakao when kakao button is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<OAuthButtons />, {
      initialAtomValues: [[authLoadingAtom, false]] as AtomValue,
    })

    await user.click(screen.getByRole('button', { name: /카카오/i }))

    expect(signInWithOAuth).toHaveBeenCalledWith('kakao')
  })

  it('calls signInWithOAuth with google when google button is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<OAuthButtons />, {
      initialAtomValues: [[authLoadingAtom, false]] as AtomValue,
    })

    await user.click(screen.getByRole('button', { name: /구글/i }))

    expect(signInWithOAuth).toHaveBeenCalledWith('google')
  })
})
