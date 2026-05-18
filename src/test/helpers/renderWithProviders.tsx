import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { WritableAtom } from 'jotai'

type AtomValue = readonly [
  WritableAtom<unknown, [unknown], void>,
  unknown,
][]

function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: AtomValue
  children: React.ReactNode
}) {
  useHydrateAtoms(initialValues)
  return children
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  readonly routerProps?: MemoryRouterProps
  readonly initialAtomValues?: AtomValue
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { routerProps, initialAtomValues = [], ...renderOptions } = options

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <HydrateAtoms initialValues={initialAtomValues}>
            <MemoryRouter {...routerProps}>{children}</MemoryRouter>
          </HydrateAtoms>
        </JotaiProvider>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}
