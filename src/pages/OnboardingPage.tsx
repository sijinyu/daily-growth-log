import { OAuthButtons } from '@/components/auth/OAuthButtons'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-text">하루한줄</h1>
        <p className="text-text-secondary">어제보다 1% 나아졌나요?</p>
      </div>
      <div className="w-full max-w-sm">
        <OAuthButtons />
      </div>
    </div>
  )
}
