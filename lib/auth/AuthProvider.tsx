'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { UserProfile } from '@/types/auth'
import { Toaster } from 'react-hot-toast'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  
  // Only create Supabase client if env vars are available
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient()
    : null

  const fetchProfile = async (userId: string) => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (!error && data) {
      setProfile(data)
    }
  }

  // Initial session load + auth state listener
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Initial session check:', session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase?.auth])

  // Force session check on mount and pathname change (for server-side OAuth logins)
  useEffect(() => {
    if (!supabase) return

    const checkSession = async () => {
      const { data: { session: newSession } } = await supabase.auth.getSession()
      
      console.log('Session check on mount/nav:', newSession?.user?.email, 'current user:', user?.email)
      
      // If we have a new session but state doesn't reflect it, update
      if (newSession?.user && (!user || user.id !== newSession.user.id)) {
        console.log('Updating session from navigation check')
        setSession(newSession)
        setUser(newSession.user)
        await fetchProfile(newSession.user.id)
        setLoading(false)
      }
    }

    // Small delay to ensure cookies are available
    const timeoutId = setTimeout(checkSession, 100)
    return () => clearTimeout(timeoutId)
  }, [pathname, supabase])

  // Refresh session on window focus
  useEffect(() => {
    if (!supabase) return

    const handleFocus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && !user) {
        console.log('Session detected on focus, refreshing...')
        setSession(session)
        setUser(session.user)
        await fetchProfile(session.user.id)
        setLoading(false)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [supabase, user])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      router.push('/dashboard')
    }
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
  }

  const signInWithGoogle = async () => {
    if (!supabase) return
    
    // Production URL fallback
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 
                        (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                          ? 'https://www.getcitizenship.com.au' 
                          : window.location.origin)
    
    console.log('OAuth redirect URL:', `${redirectUrl}/auth/callback`)
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`
      }
    })
  }

  const signInWithFacebook = async () => {
    if (!supabase) return
    
    // Production URL fallback
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 
                        (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                          ? 'https://www.getcitizenship.com.au' 
                          : window.location.origin)
    
    console.log('OAuth redirect URL:', `${redirectUrl}/auth/callback`)
    
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`
      }
    })
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') }
    if (!supabase) return { error: new Error('Supabase not configured') }
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    
    if (!error) {
      await fetchProfile(user.id)
    }
    
    return { error }
  }

  const refreshProfile = async () => {
    if (user && supabase) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      signInWithFacebook,
      updateProfile,
      refreshProfile
    }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#00D26A',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
