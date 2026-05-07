import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import HomePage from '@/pages/HomePage'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HomePage', () => {
  it('renders the app title', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('하루한줄')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('딱 한 줄이면 충분합니다')).toBeInTheDocument()
  })
})
