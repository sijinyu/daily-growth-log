import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider, createStore } from 'jotai'
import {
  sessionAtom,
  currentUserAtom,
  authLoadingAtom,
} from '@/stores/auth'
import { routeConfig } from '@/routes'
import type { User } from '@/lib/database.types'
import type { Session } from '@supabase/supabase-js'

vi.mock('@/lib/auth', () => ({
  signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
}))

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

function renderRoute(initialPath: string, store: ReturnType<typeof createStore>) {
  const router = createMemoryRouter(routeConfig, {
    initialEntries: [initialPath],
  })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <RouterProvider router={router} />
      </JotaiProvider>
    </QueryClientProvider>,
  )
}

describe('routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated user from / to /onboarding', async () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, null)
    store.set(currentUserAtom, null)

    renderRoute('/', store)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카카오/i })).toBeInTheDocument()
    })
  })

  it('shows home page for authenticated user', async () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, mockSession)
    store.set(currentUserAtom, mockUser)

    renderRoute('/', store)

    await waitFor(() => {
      expect(screen.getByText('하루한줄')).toBeInTheDocument()
    })
  })

  it('allows access to /onboarding without auth', async () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, null)

    renderRoute('/onboarding', store)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카카오/i })).toBeInTheDocument()
    })
  })

  it('renders /onboarding/nickname route', async () => {
    const store = createStore()
    store.set(authLoadingAtom, false)
    store.set(sessionAtom, mockSession)
    store.set(currentUserAtom, null)

    renderRoute('/onboarding/nickname', store)

    await waitFor(() => {
      expect(screen.getByText(/닉네임 설정/i)).toBeInTheDocument()
    })
  })
})
