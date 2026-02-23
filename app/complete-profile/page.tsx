'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

const AUSTRALIAN_COUNCILS = [
  // New South Wales
  'City of Sydney',
  'City of Parramatta',
  'City of Newcastle',
  'Wollongong City Council',
  'City of Randwick',
  // Victoria
  'City of Melbourne',
  'City of Port Phillip',
  'City of Yarra',
  'City of Moreland',
  'City of Stonnington',
  // Queensland
  'Brisbane City Council',
  'Gold Coast City Council',
  'Sunshine Coast Council',
  'Cairns Regional Council',
  'Townsville City Council',
  // Western Australia
  'City of Perth',
  'City of Fremantle',
  'City of Stirling',
  'City of Joondalup',
  'City of Cockburn',
  // South Australia
  'City of Adelaide',
  'City of Holdfast Bay',
  'City of Port Adelaide Enfield',
  'City of Tea Tree Gully',
  'City of Onkaparinga',
  // Tasmania
  'City of Hobart',
  'City of Launceston',
  'City of Glenorchy',
  'City of Clarence',
  // Australian Capital Territory
  'ACT Government',
  // Northern Territory
  'City of Darwin',
  'City of Palmerston',
].sort()

export default function CompleteProfilePage() {
  const { user, profile, updateProfile, refreshProfile } = useAuth()
  const [council, setCouncil] = useState(profile?.australian_council || '')
  const [applicationDate, setApplicationDate] = useState(
    profile?.citizenship_application_date || ''
  )
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateProfile({
      australian_council: council,
      citizenship_application_date: applicationDate,
    })

    if (error) {
      toast.error('Failed to save profile')
    } else {
      toast.success('Profile completed!')
      await refreshProfile()
      router.push('/dashboard')
    }

    setLoading(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Help us personalize your experience
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="council">
              Your Local Council
            </label>
            <select
              id="council"
              value={council}
              onChange={(e) => setCouncil(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select your council...</option>
              {AUSTRALIAN_COUNCILS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              We'll show council-specific information
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="applicationDate">
              Citizenship Application Date (Optional)
            </label>
            <input
              id="applicationDate"
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send you reminders and tips before your test
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>

          <Link
            href="/dashboard"
            className="block text-center mt-4 text-sm text-gray-600 hover:text-gray-700"
          >
            Skip for now →
          </Link>
        </form>
      </div>
    </div>
  )
}
