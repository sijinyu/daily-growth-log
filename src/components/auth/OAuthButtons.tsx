import { useState } from 'react'
import { signInWithOAuth } from '@/lib/auth'
import type { AuthProvider } from '@/lib/database.types'

export function OAuthButtons() {
  const [loading, setLoading] = useState<AuthProvider | null>(null)

  async function handleSignIn(provider: AuthProvider) {
    setLoading(provider)
    await signInWithOAuth(provider)
    setLoading(null)
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <button
        type="button"
        onClick={() => handleSignIn('kakao')}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3 font-medium text-[#191919] transition-opacity disabled:opacity-50"
      >
        {loading === 'kakao' ? '로그인 중...' : '카카오로 시작하기'}
      </button>
      <button
        type="button"
        onClick={() => handleSignIn('google')}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-opacity disabled:opacity-50"
      >
        {loading === 'google' ? '로그인 중...' : '구글로 시작하기'}
      </button>
    </div>
  )
}
