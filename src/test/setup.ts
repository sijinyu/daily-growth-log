import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Prevent real Supabase API calls in all tests
vi.mock('@/lib/supabase', () => {
  const fn = vi.fn
  return {
    supabase: {
      auth: {
        getSession: fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        signInWithOAuth: fn().mockResolvedValue({
          data: {},
          error: null,
        }),
        signOut: fn().mockResolvedValue({ error: null }),
        onAuthStateChange: fn(() => ({
          data: {
            subscription: { id: 'mock-sub', unsubscribe: fn() },
          },
        })),
      },
      from: fn().mockReturnValue({
        select: fn().mockReturnValue({
          eq: fn().mockReturnValue({
            single: fn().mockResolvedValue({ data: null, error: null }),
            maybeSingle: fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
        insert: fn().mockReturnValue({
          select: fn().mockReturnValue({
            single: fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        update: fn().mockReturnValue({
          eq: fn().mockReturnValue({
            select: fn().mockReturnValue({
              single: fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      }),
    },
  }
})
