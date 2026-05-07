import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const WritePage = lazy(() => import('@/pages/WritePage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'write',
        element: (
          <SuspenseWrapper>
            <WritePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <SuspenseWrapper>
            <LeaderboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/onboarding',
    element: (
      <SuspenseWrapper>
        <OnboardingPage />
      </SuspenseWrapper>
    ),
  },
])
