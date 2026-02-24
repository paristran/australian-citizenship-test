'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)
  const [status, setStatus] = useState('Starting...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Initializing...')
        console.log('🚀 Starting auth callback...')
        
        // Create fresh client
        const supabase = createClient()
        
        // Check for code in URL
        const code = searchParams.get('code')
        
        if (!code) {
          console.log('⚠️ No code in URL, checking existing session...')
          setStatus('Checking session...')
          
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            console.log('✅ Existing session found:', session.user.email)
            setStatus('Redirecting...')
            router.replace('/')
            return
          }
          
          throw new Error('No authorization code or session found')
        }
        
        console.log('📝 Exchanging authorization code...')
        setStatus('Exchanging code...')
        
        // Exchange code for session with timeout
        const exchangePromise = supabase.auth.exchangeCodeForSession(code)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Code exchange timed out')), 10000)
        )
        
        const { data, error: exchangeError } = await Promise.race([
          exchangePromise,
          timeoutPromise
        ]) as any
        
        if (exchangeError) {
          console.error('❌ Code exchange error:', exchangeError)
          throw exchangeError
        }
        
        console.log('✅ Code exchanged successfully')
        setStatus('Verifying session...')
        
        // Small delay to let the session persist
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Verify session was created
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
        setStatus('Redirecting...')
        
        // Use replace instead of push to avoid history issues
        router.replace('/')
        
      } catch (error: any) {
        console.error('❌ Callback error:', error)
        setError(error.message || 'Authentication failed')
        setProcessing(false)
        
        // Redirect to login on error after delay
        setTimeout(() => {
          router.replace('/login?error=' + encodeURIComponent(error.message || 'auth_failed'))
        }, 2000)
      }
    }

    handleCallback()
  }, [router, searchParams])

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
        <h2 className="text-2xl font-bold mb-2">Signing you in...</h2>
        <p className="text-gray-600">{status}</p>
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
