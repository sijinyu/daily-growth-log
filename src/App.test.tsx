import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '@/test/helpers/renderWithProviders'
import { screen } from '@testing-library/react'
import HomePage from '@/pages/HomePage'

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
