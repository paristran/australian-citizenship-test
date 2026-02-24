'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🚀 Starting auth callback...')
        
        // First, try to exchange the code from URL
        const code = searchParams.get('code')
        
        if (code) {
          console.log('📝 Exchanging authorization code...')
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('❌ Code exchange error:', exchangeError)
            throw exchangeError
          }
          
          console.log('✅ Code exchanged successfully')
        }
        
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          throw sessionError
        }

        if (!session) {
          console.error('❌ No session found after code exchange')
          throw new Error('Authentication failed - no session created')
        }

        console.log('✅ User authenticated:', session.user.email)
        
        // Simple redirect to home page
        // The home page will handle showing the logged-in state
        console.log('🏠 Redirecting to home page...')
        
        // Short delay to ensure session is saved
        setTimeout(() => {
          router.push('/')
        }, 500)
        
      } catch (error: any) {
        console.error('❌ Callback error:', error)
        setError(error.message || 'Authentication failed')
        
        // Redirect to home on error after delay
        setTimeout(() => {
          router.push('/')
        }, 3000)
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
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
        <h2 className="text-2xl font-bold mb-2">
          {processing ? 'Signing you in...' : 'Redirecting...'}
        </h2>
        <p className="text-gray-600">You'll be redirected shortly</p>
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
