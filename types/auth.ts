import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  full_name: string | null
  australian_council: string | null
  citizenship_application_date: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName: string
}

export interface SignInCredentials {
  email: string
  password: string
}
