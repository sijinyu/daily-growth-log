import { useNavigate } from 'react-router-dom'
import { NicknameForm } from '@/components/auth/NicknameForm'
import { useUserProfile } from '@/hooks/useUserProfile'

export default function NicknamePage() {
  const navigate = useNavigate()
  const { createProfile, isCreating } = useUserProfile()

  async function handleSubmit(nickname: string) {
    await createProfile(nickname)
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-text">
          닉네임 설정
        </h1>
        <p className="mb-8 text-center text-text-secondary">
          다른 사람에게 보여질 이름이에요
        </p>
        <NicknameForm onSubmit={handleSubmit} isSubmitting={isCreating} />
      </div>
    </div>
  )
}
