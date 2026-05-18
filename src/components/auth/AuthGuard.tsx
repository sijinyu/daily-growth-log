import { Navigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { authStatusAtom } from '@/stores/auth'

interface AuthGuardProps {
  readonly children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const status = useAtomValue(authStatusAtom)

  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/onboarding" replace />
  }

  if (status === 'needs_profile') {
    return <Navigate to="/onboarding/nickname" replace />
  }

  return children
}
