'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('Starting...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Initializing...')
        const supabase = createClient()
        
        const code = searchParams.get('code')
        
        if (!code) {
          throw new Error('No authorization code found')
        }
        
        setStatus('Exchanging code...')
        
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          throw exchangeError
        }
        
        if (!data.session) {
          throw new Error('No session created')
        }
        
        setStatus('Success! Redirecting...')
        
        // Small delay to ensure session is persisted
        await new Promise(resolve => setTimeout(resolve, 500))
        
        router.replace('/')
        
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setError(error.message || 'Authentication failed')
        
        setTimeout(() => {
          router.replace('/login?error=' + encodeURIComponent(error.message))
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
