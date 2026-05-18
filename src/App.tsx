import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/routes'
import { useAuthInitializer } from '@/hooks/useAuthInitializer'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInitializer()
  return children
}

export default function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
