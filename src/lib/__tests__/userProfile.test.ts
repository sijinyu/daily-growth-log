import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase'
import { fetchUserProfile, createUserProfile } from '@/lib/userProfile'
import type { User } from '@/lib/database.types'

const mockSupabase = vi.mocked(supabase)

const mockUser: User = {
  id: 'user-123',
  nickname: '테스터',
  email: 'test@example.com',
  auth_provider: 'kakao',
  points: 0,
  level: 1,
  streak: 0,
  longest_streak: 0,
  last_active_date: null,
  subscription_tier: 'free',
  is_private: false,
  push_enabled: true,
  invited_by: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('fetchUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user profile when it exists', async () => {
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: mockUser,
      error: null,
    })
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as ReturnType<typeof mockSupabase.from>)

    const result = await fetchUserProfile('user-123')

    expect(mockSupabase.from).toHaveBeenCalledWith('users')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
    expect(result).toEqual({ data: mockUser, error: null })
  })

  it('returns null data when profile does not exist', async () => {
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    })
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as ReturnType<typeof mockSupabase.from>)

    const result = await fetchUserProfile('user-456')

    expect(result).toEqual({ data: null, error: null })
  })

  it('returns error when query fails', async () => {
    const dbError = { message: 'DB error', details: '', hint: '', code: '500' }
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: dbError,
    })
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as ReturnType<typeof mockSupabase.from>)

    const result = await fetchUserProfile('user-123')

    expect(result.error).toEqual(dbError)
  })
})

describe('createUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('inserts a new user profile with required fields', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockUser,
      error: null,
    })
    const mockSelectAfterInsert = vi.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectAfterInsert })
    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as ReturnType<typeof mockSupabase.from>)

    const result = await createUserProfile({
      id: 'user-123',
      nickname: '테스터',
      auth_provider: 'kakao',
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('users')
    expect(mockInsert).toHaveBeenCalledWith({
      id: 'user-123',
      nickname: '테스터',
      auth_provider: 'kakao',
    })
    expect(result).toEqual({ data: mockUser, error: null })
  })

  it('returns error when insert fails (e.g. duplicate nickname)', async () => {
    const dbError = {
      message: 'duplicate key value',
      details: '',
      hint: '',
      code: '23505',
    }
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: dbError,
    })
    const mockSelectAfterInsert = vi.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectAfterInsert })
    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as ReturnType<typeof mockSupabase.from>)

    const result = await createUserProfile({
      id: 'user-123',
      nickname: '중복닉',
      auth_provider: 'kakao',
    })

    expect(result.error).toEqual(dbError)
  })
})
