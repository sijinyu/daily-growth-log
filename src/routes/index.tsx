import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import type { RouteObject } from 'react-router-dom'

const HomePage = lazy(() => import('@/pages/HomePage'))
const WritePage = lazy(() => import('@/pages/WritePage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const NicknamePage = lazy(() => import('@/pages/NicknamePage'))

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

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
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
  {
    path: '/onboarding/nickname',
    element: (
      <SuspenseWrapper>
        <NicknamePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <SuspenseWrapper>
        <AuthCallbackHandler />
      </SuspenseWrapper>
    ),
  },
]

function AuthCallbackHandler() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export const router = createBrowserRouter(routeConfig)
