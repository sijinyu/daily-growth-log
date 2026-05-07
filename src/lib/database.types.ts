export type AuthProvider = 'kakao' | 'google'
export type SubscriptionTier = 'free' | 'premium'
export type ActivityType =
  | 'daily_login'
  | 'post'
  | 'first_post_bonus'
  | 'cheer_received'
  | 'cheer_sent'
  | 'streak_3'
  | 'streak_7'
  | 'invite_bonus'
  | 'invited_bonus'
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed'

export interface User {
  id: string
  nickname: string
  email: string | null
  auth_provider: AuthProvider
  points: number
  level: number
  streak: number
  longest_streak: number
  last_active_date: string | null
  subscription_tier: SubscriptionTier
  is_private: boolean
  push_enabled: boolean
  invited_by: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  image_url: string | null
  is_private: boolean
  cheers_count: number
  reported: boolean
  date: string
  created_at: string
}

export interface Cheer {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  type: ActivityType
  points: number
  date: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  post_id: string
  reason: string
  status: ReportStatus
  created_at: string
}

export interface InviteCode {
  id: string
  code: string
  creator_id: string
  used_by: string | null
  created_at: string
  used_at: string | null
}

export interface PostWithUser extends Post {
  user: Pick<User, 'id' | 'nickname' | 'level'>
}
