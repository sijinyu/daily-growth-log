import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { handleSignOut } = useAuth()

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <h1 className="mb-6 text-xl font-bold text-text">설정</h1>
      <div className="mt-auto">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-xl border border-red-200 px-4 py-3 text-red-500 transition-colors hover:bg-red-50"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
