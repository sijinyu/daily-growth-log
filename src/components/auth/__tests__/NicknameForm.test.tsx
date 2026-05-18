import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import { NicknameForm } from '@/components/auth/NicknameForm'

describe('NicknameForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('renders nickname input and submit button', () => {
    renderWithProviders(<NicknameForm onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText(/닉네임/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /시작/i })).toBeInTheDocument()
  })

  it('shows error when nickname is too short (less than 2 chars)', async () => {
    const user = userEvent.setup()

    renderWithProviders(<NicknameForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText(/닉네임/i)
    await user.type(input, '가')
    await user.click(screen.getByRole('button', { name: /시작/i }))

    expect(screen.getByText(/2자 이상/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows error when nickname is too long (more than 10 chars)', async () => {
    const user = userEvent.setup()

    renderWithProviders(<NicknameForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText(/닉네임/i)
    await user.type(input, '가나다라마바사아자차카')
    await user.click(screen.getByRole('button', { name: /시작/i }))

    expect(screen.getByText(/10자 이하/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid nickname (2-10 chars)', async () => {
    const user = userEvent.setup()

    renderWithProviders(<NicknameForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText(/닉네임/i)
    await user.type(input, '좋은이름')
    await user.click(screen.getByRole('button', { name: /시작/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith('좋은이름')
  })

  it('trims whitespace before validation', async () => {
    const user = userEvent.setup()

    renderWithProviders(<NicknameForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText(/닉네임/i)
    await user.type(input, '  좋은이름  ')
    await user.click(screen.getByRole('button', { name: /시작/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith('좋은이름')
  })

  it('disables button while submitting', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <NicknameForm onSubmit={mockOnSubmit} isSubmitting />,
    )

    expect(screen.getByRole('button', { name: /시작/i })).toBeDisabled()
  })
})
