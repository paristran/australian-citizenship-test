'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/login')
          return
        }

        if (session) {
          // Check if user has completed profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile && !profile.australian_council) {
            // Profile exists but not complete
            toast.success('Welcome! Please complete your profile.')
            router.push('/complete-profile')
          } else if (profile) {
            // Profile complete
            toast.success('Welcome back!')
            router.push('/dashboard')
          } else {
            // New user, need to complete profile
            toast.success('Account created! Please complete your profile.')
            router.push('/complete-profile')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        toast.error('An error occurred')
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
        <h2 className="text-2xl font-bold mb-2">Completing sign in...</h2>
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
