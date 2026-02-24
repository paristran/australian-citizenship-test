'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Starting auth callback...')
        
        // Get the session from the URL hash/params
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session check:', { session: !!session, error: sessionError })
        
        if (sessionError) {
          console.error('Auth callback error:', sessionError)
          setError(sessionError.message)
          toast.error('Authentication failed')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        if (!session) {
          console.log('No session found, trying to exchange code...')
          
          // Try to get session from URL params
          const accessToken = searchParams.get('access_token')
          const refreshToken = searchParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (error) {
              console.error('Session exchange error:', error)
              setError(error.message)
              setTimeout(() => router.push('/login'), 2000)
              return
            }
            
            console.log('Session exchanged successfully')
          } else {
            console.log('No tokens in URL, redirecting to login')
            router.push('/login')
            return
          }
        }

        // Get the final session
        const { data: { session: finalSession } } = await supabase.auth.getSession()
        
        if (finalSession) {
          console.log('User authenticated:', finalSession.user.email)
          
          // Check if user has completed profile
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', finalSession.user.id)
            .single()

          console.log('Profile check:', { profile: !!profile, error: profileError })

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError)
          }

          if (profile && !profile.australian_council) {
            // Profile exists but not complete
            console.log('Redirecting to complete-profile')
            toast.success('Welcome! Please complete your profile.')
            router.push('/complete-profile')
          } else if (profile) {
            // Profile complete
            console.log('Redirecting to dashboard')
            toast.success('Welcome back!')
            router.push('/dashboard')
          } else {
            // New user, profile will be created by trigger
            // Wait a moment for trigger to complete
            setTimeout(() => {
              console.log('Redirecting new user to complete-profile')
              toast.success('Account created! Please complete your profile.')
              router.push('/complete-profile')
            }, 1000)
          }
        } else {
          console.log('No final session, redirecting to login')
          router.push('/login')
        }
      } catch (error: any) {
        console.error('Callback handling error:', error)
        setError(error.message || 'An unknown error occurred')
        setTimeout(() => router.push('/login'), 2000)
      } finally {
        setProcessing(false)
      }
    }

    handleCallback()
  }, [router, searchParams, supabase])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
        <h2 className="text-2xl font-bold mb-2">
          {processing ? 'Completing sign in...' : 'Redirecting...'}
        </h2>
        <p className="text-gray-600">Please wait a moment</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
