import { useState } from 'react'

const MIN_LENGTH = 2
const MAX_LENGTH = 10

interface NicknameFormProps {
  readonly onSubmit: (nickname: string) => Promise<void> | void
  readonly isSubmitting?: boolean
}

export function NicknameForm({ onSubmit, isSubmitting = false }: NicknameFormProps) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)

  function validate(value: string): string | null {
    if (value.length < MIN_LENGTH) return `${MIN_LENGTH}자 이상 입력해주세요`
    if (value.length > MAX_LENGTH) return `${MAX_LENGTH}자 이하로 입력해주세요`
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = nickname.trim()
    const validationError = validate(trimmed)

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    await onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            setError(null)
          }}
          placeholder="닉네임을 입력하세요"
          maxLength={MAX_LENGTH + 5}
          className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-text outline-none transition-colors focus:border-primary"
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white transition-opacity disabled:opacity-50"
      >
        시작하기
      </button>
    </form>
  )
}
