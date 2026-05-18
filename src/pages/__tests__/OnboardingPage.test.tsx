import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import OnboardingPage from '@/pages/OnboardingPage'
import { authLoadingAtom } from '@/stores/auth'
import type { WritableAtom } from 'jotai'

type AtomValue = readonly [WritableAtom<unknown, [unknown], void>, unknown][]

vi.mock('@/lib/auth', () => ({
  signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn(),
}))

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the tagline', () => {
    renderWithProviders(<OnboardingPage />, {
      initialAtomValues: [[authLoadingAtom, false]] as AtomValue,
    })

    expect(screen.getByText('어제보다 1% 나아졌나요?')).toBeInTheDocument()
  })

  it('renders OAuth login buttons', () => {
    renderWithProviders(<OnboardingPage />, {
      initialAtomValues: [[authLoadingAtom, false]] as AtomValue,
    })

    expect(screen.getByRole('button', { name: /카카오/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /구글/i })).toBeInTheDocument()
  })
})
